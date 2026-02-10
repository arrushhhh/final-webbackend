// AnalyzePageDebug.jsx - Place this temporarily to debug the issue
import React, { useState } from 'react';

export default function AnalyzePageDebug() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  const testScores = {
    math: 10,
    reading: 9,
    history: 20,
    majorSubject1: 48,
    majorSubject2: 48,
    preferredFaculty: "" // Leave empty to get all programs
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRawResponse(null);

    console.log("Sending request with:", testScores);
    console.log("Total score:", testScores.math + testScores.reading + testScores.history + testScores.majorSubject1 + testScores.majorSubject2);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token if required
          // 'Authorization': `Bearer ${yourToken}`
        },
        body: JSON.stringify(testScores)
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      const text = await res.text();
      console.log("Raw response:", text);
      setRawResponse(text);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = JSON.parse(text);
      console.log("Parsed data:", data);
      setResponse(data);

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔍 Analyze Endpoint Debug Tool</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Test Configuration</h2>
        <pre style={{ background: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(testScores, null, 2)}
        </pre>
        <p><strong>Total Score:</strong> {testScores.math + testScores.reading + testScores.history + testScores.majorSubject1 + testScores.majorSubject2} / 140</p>
        
        <button 
          onClick={handleTest}
          disabled={loading}
          style={{
            background: '#4F46E5',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Testing...' : '🚀 Test Analyze Endpoint'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#DC2626' }}>❌ Error</h2>
          <p style={{ fontFamily: 'monospace' }}>{error}</p>
          
          <h3>Troubleshooting Steps:</h3>
          <ol>
            <li>Check if backend server is running on port 3000</li>
            <li>Verify the API endpoint is correct (/api/analyze)</li>
            <li>Check if authentication is required</li>
            <li>Look at browser console for more details</li>
            <li>Check backend logs for errors</li>
          </ol>
        </div>
      )}

      {rawResponse && (
        <div style={{ marginBottom: '20px' }}>
          <h2>📡 Raw Response</h2>
          <pre style={{ background: '#1F2937', color: '#10B981', padding: '15px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px' }}>
            {rawResponse}
          </pre>
        </div>
      )}

      {response && (
        <div>
          <h2>✅ Parsed Response</h2>
          
          {/* Statistics */}
          <div style={{ background: '#EFF6FF', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <strong>Total Score:</strong><br/>
                {response.statistics?.totalScore || response.totalScore} / 140
              </div>
              <div>
                <strong>Percentage:</strong><br/>
                {response.statistics?.percentage || 'N/A'}%
              </div>
              <div>
                <strong>Programs Found:</strong><br/>
                {response.recommendations?.length || 0}
              </div>
              <div>
                <strong>Qualified:</strong><br/>
                {response.summary?.qualifiedPrograms || 'N/A'}
              </div>
            </div>
          </div>

          {/* Recommendations Count */}
          {response.recommendations && response.recommendations.length > 0 ? (
            <div style={{ background: '#D1FAE5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>✅ Found {response.recommendations.length} Programs</h3>
              
              {response.categorized && (
                <div style={{ marginTop: '10px' }}>
                  <p>Safe: {response.categorized.safe?.length || 0}</p>
                  <p>Target: {response.categorized.target?.length || 0}</p>
                  <p>Reach: {response.categorized.reach?.length || 0}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: '#FEF3C7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>⚠️ No Programs Found</h3>
              <p>This means your database might be empty. Run the seed script:</p>
              <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>node simpleSeed.js</pre>
            </div>
          )}

          {/* Sample Programs */}
          {response.recommendations && response.recommendations.length > 0 && (
            <div>
              <h3>Sample Programs (First 5)</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {response.recommendations.slice(0, 5).map((prog, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', padding: '15px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{prog.programName}</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>University:</strong> {prog.university?.name || 'N/A'}<br/>
                      <strong>Faculty:</strong> {prog.faculty}<br/>
                      <strong>Min Score:</strong> {prog.minScore}<br/>
                      <strong>Your Score:</strong> {response.totalScore} ({prog.scoreDifference > 0 ? '+' : ''}{prog.scoreDifference})<br/>
                      <strong>Chance:</strong> {prog.chance?.label || 'N/A'}<br/>
                      <strong>Qualified:</strong> {prog.qualified ? '✅ Yes' : '❌ No'}<br/>
                      <strong>Grant:</strong> {prog.grantAvailable ? '🎓 Available' : 'Not available'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full JSON */}
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', padding: '10px', background: '#F3F4F6', borderRadius: '4px' }}>
              <strong>Show Full JSON Response</strong>
            </summary>
            <pre style={{ background: '#1F2937', color: '#10B981', padding: '15px', borderRadius: '8px', overflow: 'auto', marginTop: '10px' }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Instructions */}
      <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>📋 Next Steps</h3>
        <ol>
          <li><strong>If you see "No Programs Found":</strong>
            <ul>
              <li>Your database is empty</li>
              <li>Run: <code>node simpleSeed.js</code> in your backend directory</li>
              <li>Then click the test button again</li>
            </ul>
          </li>
          <li><strong>If you see programs:</strong>
            <ul>
              <li>Your backend is working correctly! 🎉</li>
              <li>The issue is in how the frontend displays results</li>
              <li>Check if your analyze page component is correctly using the response data</li>
            </ul>
          </li>
          <li><strong>If you see an error:</strong>
            <ul>
              <li>Check browser console (F12)</li>
              <li>Check backend console/logs</li>
              <li>Verify the endpoint URL is correct</li>
              <li>Check if authentication is needed</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}