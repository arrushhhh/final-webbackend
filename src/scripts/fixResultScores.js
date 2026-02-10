// scripts/fixResultScores.js
// Run this script once to fix existing results in your database

import mongoose from "mongoose";
import { Result } from "../models/Result.js";
import { ENV } from "../config/env.js";

async function fixResultScores() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    console.log("\nFetching all results...");
    const results = await Result.find({});
    console.log(`Found ${results.length} results to check`);

    let fixed = 0;
    let alreadyCorrect = 0;

    for (const result of results) {
      // Recalculate total score
      const calculatedTotal = 
        (result.math || 0) + 
        (result.reading || 0) + 
        (result.history || 0) + 
        (result.majorSubject1 || 0) + 
        (result.majorSubject2 || 0);

      if (result.totalScore !== calculatedTotal) {
        console.log(`\nFixing result ${result._id}:`);
        console.log(`  Old total: ${result.totalScore}`);
        console.log(`  New total: ${calculatedTotal}`);
        console.log(`  Breakdown: ${result.math} + ${result.reading} + ${result.history} + ${result.majorSubject1} + ${result.majorSubject2}`);

        result.totalScore = calculatedTotal;
        await result.save();
        fixed++;
      } else {
        alreadyCorrect++;
      }
    }

    console.log("\n=================================");
    console.log("✅ Migration complete!");
    console.log(`   Total results: ${results.length}`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Already correct: ${alreadyCorrect}`);
    console.log("=================================\n");

    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the migration
fixResultScores();

/* 
HOW TO USE:

1. Save this file as: scripts/fixResultScores.js

2. Run it once with:
   node scripts/fixResultScores.js

3. This will:
   - Connect to your database
   - Recalculate totalScore for all existing results
   - Fix any incorrect totals
   - Show you what was fixed

4. After running, all your saved results will have the correct total score
*/