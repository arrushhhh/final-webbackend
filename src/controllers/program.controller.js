import { Program } from "../models/Program.js";

export async function listPrograms(req, res) {
  const { universityId, faculty } = req.query;
  const filter = {};
  if (universityId) filter.universityId = universityId;
  if (faculty) filter.faculty = faculty;
  const items = await Program.find(filter).lean();
  res.json({ items });
}

export async function createProgram(req, res) {
  const item = await Program.create(req.body);
  res.status(201).json({ item });
}
