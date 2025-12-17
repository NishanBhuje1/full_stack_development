import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function registerAdminUser(data) {
  const password = data.password;

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PASSWORD_SALT_ROUNDS)
  );
  // For example, using bcrypt:
  // const hashedPassword = await bcrypt.hash(password, 10);
  // data.password = hashedPassword;
  const newAdminUser = await prisma.adminUser.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return newAdminUser;
}

export async function loginAdminUser(data) {
  const adminUser = await prisma.adminUser.findUnique({
    where: { email: data.email },
  });
  if (!adminUser) {
    throw new Error("Admin user not found");
  }
  const isValidPassword = await bcrypt.compare(
    data.password,
    adminUser.password
  );
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    _.omit(adminUser, "password"),
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
}
