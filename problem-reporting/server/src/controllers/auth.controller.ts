import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mailer";
import { AuthRequest } from "../middlewares/userMiddleware";

const client = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        verified: false,
      },
    });
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }
    const activationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";
    const activationLink = `${frontendUrl}/activate/${user.id}/${activationToken}`;
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.FROM_EMAIL
    ) {
      res.status(500).json({ message: "Email service not configured." });
      return;
    }
    await sendEmail({
      to: user.email,
      subject: "Activate Your Account",
      html: `<p>Welcome! Please <a href="${activationLink}">activate your account</a> to start using Fix. This link will expire in 24 hours.</p>`,
    });
    res.status(201).json({
      message:
        "Registration successful! Please check your email to activate your account.",
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      res.status(400).json({ message: "Email or username already in use." });
      return;
    }
    const message = e.message || "Something went wrong.";
    console.error(e);
    res.status(500).json({ message });
  }
};

export const activateAccount = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  try {
    const user = await client.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (user.verified) {
      res.status(500).json({ message: "Account already activated." });
      return;
    }
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        email: string;
      };
      if (payload.id !== user.id || payload.email !== user.email) {
        res.status(400).json({ message: "Invalid activation token." });
        return;
      }
      await client.user.update({ where: { id }, data: { verified: true } });
      const frontendUrl =
        process.env.FRONTEND_URL ||
        process.env.CLIENT_URL ||
        "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?activated=1`);
      return;
    } catch (e) {
      res.status(400).json({ message: "Invalid or expired activation link." });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: "Error activating account." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        message: "Email/Username and password are required.",
        error: "MISSING_CREDENTIALS",
      });
      return;
    }

    const user = await client.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }
    if (!user.verified) {
      res.status(403).json({
        message:
          "Account not activated. Please check your email for the activation link.",
      });
      return;
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const { password: userPassword, ...userDetails } = user;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }

    const token = jwt.sign(userDetails, process.env.JWT_SECRET);
    const isProduction = process.env.NODE_ENV === "production";
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      })
      .json({ ...userDetails });
  } catch (e) {
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

export const updateUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Current and new password are required." });
      return;
    }
    if (currentPassword == newPassword) {
      res
        .status(400)
        .json({ message: "Current and new password should be different." });
      return;
    }
    const user = await client.user.findUnique({
      where: { id: String(userId) },
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect." });
      return;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await client.user.update({
      where: { id: String(userId) },
      data: { password: hashed },
    });
    res.json({ message: "Password updated successfully." });
  } catch (e) {
    res.status(500).json({ message: "Failed to update password" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const oldUser = await client.user.findUnique({ where: { email } });
    if (!oldUser) {
      res.status(200).json({ message: "A reset link has been sent." });
      return;
    }
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "10m",
    });

    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";
    const link = `${frontendUrl}/reset-password/${oldUser.id}/${token}`;
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.FROM_EMAIL
    ) {
      res.status(500).json({ message: "Email service not configured." });
      return;
    }
    await sendEmail({
      to: oldUser.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${link}">here</a> to reset your password. This link will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "A reset link has been sent." });
  } catch (e) {
    res.status(500).json({ message: "Error generating reset link." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.params;
  if (req.method === "GET") {
    try {
      const oldUser = await client.user.findUnique({ where: { id } });
      if (!oldUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "Server configuration error." });
        return;
      }
      const secret = process.env.JWT_SECRET + oldUser.password;
      try {
        jwt.verify(token, secret);
        res
          .status(200)
          .json({ message: "Email verified. You can reset your password." });
        return;
      } catch (e) {
        res.status(400).json({ message: "Invalid or expired link." });
        return;
      }
    } catch (e) {
      res.status(500).json({ message: "Error verifying reset link." });
      return;
    }
  } else if (req.method === "POST") {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ message: "Password is required." });
      return;
    }
    try {
      const oldUser = await client.user.findUnique({ where: { id } });
      if (!oldUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "Server configuration error." });
        return;
      }
      const secret = process.env.JWT_SECRET + oldUser.password;
      try {
        jwt.verify(token, secret);
        const hashed = await bcrypt.hash(password, 10);
        await client.user.update({ where: { id }, data: { password: hashed } });
        res.status(200).json({ message: "Password reset successful." });
        return;
      } catch (e) {
        res.status(400).json({ message: "Invalid or expired token." });
        return;
      }
    } catch (e) {
      res.status(500).json({ message: "Error resetting password." });
      return;
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }
};

export const resendActivation = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await client.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (user.verified) {
      res.status(400).json({ message: "Account already activated." });
      return;
    }
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Server configuration error." });
      return;
    }
    const activationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";
    const activationLink = `${frontendUrl}/activate/${user.id}/${activationToken}`;
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.FROM_EMAIL
    ) {
      res.status(500).json({ message: "Email service not configured." });
      return;
    }
    await sendEmail({
      to: user.email,
      subject: "Activate Your Account",
      html: `<p>Please <a href="${activationLink}">activate your account</a>. This link will expire in 24 hours.</p>`,
    });
    res
      .status(200)
      .json({ message: "Activation email resent. Please check your inbox." });
    return;
  } catch (e) {
    res.status(500).json({ message: "Error resending activation email." });
    return;
  }
};
