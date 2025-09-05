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

export default router;

