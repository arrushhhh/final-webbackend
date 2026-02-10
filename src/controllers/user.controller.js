import { User } from "../models/User.js";

export async function getProfile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res) {
  const { fullName, city, preferredFaculty } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { ...(fullName !== undefined ? { fullName } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(preferredFaculty !== undefined ? { preferredFaculty } : {})
    },
    { new: true }
  ).select("-passwordHash");

  res.json({ user: updated });
}
