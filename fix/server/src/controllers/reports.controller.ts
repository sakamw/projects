import { Request, Response } from "express";
import { PrismaClient, ReportCategory, Prisma } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

const parseMediaUrls = (mediaUrls: string | null | undefined): string[] => {
  if (!mediaUrls || mediaUrls === "[]") return [];

  // Check if it's already a JSON array
  if (mediaUrls.startsWith("[") && mediaUrls.endsWith("]")) {
    try {
      return JSON.parse(mediaUrls);
    } catch {
      return [];
    }
  }

  // Check if it's a single URL (starts with http/https)
  if (mediaUrls.startsWith("http://") || mediaUrls.startsWith("https://")) {
    return [mediaUrls];
  }

  // Try to parse as JSON array anyway (for edge cases)
  try {
    const parsed = JSON.parse(mediaUrls);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.nativeEnum(ReportCategory),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

export async function listReports(req: Request, res: Response) {
  try {
    const { category, status, sort } = req.query as Record<
      string,
      string | undefined
    >;
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    let orderBy: Prisma.ReportOrderByWithRelationInput[];
    if (sort === "popular") {
      orderBy = [{ votes: { _count: "desc" } }, { createdAt: "desc" }];
    } else {
      orderBy = [{ createdAt: "desc" }];
    }
    const reports = await prisma.report.findMany({
      where,
      orderBy,
      include: {
        _count: { select: { votes: true, comments: true } },
        author: { select: { id: true, firstName: true, lastName: true } },
        department: true,
      },
    });
    const reportsWithParsedMedia = reports.map((report) => ({
      ...report,
      mediaUrls: parseMediaUrls(report.mediaUrls),
    }));
    res.json(reportsWithParsedMedia);
  } catch (e) {
    res.status(500).json({ message: "Failed to list reports" });
  }
}

export async function getReportById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    // Get basic report info without comments first
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        votes: true,
        department: true,
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    // Get recent comments count and limited recent comments
    const [commentsCount, recentComments] = await Promise.all([
      prisma.comment.count({ where: { reportId: id } }),
      prisma.comment.findMany({
        where: { reportId: id },
        orderBy: { createdAt: "desc" },
        take: 5, // Only get 5 most recent comments
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
    ]);

    const reportWithParsedMedia = {
      ...report,
      mediaUrls: parseMediaUrls(report.mediaUrls),
      commentsCount,
      recentComments,
    };

    // Add cache headers to prevent slow 304 responses
    res.set({
      "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      ETag: `"${id}-${report.updatedAt.getTime()}"`,
      "Last-Modified": report.updatedAt.toUTCString(),
    });

    res.json(reportWithParsedMedia);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
}

export async function getReportByIdWithUserVote(
  req: AuthRequest,
  res: Response
) {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    // Get basic report info with user's vote
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        votes: {
          where: { userId }, // Only get the current user's vote
        },
        department: true,
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    const reportWithParsedMedia = {
      ...report,
      mediaUrls: parseMediaUrls(report.mediaUrls),
      userVote: report.votes[0]?.voteType || null, // Get user's vote or null
      votes: undefined, // Remove the votes array from response
    };

    res.json(reportWithParsedMedia);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
}

export async function createReport(req: AuthRequest, res: Response) {
  try {
    const parse = createReportSchema.safeParse(req.body);
    if (!parse.success) {
      res
        .status(400)
        .json({ message: "Invalid payload", errors: parse.error.flatten() });
      return;
    }
    const data = parse.data;
    const createData: any = {
      userId: req.user!.id,
      title: data.title,
      description: data.description,
      category: data.category,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      mediaUrls: JSON.stringify(data.mediaUrls ?? []),
    };
    if (data.urgency) createData.urgency = data.urgency;
    const created = await prisma.report.create({ data: createData });
    const createdWithParsedMedia = {
      ...created,
      mediaUrls: parseMediaUrls(created.mediaUrls),
    };
    res.status(201).json(createdWithParsedMedia);
  } catch (e) {
    res.status(500).json({ message: "Failed to create report" });
  }
}

export async function updateReport(req: AuthRequest, res: Response) {
  const { id } = req.params;
  try {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    if (report.userId !== req.user!.id && !req.user!.isAdmin) {
      res.status(403).json({ message: "Not allowed" });
      return;
    }
    const updateData: any = {
      title: req.body.title ?? report.title,
      description: req.body.description ?? report.description,
      category: req.body.category ?? report.category,
      latitude: req.body.latitude ?? report.latitude,
      longitude: req.body.longitude ?? report.longitude,
      address: req.body.address ?? report.address,
      mediaUrls: JSON.stringify(req.body.mediaUrls ?? report.mediaUrls),
    };
    if (req.body.urgency) updateData.urgency = req.body.urgency;
    const updated = await prisma.report.update({
      where: { id },
      data: updateData,
    });
    const updatedWithParsedMedia = {
      ...updated,
      mediaUrls: parseMediaUrls(updated.mediaUrls),
    };
    res.json(updatedWithParsedMedia);
  } catch (e) {
    res.status(500).json({ message: "Failed to update report" });
  }
}
