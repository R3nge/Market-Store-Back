import { Router } from "express";
import { authenticateJWT, checkPermission } from "../middleware";
import permissionController from "../controller/permissionController";

const router = Router();

router.put(
  "/Permission/ChangePermission",
  authenticateJWT,
  checkPermission,
  async (req, res) => {
    permissionController.changePermission(req, res);
  }
);

export default router;
