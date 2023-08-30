import { Request, Response, Router } from "express";
import { authenticateRequest } from "../middlewares/auth";

const router = Router();

router.get("/", authenticateRequest({}), (req: Request, res: Response) => {
  res.send({
    message: "from admin root url",
  });
});

export default router;
