import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { User } from "../models/User.js";
import { sendWelcomeEmail } from "../config/mailer.js";

function signToken(userId) {
  return jwt.sign({ sub: userId }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
}

export async function register(req, res) {
  const { fullName, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);

  // first user becomes admin (easy RBAC for demo)
  const usersCount = await User.countDocuments();
  const role = usersCount === 0 ? "admin" : "user";

  const user = await User.create({ fullName, email, passwordHash, role });

  // SMTP (optional if configured)
  sendWelcomeEmail(email, fullName).catch(() => {});

  const token = signToken(user._id);
  res.status(201).json({ token, role: user.role });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user._id);
  res.json({ token, role: user.role });
}
