import { Request, Response } from "express";
import { z } from "zod";

// Temporary types until Prisma client is generated
type ReportStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

const prisma = { report: {}, reportAssignment: {}, department: {} } as any; // Placeholder

export async function listAllReports(_req: Request, res: Response) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        department: true,
        _count: { select: { comments: true, votes: true } },
      },
    });
    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: "Failed to list reports" });
  }
}

const statusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});
export async function updateReportStatus(req: Request, res: Response) {
  const { id } = req.params;
  const parse = statusSchema.safeParse(req.body);
  if (!parse.success) {
    res
      .status(400)
      .json({ message: "Invalid payload", errors: parse.error.flatten() });
    return;
  }
  try {
    const updated = await prisma.report.update({
      where: { id },
      data: { status: parse.data.status },
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update report status" });
  }
}

const assignSchema = z.object({
  departmentId: z.string(),
  note: z.string().optional(),
});
export async function assignReportToDepartment(req: Request, res: Response) {
  const { id } = req.params; // report id
  const parse = assignSchema.safeParse(req.body);
  if (!parse.success) {
    res
      .status(400)
      .json({ message: "Invalid payload", errors: parse.error.flatten() });
    return;
  }
  try {
    const assignment = await prisma.reportAssignment.create({
      data: {
        reportId: id,
        departmentId: parse.data.departmentId,
        assignedByUserId: (req as any).user.id,
        note: parse.data.note,
      },
    });
    await prisma.report.update({
      where: { id },
      data: { departmentId: parse.data.departmentId },
    });
    res.status(201).json(assignment);
  } catch (e) {
    res.status(500).json({ message: "Failed to assign report" });
  }
}

export async function analyticsSummary(_req: Request, res: Response) {
  try {
    const byCategory = await prisma.report.groupBy({
      by: ["category"],
      _count: { _all: true },
    });
    const byStatus = await prisma.report.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const resolved = await prisma.report.findMany({
      where: { status: "RESOLVED" },
      select: { createdAt: true, updatedAt: true },
    });
    const avgResolutionMs = resolved.length
      ? resolved.reduce(
          (acc: number, r: { createdAt: Date; updatedAt: Date }) =>
            acc + (r.updatedAt.getTime() - r.createdAt.getTime()),
          0
        ) / resolved.length
      : 0;
    res.json({ byCategory, byStatus, avgResolutionMs });
  } catch (e) {
    res.status(500).json({ message: "Failed to compute analytics" });
  }
}

export async function listDepartments(_req: Request, res: Response) {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });
    res.json(departments);
  } catch (e) {
    res.status(500).json({ message: "Failed to list departments" });
  }
}
