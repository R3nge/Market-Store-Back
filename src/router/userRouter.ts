import { Router } from "express";
import { userCreateSchema, userLoginSchema } from "../schemas";
import { validate } from "../middleware";
import usuarioController from "../controller/userController"; // Modificado para "usuarioController" com "u" minúsculo
import userController from "../controller/userController";

const router = Router();

router.post(
  "/Usuario/CriarUsuario", // Modificado o nome da rota
  //validate(userCreateSchema),
  async (req, res) => {
    usuarioController.criarUsuario(req, res);
  }
);

router.delete("/Usuario/DeletarUsuario/:id", async (req, res) => {
  usuarioController.deletarUsuario(req, res);
});

router.get("/Usuario/BuscarUsuarioUnico/:id", async (req, res) => {
  usuarioController.buscarUsuarioUnico(req, res);
});

router.get("/Usuario/BuscarUsuarios", async (req, res) => {
  usuarioController.buscarUsuarios(req, res);
});

router.post("/User/Login", async (req, res) => {
  userController.fazerLogin(req, res);
});

export default router;
