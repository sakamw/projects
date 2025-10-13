import { Request, Response } from "express";
import { PrismaClient, VoteType } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

const voteSchema = z.object({ voteType: z.nativeEnum(VoteType).nullable() });

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
    const { voteType } = parse.data;

    if (voteType === null) {
      // Delete the vote (unvote)
      await prisma.vote.deleteMany({
        where: { reportId, userId: req.user!.id },
      });
      res.json({ message: "Vote removed" });
    } else {
      // Upsert the vote
      const upserted = await prisma.vote.upsert({
        where: { reportId_userId: { reportId, userId: req.user!.id } },
        update: { voteType },
        create: { reportId, userId: req.user!.id, voteType },
      });
      res.json(upserted);
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to cast vote" });
  }
}
