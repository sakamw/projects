import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import * as votes from "../controllers/votes.controller";

const router = Router();

router.post("/report/:reportId", authenticateJWT, votes.castVote);

export default router;

