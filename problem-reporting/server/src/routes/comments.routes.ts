import { Router } from "express";
import { authenticateJWT } from "../middlewares/userMiddleware";
import * as comments from "../controllers/comments.controller";

const router = Router();

router.get("/report/:reportId", comments.listCommentsForReport);
router.post("/report/:reportId", authenticateJWT, comments.addCommentToReport);

export default router;

