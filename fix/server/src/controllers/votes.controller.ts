import { Request, Response } from "express";
import { PrismaClient, VoteType } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

const voteSchema = z.object({ voteType: z.nativeEnum(VoteType) });

export async function castVote(req: AuthRequest, res: Response) {
  const { reportId } = req.params;
  const parse = voteSchema.safeParse(req.body);
  if (!parse.success) {
    res
      .status(400)
      .json({ message: "Invalid payload", errors: parse.error.flatten() });
    return;
  }
  try {
    const upserted = await prisma.vote.upsert({
      where: { reportId_userId: { reportId, userId: req.user!.id } },
      update: { voteType: parse.data.voteType },
      create: { reportId, userId: req.user!.id, voteType: parse.data.voteType },
    });
    res.json(upserted);
  } catch (e) {
    res.status(500).json({ message: "Failed to cast vote" });
  }
}

