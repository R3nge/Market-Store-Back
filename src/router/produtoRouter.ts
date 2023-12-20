import { Router } from "express";
import { authenticateJWT } from "../middleware";
import produtoController from "../controller/produtoController";

const router = Router();

router.post("/Produto/CriarProduto", (req, res) => {
  produtoController.criarProduto(req, res);
});

router.delete("/Produto/DeletarProduto", authenticateJWT, (req, res) => {
  produtoController.deletarProduto(req, res);
});

router.get("/Produto/PegarProdutos", (req, res) => {
  produtoController.pegarProdutos(req, res);
});

router.put("/Produto/AtualizarProduto", (req, res) => {
  produtoController.atualizarProduto(req, res);
});

export default router;
