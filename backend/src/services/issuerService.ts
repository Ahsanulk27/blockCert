// backend/src/services/issuerService.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

export const registerIssuer = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await prisma.issuer.findUnique({ where: { email } });
  if (existing) throw new Error("Issuer already exists");

  const hashed = await bcrypt.hash(password, 10);

  const issuer = await prisma.issuer.create({
    data: { name, email, password: hashed },
  });

  return issuer;
};

export const loginIssuer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const issuer = await prisma.issuer.findUnique({ where: { email } });
  if (!issuer) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, issuer.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: issuer.id, email: issuer.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export const getAllIssuers = async () => {
  return await prisma.issuer.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
  });
};
