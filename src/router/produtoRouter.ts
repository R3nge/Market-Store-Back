import { Router, Request, Response } from "express";
import produtoController from "../controller/produtoController";

const router = Router();

// Rota para criar um produto com o URL da imagem
router.post("/Produto/CriarProduto", (req, res) => {
  produtoController.criarProduto(req, res);
});

// Rotas para listar, deletar e atualizar produtos
router.get("/Produto/PegarProdutos", (req, res) => {
  produtoController.pegarProdutos(req, res);
});

router.delete("/Produto/DeletarProduto/:id", (req, res) => {
  produtoController.deletarProduto(req, res);
});

router.put("/Produto/AtualizarProduto/:id", (req, res) => {
  produtoController.atualizarProduto(req, res);
});

router.get("/Produto/PegarProdutosPorTipo/:type", (req, res) => {
  produtoController.pegarProdutosPorTipo(req, res);
});

// Rota para obter produtos por preço
router.get("/Produto/PegarProdutosPorPreco", (req, res) => {
  produtoController.pegarProdutosPorPreco(req, res);
});

export default router;
