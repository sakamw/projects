import { Request, Response } from "express";
import {
  PrismaClient,
  ReportStatus,
  ReportCategory,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.nativeEnum(ReportCategory),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
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
    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: "Failed to list reports" });
  }
}

export async function getReportById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        votes: true,
        department: true,
        author: true,
      },
    });
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.json(report);
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
    const created = await prisma.report.create({
      data: {
        userId: req.user!.id,
        title: data.title,
        description: data.description,
        category: data.category,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        mediaUrls: data.mediaUrls ?? [],
      },
    });
    res.status(201).json(created);
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
    const updated = await prisma.report.update({
      where: { id },
      data: {
        title: req.body.title ?? report.title,
        description: req.body.description ?? report.description,
        category: req.body.category ?? report.category,
        latitude: req.body.latitude ?? report.latitude,
        longitude: req.body.longitude ?? report.longitude,
        address: req.body.address ?? report.address,
        mediaUrls: req.body.mediaUrls ?? report.mediaUrls,
      },
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update report" });
  }
}
