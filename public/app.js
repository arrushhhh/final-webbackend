const tokenKey = "unt_token";
const roleKey = "unt_role";

function setAuth(token, role) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(roleKey, role || "user");
}
function clearAuth() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(roleKey);
}
function getToken() {
  return localStorage.getItem(tokenKey);
}

function show(view) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("view--active");
  });
  const targetView = document.getElementById(`view-${view}`);
  if (targetView) {
    targetView.classList.add("view--active");
    // Scroll to top of view
    targetView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => show(btn.dataset.view));
});

async function api(path, { method="GET", body } = {}) {
  const headers = { "Content-Type":"application/json" };
  const t = getToken();
  if (t) headers.Authorization = "Bearer " + t;

  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/** AUTH **/
document.getElementById("btnRegister").onclick = async () => {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await api("/register", { method:"POST", body:{ fullName, email, password } });
    setAuth(data.token, data.role);
    document.getElementById("authMsg").textContent = "✅ Successfully registered and logged in!";
  } catch (e) {
    document.getElementById("authMsg").textContent = "⚠️ " + e.message;
  }
};

document.getElementById("btnLogin").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await api("/login", { method:"POST", body:{ email, password } });
    setAuth(data.token, data.role);
    document.getElementById("authMsg").textContent = "✅ Successfully logged in!";
  } catch (e) {
    document.getElementById("authMsg").textContent = "⚠️ " + e.message;
  }
};

document.getElementById("btnLogout").onclick = () => {
  clearAuth();
  document.getElementById("authMsg").textContent = "👋 You have been logged out";
};

/** UNIVERSITIES **/
document.getElementById("btnLoadUnis").onclick = async () => {
  const q = document.getElementById("uniQ").value.trim();
  const city = document.getElementById("uniCity").value.trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (city) params.set("city", city);

  const data = await api("/universities?" + params.toString());
  const box = document.getElementById("uniList");
  box.innerHTML = data.items.map(u => `
  <div class="uni-card">
    <h3 class="uni-name">${u.name}</h3>
    <span class="uni-city">${u.city}</span>

    <p class="uni-description">
      ${
        u.website
          ? `<a href="${u.website}" target="_blank" rel="noopener noreferrer" class="uni-link">
               Official website
             </a>`
          : "No website available"
      }
    </p>
  </div>
`).join("");
};

/** NEWS **/
async function loadNews() {
  try {
    const universityId = document.getElementById("newsUniversityId").value.trim();
    const params = new URLSearchParams();
    if (universityId) params.set("universityId", universityId);

    const data = await api("/news?" + params.toString());
    const box = document.getElementById("newsList");
    
    if (data.items && data.items.length > 0) {
      box.innerHTML = data.items.map(n => `
        <div class="news-item">
          <h3 class="news-title">${n.title}</h3>
          <div class="news-date">${new Date(n.publishedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <p class="news-content">${n.content}</p>
        </div>
      `).join("");
    } else {
      box.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style="margin: 0 auto 1rem;">
            <path d="M32 8v48M8 32h48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <h3 style="margin-bottom: 0.5rem;">No News Available</h3>
          <p style="color: var(--color-text-muted);">There are currently no news items${universityId ? ' for this university' : ' to display'}.</p>
        </div>
      `;
    }
  } catch (e) {
    document.getElementById("newsList").innerHTML = `
      <div class="form-message">⚠️ ${e.message}</div>
    `;
  }
}

document.getElementById("btnLoadNews").onclick = loadNews;

// Allow pressing Enter to search news
document.getElementById("newsUniversityId").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loadNews();
  }
});

// Auto-load news when switching to news view
document.querySelector('[data-view="news"]').addEventListener("click", () => {
  // Small delay to ensure view is switched first
  setTimeout(loadNews, 100);
});

/** ANALYZE **/
// Calculate and display total score in real-time
function updateTotalScore() {
  const math = +document.getElementById("math").value || 0;
  const reading = +document.getElementById("reading").value || 0;
  const history = +document.getElementById("history").value || 0;
  const s1 = +document.getElementById("s1").value || 0;
  const s2 = +document.getElementById("s2").value || 0;
  
  const total = math + reading + history + s1 + s2;
  document.getElementById("totalScore").textContent = `${total} / 140`;
}

// Add event listeners to all score inputs
['math', 'reading', 'history', 's1', 's2'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', updateTotalScore);
  }
});

document.getElementById("btnAnalyze").onclick = async () => {
  try {
    const body = {
      math: +document.getElementById("math").value,
      reading: +document.getElementById("reading").value,
      history: +document.getElementById("history").value,
      majorSubject1: +document.getElementById("s1").value,
      majorSubject2: +document.getElementById("s2").value,
      preferredFaculty: document.getElementById("faculty").value.trim()
    };

    const data = await api("/analyze", { method:"POST", body });
    const box = document.getElementById("analyzeOut");
    box.innerHTML = `
      <div class="results-header">Your Personalized Recommendations</div>
      <div class="recommendations-grid">
        ${data.recommendations.map(r => `
          <div class="recommendation-card">
            <div class="recommendation-header">
              <h3 class="recommendation-university">${r.university.name}</h3>
              <span class="recommendation-chance">${r.chance}</span>
            </div>
            <p class="recommendation-program">${r.programName}</p>
          </div>
        `).join("")}
      </div>
    `;
  } catch (e) {
    document.getElementById("analyzeOut").innerHTML = `
      <div class="form-message">⚠️ ${e.message}</div>
    `;
  }
};

document.getElementById("btnSaveResult").onclick = async () => {
  try {
    const body = {
      math: +document.getElementById("math").value,
      reading: +document.getElementById("reading").value,
      history: +document.getElementById("history").value,
      majorSubject1: +document.getElementById("s1").value,
      majorSubject2: +document.getElementById("s2").value,
      preferredFaculty: document.getElementById("faculty").value.trim()
    };
    await api("/results", { method:"POST", body });
    document.getElementById("analyzeOut").innerHTML = `
      <div class="form-message">
        ✅ Result saved successfully! Visit your Profile to view all saved results.
      </div>
    `;
  } catch (e) {
    document.getElementById("analyzeOut").innerHTML = `
      <div class="form-message">⚠️ ${e.message}</div>
    `;
  }
};

/** PROFILE + RESULTS CRUD **/
document.getElementById("btnLoadResults").onclick = async () => {
  try {
    const data = await api("/results");
    const box = document.getElementById("resultsList");
    box.innerHTML = data.items.map(x => `
      <div class="result-item">
        <div class="result-info">
          <div class="result-date">
            ${new Date(x.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            <span class="result-score">Total: ${x.totalScore}</span>
          </div>
          <div class="result-faculty">${x.preferredFaculty || "No faculty preference"}</div>
        </div>
        <button class="btn btn--ghost" onclick="deleteResult('${x._id}')">Delete</button>
      </div>
    `).join("");
  } catch (e) {
    document.getElementById("resultsList").innerHTML = `
      <div class="form-message">⚠️ ${e.message}</div>
    `;
  }
};

window.deleteResult = async (id) => {
  await api("/results/" + id, { method:"DELETE" });
  document.getElementById("btnLoadResults").click();
};

async function loadProfile() {
  try {
    const data = await api("/users/profile");
    const u = data.user;
    document.getElementById("profileBox").innerHTML = `
      <div class="profile-name">${u.fullName}</div>
      <div class="profile-role">${u.role}</div>
      <div class="profile-details">
        <div>📧 ${u.email}</div>
        <div>📍 ${u.city || "City not specified"}</div>
        <div>🎓 ${u.preferredFaculty || "No faculty preference set"}</div>
      </div>
    `;

    document.getElementById("pfName").value = u.fullName || "";
    document.getElementById("pfCity").value = u.city || "";
    document.getElementById("pfFaculty").value = u.preferredFaculty || "";
    document.getElementById("profileMsg").textContent = "";
  } catch (e) {
    document.getElementById("profileBox").innerHTML = `
      <div class="form-message">⚠️ ${e.message} - Please log in first</div>
    `;
  }
}
document.querySelector('[data-view="profile"]').addEventListener("click", loadProfile);

document.getElementById("btnUpdateProfile").onclick = async () => {
  try {
    const body = {
      fullName: document.getElementById("pfName").value.trim(),
      city: document.getElementById("pfCity").value.trim(),
      preferredFaculty: document.getElementById("pfFaculty").value.trim()
    };
    await api("/users/profile", { method:"PUT", body });
    document.getElementById("profileMsg").textContent = "✅ Profile updated successfully!";
    loadProfile();
  } catch (e) {
    document.getElementById("profileMsg").textContent = "⚠️ " + e.message;
  }
};

// Hero button handlers
document.querySelectorAll('.hero-actions .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (this.textContent.includes('Start Analysis')) {
      show('analyze');
    } else if (this.textContent.includes('Explore Universities')) {
      show('universities');
    }
  });
});

// Initialize: show news by default and load news data
show("news");
loadNews(); // Auto-load news on page load

