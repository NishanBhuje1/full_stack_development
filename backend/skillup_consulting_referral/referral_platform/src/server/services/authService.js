import { PrismaClient } from "../../generated/prisma/client.js";
const prisma = new PrismaClient();
import _ from "lodash";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as emailService from "./emailService.js";

export async function registerUser(data) {
  const hashedPassword = await bcrypt.hash(
    data.password,
    parseInt(process.env.PASSWORD_SALT_ROUNDS)
  );
  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  await emailService.sendEmail(
    newUser.email,
    "Welcome to SkillUp Consulting Referral Platform",
    `Hello ${newUser.firstName},\n\nThank you for registering at SkillUp Consulting Referral Platform.\n\nBest regards,\nSkillUp Consulting Team`
  );
  const token = jwt.sign(
    _.pick(newUser, "id", "email", "firstName", "lastName", "email", "mobile"),
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
}
export async function loginUser(data) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new Error("user not found");
  }
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(_.omit(user, "password"), process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

export async function forgotPassword(data) {
  const { email } = data;
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User with this email does not exist");
  }
  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await emailService.sendEmail(
    user.email,
    "Password Reset Request",
    `Hello ${user.firstName},\n\nYou can reset your password using the following link: ${resetLink}\nThis link will expire in 15 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nSkillUp Consulting Team`
  );
  return "Password reset link has been sent to your email";
}
export async function resetPassword(data, token) {
  if (!token) {
    throw new Error("Reset token is required");
  }
  if (!data.password) {
    throw new Error("New password is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(
          data.password,
          parseInt(process.env.PASSWORD_SALT_ROUNDS)
        ),
      },
    });
    return "Password has been reset successfully";
  } catch (err) {
    console.log(err);
    throw new Error("Invalid or expired token");
  }
}
