import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

export async function listCommentsForReport(req: Request, res: Response) {
  const { reportId } = req.params;
  const { page = '1', limit = '20' } = req.query as Record<string, string>;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          reportId,
          parentCommentId: null // Only get top-level comments
        },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
          replies: {
            include: {
              author: { select: { id: true, firstName: true, lastName: true } }
            },
            orderBy: { createdAt: "asc" }
          },
          _count: {
            select: { replies: true }
          }
        },
        skip,
        take: limitNum,
      }),
      prisma.comment.count({
        where: {
          reportId,
          parentCommentId: null
        }
      })
    ]);

    res.json({
      comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to list comments" });
  }
}

const commentSchema = z.object({
  text: z.string().min(1),
  parentCommentId: z.string().optional()
});

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
    // Check if the user is the author of the report
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: { userId: true }
    });

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    const { text, parentCommentId } = parse.data;

    // If this is a reply to an existing comment
    if (parentCommentId) {
      // Verify the parent comment exists and belongs to the same report
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId },
        select: { reportId: true, author: { select: { id: true } } }
      });

      if (!parentComment || parentComment.reportId !== reportId) {
        res.status(404).json({ message: "Parent comment not found" });
        return;
      }

      // Anyone can reply to comments, including the report author
      const created = await prisma.comment.create({
        data: {
          reportId,
          userId: req.user!.id,
          text,
          parentCommentId
        },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } }
        }
      });
      res.status(201).json(created);
      return;
    }

    // If this is a new top-level comment
    // Prevent report authors from commenting on their own reports
    if (report.userId === req.user!.id) {
      res.status(403).json({
        message: "You cannot comment on your own report. Others can comment and you can reply to their comments."
      });
      return;
    }

    const created = await prisma.comment.create({
      data: { reportId, userId: req.user!.id, text },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: "Failed to add comment" });
  }
}

