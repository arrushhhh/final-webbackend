import { University } from "../models/University.js";

export async function listUniversities(req, res) {
  const { q, city } = req.query;
  const filter = {};
  if (city) filter.city = city;
  if (q) filter.name = { $regex: q, $options: "i" };
  const items = await University.find(filter).sort({ name: 1 }).lean();
  res.json({ items});
}

export async function createUniversity(req, res) {
  const item = await University.create(req.body);
  res.status(201).json({ item });
}
