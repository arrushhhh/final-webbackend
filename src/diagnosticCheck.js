// diagnosticCheck.js - Run this to check your database and test analysis
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/platform";

async function runDiagnostics() {
  try {
    console.log("=".repeat(60));
    console.log("RUNNING DIAGNOSTICS");
    console.log("=".repeat(60));

    // Connect to MongoDB
    console.log("\n1. Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected successfully");

    const db = mongoose.connection.db;

    // Check collections
    console.log("\n2. Checking collections...");
    const collections = await db.listCollections().toArray();
    console.log("Available collections:");
    collections.forEach(c => console.log(`   - ${c.name}`));

    // Check programs collection
    console.log("\n3. Checking programs collection...");
    const programsCollection = db.collection("programs");
    const programCount = await programsCollection.countDocuments();
    console.log(`Programs count: ${programCount}`);

    if (programCount === 0) {
      console.log("\n❌ PROBLEM: No programs in database!");
      console.log("Solution: Run the seedPrograms.js script first");
      console.log("Command: node seedPrograms.js");
      return;
    }

    // Show sample programs
    console.log("\n4. Sample programs:");
    const samplePrograms = await programsCollection.find().limit(5).toArray();
    samplePrograms.forEach(p => {
      console.log(`   - ${p.programName} (Faculty: ${p.faculty}, Min Score: ${p.minScore})`);
    });

    // Check universities
    console.log("\n5. Checking universities collection...");
    const universitiesCollection = db.collection("universities");
    const uniCount = await universitiesCollection.countDocuments();
    console.log(`Universities count: ${uniCount}`);

    // Check if programs have valid universityId references
    console.log("\n6. Checking university references...");
    const programsWithUni = await programsCollection.find({ universityId: { $exists: true } }).limit(1).toArray();
    if (programsWithUni.length > 0) {
      const uniId = programsWithUni[0].universityId;
      const uni = await universitiesCollection.findOne({ _id: uniId });
      if (uni) {
        console.log(`✓ University references are valid`);
        console.log(`   Example: ${programsWithUni[0].programName} → ${uni.name}`);
      } else {
        console.log(`❌ PROBLEM: Program has invalid university reference`);
      }
    }

    // Test the analyze logic
    console.log("\n7. Testing analyze logic with score 135...");
    const testScore = 135;
    const allPrograms = await programsCollection.find().toArray();
    
    const qualifiedPrograms = allPrograms.filter(p => testScore >= p.minScore);
    console.log(`   Total programs: ${allPrograms.length}`);
    console.log(`   Qualified programs (score ${testScore}): ${qualifiedPrograms.length}`);
    
    if (qualifiedPrograms.length > 0) {
      console.log("\n   Top 3 matches:");
      qualifiedPrograms
        .slice(0, 3)
        .forEach(p => {
          const diff = testScore - p.minScore;
          console.log(`   - ${p.programName} (Min: ${p.minScore}, Diff: +${diff})`);
        });
    }

    // Check by faculty
    console.log("\n8. Programs by faculty:");
    const faculties = await programsCollection.distinct("faculty");
    for (const faculty of faculties) {
      const count = await programsCollection.countDocuments({ faculty });
      console.log(`   - ${faculty}: ${count} programs`);
    }

    // Score distribution
    console.log("\n9. Score distribution:");
    const scores = await programsCollection.find({}, { minScore: 1 }).toArray();
    const minScores = scores.map(s => s.minScore).sort((a, b) => a - b);
    console.log(`   Lowest: ${minScores[0]}`);
    console.log(`   Highest: ${minScores[minScores.length - 1]}`);
    console.log(`   Average: ${Math.round(minScores.reduce((a, b) => a + b, 0) / minScores.length)}`);

    console.log("\n" + "=".repeat(60));
    console.log("DIAGNOSTICS COMPLETE");
    console.log("=".repeat(60));

    if (programCount > 0 && qualifiedPrograms.length > 0) {
      console.log("\n✅ Database looks good!");
      console.log("If recommendations still don't show, check:");
      console.log("1. Frontend is calling the correct API endpoint");
      console.log("2. Backend analyze controller is using the updated code");
      console.log("3. Check browser console for errors");
      console.log("4. Check network tab to see if API is returning data");
    }

  } catch (error) {
    console.error("\n❌ Error during diagnostics:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB\n");
  }
}

runDiagnostics();