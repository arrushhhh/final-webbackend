// scripts/seedUniversityData.js
import mongoose from "mongoose";
import { University } from "../models/University.js";
import { Program } from "../models/Program.js";

// Sample university data for Kazakhstan
const universities = [
  {
    name: "Al-Farabi Kazakh National University",
    city: "Almaty",
    type: "National",
    website: "https://www.kaznu.kz"
  },
  {
    name: "Nazarbayev University",
    city: "Astana",
    type: "Autonomous",
    website: "https://nu.edu.kz"
  },
  {
    name: "L.N. Gumilyov Eurasian National University",
    city: "Astana",
    type: "National",
    website: "https://www.enu.kz"
  },
  {
    name: "Satbayev University",
    city: "Almaty",
    type: "National",
    website: "https://satbayev.university"
  },
  {
    name: "Abai Kazakh National Pedagogical University",
    city: "Almaty",
    type: "National",
    website: "https://kaznpu.kz"
  }
];

// Sample programs with realistic UNT passing scores
const programTemplates = [
  // Information Technologies
  { faculty: "Informational Technologies", programName: "Software Engineering", minScore: 105, grantAvailable: true, grantMinScore: 115 },
  { faculty: "Informational Technologies", programName: "Computer Science", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  { faculty: "Informational Technologies", programName: "Information Systems", minScore: 95, grantAvailable: true, grantMinScore: 105 },
  { faculty: "Informational Technologies", programName: "Cybersecurity", minScore: 108, grantAvailable: true, grantMinScore: 118 },
  
  // Engineering
  { faculty: "Engineering", programName: "Mechanical Engineering", minScore: 90, grantAvailable: true, grantMinScore: 100 },
  { faculty: "Engineering", programName: "Electrical Engineering", minScore: 95, grantAvailable: true, grantMinScore: 105 },
  { faculty: "Engineering", programName: "Civil Engineering", minScore: 85, grantAvailable: true, grantMinScore: 95 },
  { faculty: "Engineering", programName: "Chemical Engineering", minScore: 92, grantAvailable: true, grantMinScore: 102 },
  
  // Economics & Business
  { faculty: "Economics", programName: "Finance", minScore: 98, grantAvailable: true, grantMinScore: 108 },
  { faculty: "Economics", programName: "Accounting and Audit", minScore: 90, grantAvailable: true, grantMinScore: 100 },
  { faculty: "Economics", programName: "Marketing", minScore: 88, grantAvailable: true, grantMinScore: 98 },
  { faculty: "Economics", programName: "International Economics", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  
  // Law
  { faculty: "Law", programName: "Jurisprudence", minScore: 102, grantAvailable: true, grantMinScore: 112 },
  { faculty: "Law", programName: "International Law", minScore: 105, grantAvailable: true, grantMinScore: 115 },
  
  // Medicine
  { faculty: "Medicine", programName: "General Medicine", minScore: 115, grantAvailable: true, grantMinScore: 125 },
  { faculty: "Medicine", programName: "Dentistry", minScore: 110, grantAvailable: true, grantMinScore: 120 },
  { faculty: "Medicine", programName: "Pharmacy", minScore: 100, grantAvailable: true, grantMinScore: 110 },
  
  // Philology & Education
  { faculty: "Philology", programName: "Kazakh Language and Literature", minScore: 85, grantAvailable: true, grantMinScore: 95 },
  { faculty: "Philology", programName: "Foreign Languages", minScore: 88, grantAvailable: true, grantMinScore: 98 },
  { faculty: "Education", programName: "Pedagogy and Psychology", minScore: 82, grantAvailable: true, grantMinScore: 92 },
  
  // Natural Sciences
  { faculty: "Natural Sciences", programName: "Mathematics", minScore: 95, grantAvailable: true, grantMinScore: 105 },
  { faculty: "Natural Sciences", programName: "Physics", minScore: 92, grantAvailable: true, grantMinScore: 102 },
  { faculty: "Natural Sciences", programName: "Chemistry", minScore: 90, grantAvailable: true, grantMinScore: 100 },
  { faculty: "Natural Sciences", programName: "Biology", minScore: 88, grantAvailable: true, grantMinScore: 98 }
];

async function seedDatabase() {
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await Program.deleteMany({});
    await University.deleteMany({});

    // Insert universities
    console.log("Inserting universities...");
    const insertedUniversities = await University.insertMany(universities);
    console.log(`✓ Inserted ${insertedUniversities.length} universities`);

    // Create programs for each university
    console.log("Inserting programs...");
    const programs = [];
    
    for (const university of insertedUniversities) {
      // Each university gets a subset of programs with slight variation in scores
      const numPrograms = Math.floor(Math.random() * 5) + 10; // 10-15 programs per university
      const selectedPrograms = programTemplates
        .sort(() => 0.5 - Math.random())
        .slice(0, numPrograms);

      for (const template of selectedPrograms) {
        // Add slight variation to scores for different universities
        const scoreVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        
        programs.push({
          universityId: university._id,
          programName: template.programName,
          faculty: template.faculty,
          minScore: Math.max(70, Math.min(130, template.minScore + scoreVariation)),
          grantAvailable: template.grantAvailable,
          grantMinScore: template.grantMinScore ? 
            Math.max(80, Math.min(135, template.grantMinScore + scoreVariation)) : 
            undefined,
          totalSeats: Math.floor(Math.random() * 50) + 20, // 20-70 seats
          grantSeats: Math.floor(Math.random() * 20) + 5,  // 5-25 grant seats
          duration: 4,
          language: ["Kazakh", "Russian", "English"][Math.floor(Math.random() * 3)],
          isActive: true
        });
      }
    }

    const insertedPrograms = await Program.insertMany(programs);
    console.log(`✓ Inserted ${insertedPrograms.length} programs`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`  - Universities: ${insertedUniversities.length}`);
    console.log(`  - Programs: ${insertedPrograms.length}`);
    
    // Display sample data
    console.log("\nSample programs:");
    const samplePrograms = await Program.find()
      .populate('universityId')
      .limit(5)
      .lean();
    
    samplePrograms.forEach(p => {
      console.log(`  - ${p.programName} at ${p.universityId.name} (Min Score: ${p.minScore})`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/unt-analyzer");
    console.log("Connected to MongoDB");

    await seedDatabase();

    // Disconnect
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedDatabase };