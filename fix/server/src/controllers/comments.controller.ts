import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

export async function listCommentsForReport(req: Request, res: Response) {
  const { reportId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { reportId },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    res.json(comments);
  } catch (e) {
    res.status(500).json({ message: "Failed to list comments" });
  }
}

const commentSchema = z.object({ text: z.string().min(1) });

export async function addCommentToReport(req: AuthRequest, res: Response) {
  const { reportId } = req.params;
  const parse = commentSchema.safeParse(req.body);
  if (!parse.success) {
    res
      .status(400)
      .json({ message: "Invalid payload", errors: parse.error.flatten() });
    return;
  }
  try {
    const created = await prisma.comment.create({
      data: { reportId, userId: req.user!.id, text: parse.data.text },
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: "Failed to add comment" });
  }
}

