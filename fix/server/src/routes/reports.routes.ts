import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import * as reports from "../controllers/reports.controller";

const router = Router();

// Public list & detail
router.get("/", reports.listReports);
router.get("/:id", reports.getReportById);

// Authenticated create/update
router.post("/", authenticateJWT, reports.createReport);
router.patch("/:id", authenticateJWT, reports.updateReport);

// Authenticated report detail with user vote
router.get(
  "/:id/with-vote",
  authenticateJWT,
  reports.getReportByIdWithUserVote
);

export default router;
