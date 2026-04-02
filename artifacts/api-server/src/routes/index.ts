import { Router, type IRouter } from "express";
import healthRouter from "./health";
import providersRouter from "./providers";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(providersRouter);
router.use(reportsRouter);

export default router;
