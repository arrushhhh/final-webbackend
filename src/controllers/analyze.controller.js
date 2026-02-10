import { Program } from "../models/Program.js";
import { University } from "../models/University.js";

function chance(studentScore, minScore) {
  if (studentScore >= minScore + 10) return "high";
  if (studentScore >= minScore) return "medium";
  return "low";
}

export async function analyze(req, res) {
  const { math, reading, majorSubject1, majorSubject2, preferredFaculty } = req.body;
  const totalScore = math + reading + majorSubject1 + majorSubject2;

  const filter = preferredFaculty ? { faculty: preferredFaculty } : {};
  const programs = await Program.find(filter).lean();

  const uniIds = [...new Set(programs.map(p => String(p.universityId)))];
  const unis = await University.find({ _id: { $in: uniIds } }).lean();
  const uniMap = new Map(unis.map(u => [String(u._id), u]));

  const recommendations = programs
    .map(p => {
      const u = uniMap.get(String(p.universityId));
      return {
        university: u ? { id: u._id, name: u.name, city: u.city } : null,
        programName: p.programName,
        faculty: p.faculty,
        minScore: p.minScore,
        grantAvailable: p.grantAvailable,
        chance: chance(totalScore, p.minScore)
      };
    })
    .filter(x => x.university)
    .sort((a, b) => (a.chance < b.chance ? 1 : -1));

  res.json({ totalScore, preferredFaculty, recommendations });
}
