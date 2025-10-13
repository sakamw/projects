import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import * as dashboard from "../controllers/dashboard.controller";

const router = Router();

// All dashboard routes require authentication
router.use(authenticateJWT);

// Dashboard stats
router.get("/stats", dashboard.getDashboardStats);

// User activities
router.get("/activities", dashboard.getDashboardActivities);

// User profile
router.get("/profile", dashboard.getUserProfile);

// User's reports
router.get("/reports", dashboard.getUserReports);

// User's votes
router.get("/votes", dashboard.getUserVotes);

export default router;
