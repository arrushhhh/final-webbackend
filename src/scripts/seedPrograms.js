
import mongoose from "mongoose";

// Connect to your MongoDB
const MONGODB_URI = "mongodb://localhost:27017/platform";

// Sample programs data with passing scores
const programsData = [
  // Nazarbayev University - Astana
  { universityName: "Nazarbayev University", city: "Astana", programName: "Computer Science", faculty: "Informational Technologies", minScore: 110, grantAvailable: true, grantMinScore: 120 },
  { universityName: "Nazarbayev University", city: "Astana", programName: "Software Engineering", faculty: "Informational Technologies", minScore: 108, grantAvailable: true, grantMinScore: 118 },
  { universityName: "Nazarbayev University", city: "Astana", programName: "Robotics", faculty: "Engineering", minScore: 105, grantAvailable: true, grantMinScore: 115 },
  { universityName: "Nazarbayev University", city: "Astana", programName: "Finance", faculty: "Economics", minScore: 102, grantAvailable: true, grantMinScore: 112 },

  // Al-Farabi KazNU - Almaty
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Information Systems", faculty: "Informational Technologies", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Cybersecurity", faculty: "Informational Technologies", minScore: 105, grantAvailable: true, grantMinScore: 115 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Data Science", faculty: "Informational Technologies", minScore: 103, grantAvailable: true, grantMinScore: 113 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Mathematics", faculty: "Natural Sciences", minScore: 95, grantAvailable: true, grantMinScore: 105 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "International Relations", faculty: "Social Sciences", minScore: 98, grantAvailable: true, grantMinScore: 108 },

  // Satbayev University - Almaty
  { universityName: "Satbayev University", city: "Almaty", programName: "Mechanical Engineering", faculty: "Engineering", minScore: 90, grantAvailable: true, grantMinScore: 100 },
  { universityName: "Satbayev University", city: "Almaty", programName: "Electrical Engineering", faculty: "Engineering", minScore: 92, grantAvailable: true, grantMinScore: 102 },
  { universityName: "Satbayev University", city: "Almaty", programName: "Mining Engineering", faculty: "Engineering", minScore: 88, grantAvailable: true, grantMinScore: 98 },
  { universityName: "Satbayev University", city: "Almaty", programName: "Oil and Gas Engineering", faculty: "Engineering", minScore: 93, grantAvailable: true, grantMinScore: 103 },

  // L.N. Gumilyov ENU - Astana
  { universityName: "L.N. Gumilyov Eurasian National University", city: "Astana", programName: "Jurisprudence", faculty: "Law", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { universityName: "L.N. Gumilyov Eurasian National University", city: "Astana", programName: "International Law", faculty: "Law", minScore: 103, grantAvailable: true, grantMinScore: 113 },
  { universityName: "L.N. Gumilyov Eurasian National University", city: "Astana", programName: "Economics", faculty: "Economics", minScore: 95, grantAvailable: true, grantMinScore: 105 },
  { universityName: "L.N. Gumilyov Eurasian National University", city: "Astana", programName: "Marketing", faculty: "Economics", minScore: 88, grantAvailable: true, grantMinScore: 98 },

  // Kazakh-British Technical University - Almaty
  { universityName: "Kazakh-British Technical University", city: "Almaty", programName: "Computer Engineering", faculty: "Informational Technologies", minScore: 98, grantAvailable: true, grantMinScore: 108 },
  { universityName: "Kazakh-British Technical University", city: "Almaty", programName: "Artificial Intelligence", faculty: "Informational Technologies", minScore: 105, grantAvailable: true, grantMinScore: 115 },
  { universityName: "Kazakh-British Technical University", city: "Almaty", programName: "Civil Engineering", faculty: "Engineering", minScore: 85, grantAvailable: true, grantMinScore: 95 },

  // Astana Medical University - Astana
  { universityName: "Astana Medical University", city: "Astana", programName: "General Medicine", faculty: "Medicine", minScore: 115, grantAvailable: true, grantMinScore: 125 },
  { universityName: "Astana Medical University", city: "Astana", programName: "Dentistry", faculty: "Medicine", minScore: 110, grantAvailable: true, grantMinScore: 120 },
  { universityName: "Astana Medical University", city: "Astana", programName: "Pharmacy", faculty: "Medicine", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { universityName: "Astana Medical University", city: "Astana", programName: "Nursing", faculty: "Medicine", minScore: 85, grantAvailable: true, grantMinScore: 95 },

  // KIMEP University - Almaty
  { universityName: "KIMEP University", city: "Almaty", programName: "Business Administration", faculty: "Economics", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { universityName: "KIMEP University", city: "Almaty", programName: "Finance and Banking", faculty: "Economics", minScore: 102, grantAvailable: true, grantMinScore: 112 },
  { universityName: "KIMEP University", city: "Almaty", programName: "Accounting", faculty: "Economics", minScore: 95, grantAvailable: true, grantMinScore: 105 },

  // Abai KazNPU - Almaty
  { universityName: "Abai Kazakh National Pedagogical University", city: "Almaty", programName: "Pedagogy and Psychology", faculty: "Education", minScore: 82, grantAvailable: true, grantMinScore: 92 },
  { universityName: "Abai Kazakh National Pedagogical University", city: "Almaty", programName: "Foreign Languages", faculty: "Philology", minScore: 88, grantAvailable: true, grantMinScore: 98 },
  { universityName: "Abai Kazakh National Pedagogical University", city: "Almaty", programName: "Kazakh Language and Literature", faculty: "Philology", minScore: 85, grantAvailable: true, grantMinScore: 95 },

  // Karaganda Technical University - Karaganda
  { universityName: "Karaganda Technical University", city: "Karaganda", programName: "Mining Engineering", faculty: "Engineering", minScore: 85, grantAvailable: true, grantMinScore: 95 },
  { universityName: "Karaganda Technical University", city: "Karaganda", programName: "Industrial Engineering", faculty: "Engineering", minScore: 83, grantAvailable: true, grantMinScore: 93 },
  { universityName: "Karaganda Technical University", city: "Karaganda", programName: "Automation and Control", faculty: "Engineering", minScore: 88, grantAvailable: true, grantMinScore: 98 },

  // Additional varied programs
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Physics", faculty: "Natural Sciences", minScore: 92, grantAvailable: true, grantMinScore: 102 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Chemistry", faculty: "Natural Sciences", minScore: 90, grantAvailable: true, grantMinScore: 100 },
  { universityName: "Al-Farabi Kazakh National University", city: "Almaty", programName: "Biology", faculty: "Natural Sciences", minScore: 88, grantAvailable: true, grantMinScore: 98 },
  { universityName: "Nazarbayev University", city: "Astana", programName: "Chemical Engineering", faculty: "Engineering", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { universityName: "L.N. Gumilyov Eurasian National University", city: "Astana", programName: "Journalism", faculty: "Social Sciences", minScore: 90, grantAvailable: true, grantMinScore: 100 },
];

async function seedPrograms() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Get database and collection
    const db = mongoose.connection.db;
    const programsCollection = db.collection("programs");

    // First, get or create universities
    const universitiesCollection = db.collection("universities");
    
    // Get unique universities from programs data
    const uniqueUniversities = [...new Set(programsData.map(p => JSON.stringify({ name: p.universityName, city: p.city })))]
      .map(s => JSON.parse(s));

    console.log("\nProcessing universities...");
    const universityMap = new Map();

    for (const uni of uniqueUniversities) {
      let university = await universitiesCollection.findOne({ name: uni.name });
      
      if (!university) {
        const result = await universitiesCollection.insertOne({
          name: uni.name,
          city: uni.city,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        university = { _id: result.insertedId, ...uni };
        console.log(`  + Created: ${uni.name}`);
      } else {
        console.log(`  ✓ Found: ${uni.name}`);
      }
      
      universityMap.set(uni.name, university._id);
    }

    // Clear existing programs (optional - comment out if you want to keep existing data)
    console.log("\nClearing existing programs...");
    await programsCollection.deleteMany({});

    // Insert programs with university references
    console.log("\nInserting programs...");
    const programsToInsert = programsData.map(p => ({
      universityId: universityMap.get(p.universityName),
      programName: p.programName,
      faculty: p.faculty,
      minScore: p.minScore,
      grantAvailable: p.grantAvailable,
      grantMinScore: p.grantMinScore,
      totalSeats: Math.floor(Math.random() * 50) + 20,
      grantSeats: Math.floor(Math.random() * 20) + 5,
      duration: 4,
      language: ["Kazakh", "Russian", "English"][Math.floor(Math.random() * 3)],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const result = await programsCollection.insertMany(programsToInsert);
    console.log(`✓ Inserted ${result.insertedCount} programs`);

    // Display summary
    console.log("\n" + "=".repeat(50));
    console.log("DATABASE SEEDING COMPLETED!");
    console.log("=".repeat(50));
    console.log(`Universities: ${universityMap.size}`);
    console.log(`Programs: ${result.insertedCount}`);
    
    // Show programs by faculty
    const faculties = {};
    programsData.forEach(p => {
      faculties[p.faculty] = (faculties[p.faculty] || 0) + 1;
    });
    
    console.log("\nPrograms by Faculty:");
    Object.entries(faculties)
      .sort((a, b) => b[1] - a[1])
      .forEach(([faculty, count]) => {
        console.log(`  - ${faculty}: ${count}`);
      });

    console.log("\nSample Programs:");
    const samples = await programsCollection.find().limit(5).toArray();
    for (const sample of samples) {
      const uni = await universitiesCollection.findOne({ _id: sample.universityId });
      console.log(`  - ${sample.programName} at ${uni.name} (Min Score: ${sample.minScore})`);
    }

    console.log("\n✅ You can now test the analyze endpoint!");
    console.log("Example: Math(10) + Reading(9) + History(20) + Subject1(45) + Subject2(45) = 129/140");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  }
}

// Run the seed function
seedPrograms()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch(err => {
    console.error("\nFailed:", err);
    process.exit(1);
  });