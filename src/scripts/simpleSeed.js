// simpleSeed.js - Simple script to add programs directly to MongoDB
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "platform";

const universities = [
  { _id: new ObjectId(), name: "Nazarbayev University", city: "Astana" },
  { _id: new ObjectId(), name: "Al-Farabi Kazakh National University", city: "Almaty" },
  { _id: new ObjectId(), name: "Satbayev University", city: "Almaty" },
  { _id: new ObjectId(), name: "L.N. Gumilyov Eurasian National University", city: "Astana" },
  { _id: new ObjectId(), name: "Astana Medical University", city: "Astana" }
];

// Create programs for each university
const programs = [];

// Nazarbayev University (high-tier)
programs.push(
  { universityId: universities[0]._id, programName: "Computer Science", faculty: "Informational Technologies", minScore: 110, grantAvailable: true, grantMinScore: 120, totalSeats: 40, grantSeats: 15 },
  { universityId: universities[0]._id, programName: "Software Engineering", faculty: "Informational Technologies", minScore: 108, grantAvailable: true, grantMinScore: 118, totalSeats: 45, grantSeats: 18 },
  { universityId: universities[0]._id, programName: "Robotics", faculty: "Engineering", minScore: 105, grantAvailable: true, grantMinScore: 115, totalSeats: 30, grantSeats: 12 },
  { universityId: universities[0]._id, programName: "Finance", faculty: "Economics", minScore: 102, grantAvailable: true, grantMinScore: 112, totalSeats: 35, grantSeats: 14 }
);

// Al-Farabi KazNU (mid-tier)
programs.push(
  { universityId: universities[1]._id, programName: "Information Systems", faculty: "Informational Technologies", minScore: 100, grantAvailable: true, grantMinScore: 110, totalSeats: 50, grantSeats: 20 },
  { universityId: universities[1]._id, programName: "Cybersecurity", faculty: "Informational Technologies", minScore: 105, grantAvailable: true, grantMinScore: 115, totalSeats: 35, grantSeats: 15 },
  { universityId: universities[1]._id, programName: "Data Science", faculty: "Informational Technologies", minScore: 103, grantAvailable: true, grantMinScore: 113, totalSeats: 40, grantSeats: 16 },
  { universityId: universities[1]._id, programName: "Mathematics", faculty: "Natural Sciences", minScore: 95, grantAvailable: true, grantMinScore: 105, totalSeats: 30, grantSeats: 12 },
  { universityId: universities[1]._id, programName: "Physics", faculty: "Natural Sciences", minScore: 92, grantAvailable: true, grantMinScore: 102, totalSeats: 30, grantSeats: 12 },
  { universityId: universities[1]._id, programName: "International Relations", faculty: "Social Sciences", minScore: 98, grantAvailable: true, grantMinScore: 108, totalSeats: 35, grantSeats: 14 }
);

// Satbayev University (engineering focus)
programs.push(
  { universityId: universities[2]._id, programName: "Mechanical Engineering", faculty: "Engineering", minScore: 90, grantAvailable: true, grantMinScore: 100, totalSeats: 50, grantSeats: 20 },
  { universityId: universities[2]._id, programName: "Electrical Engineering", faculty: "Engineering", minScore: 92, grantAvailable: true, grantMinScore: 102, totalSeats: 45, grantSeats: 18 },
  { universityId: universities[2]._id, programName: "Civil Engineering", faculty: "Engineering", minScore: 85, grantAvailable: true, grantMinScore: 95, totalSeats: 55, grantSeats: 22 },
  { universityId: universities[2]._id, programName: "Oil and Gas Engineering", faculty: "Engineering", minScore: 93, grantAvailable: true, grantMinScore: 103, totalSeats: 40, grantSeats: 16 },
  { universityId: universities[2]._id, programName: "Mining Engineering", faculty: "Engineering", minScore: 88, grantAvailable: true, grantMinScore: 98, totalSeats: 45, grantSeats: 18 }
);

// L.N. Gumilyov ENU (social sciences focus)
programs.push(
  { universityId: universities[3]._id, programName: "Jurisprudence", faculty: "Law", minScore: 100, grantAvailable: true, grantMinScore: 110, totalSeats: 40, grantSeats: 16 },
  { universityId: universities[3]._id, programName: "International Law", faculty: "Law", minScore: 103, grantAvailable: true, grantMinScore: 113, totalSeats: 30, grantSeats: 12 },
  { universityId: universities[3]._id, programName: "Economics", faculty: "Economics", minScore: 95, grantAvailable: true, grantMinScore: 105, totalSeats: 50, grantSeats: 20 },
  { universityId: universities[3]._id, programName: "Marketing", faculty: "Economics", minScore: 88, grantAvailable: true, grantMinScore: 98, totalSeats: 45, grantSeats: 18 },
  { universityId: universities[3]._id, programName: "Journalism", faculty: "Social Sciences", minScore: 90, grantAvailable: true, grantMinScore: 100, totalSeats: 35, grantSeats: 14 }
);

// Astana Medical University (medical focus)
programs.push(
  { universityId: universities[4]._id, programName: "General Medicine", faculty: "Medicine", minScore: 115, grantAvailable: true, grantMinScore: 125, totalSeats: 50, grantSeats: 20 },
  { universityId: universities[4]._id, programName: "Dentistry", faculty: "Medicine", minScore: 110, grantAvailable: true, grantMinScore: 120, totalSeats: 30, grantSeats: 12 },
  { universityId: universities[4]._id, programName: "Pharmacy", faculty: "Medicine", minScore: 100, grantAvailable: true, grantMinScore: 110, totalSeats: 40, grantSeats: 16 },
  { universityId: universities[4]._id, programName: "Nursing", faculty: "Medicine", minScore: 85, grantAvailable: true, grantMinScore: 95, totalSeats: 60, grantSeats: 24 }
);

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("✓ Connected");

    const db = client.db(DATABASE_NAME);
    
    // Clear existing data
    console.log("\nClearing existing data...");
    await db.collection("programs").deleteMany({});
    await db.collection("universities").deleteMany({});
    console.log("✓ Cleared");

    // Insert universities
    console.log("\nInserting universities...");
    await db.collection("universities").insertMany(universities);
    console.log(`✓ Inserted ${universities.length} universities`);

    // Insert programs
    console.log("\nInserting programs...");
    await db.collection("programs").insertMany(programs);
    console.log(`✓ Inserted ${programs.length} programs`);

    // Verify
    console.log("\nVerifying...");
    const uniCount = await db.collection("universities").countDocuments();
    const progCount = await db.collection("programs").countDocuments();
    console.log(`Universities: ${uniCount}`);
    console.log(`Programs: ${progCount}`);

    // Show sample
    console.log("\nSample programs:");
    const samples = await db.collection("programs")
      .aggregate([
        { $lookup: { from: "universities", localField: "universityId", foreignField: "_id", as: "university" } },
        { $limit: 5 }
      ])
      .toArray();
    
    samples.forEach(p => {
      console.log(`  - ${p.programName} at ${p.university[0].name} (Min: ${p.minScore})`);
    });

    console.log("\n✅ SUCCESS! Database is ready.");
    console.log("\nYou can now test with score 135 - you should qualify for all programs!");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✓ Disconnected\n");
  }
}

seed();