import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../middlewares/userMiddleware";
import * as admin from "../controllers/admin.controller";

const router = Router();

router.use(authenticateJWT, authorizeAdmin);

router.get("/reports", admin.listAllReports);
router.patch("/reports/:id/status", admin.updateReportStatus);
router.post("/reports/:id/assign", admin.assignReportToDepartment);
router.get("/analytics/summary", admin.analyticsSummary);
router.get("/departments", admin.listDepartments);

export default router;
