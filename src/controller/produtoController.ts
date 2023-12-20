import { prisma } from "../database/prisma";
import { Request, Response } from "express";

// Função para lidar com erros e retornar respostas consistentes
const handleErrors = (res: Response, status: number, message: string) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};

// Operação para criar um novo produto
export const criarProduto = async (req: Request, res: Response) => {
  try {
    const { nome, description, price, stock, type, imageUrl } = req.body;

    // Verifique se o usuário possui permissão para criar produtos
    if (req.user.role !== "Admin") {
      return handleErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem criar produtos."
      );
    }

    // Verifique se o produto já existe pelo nome
    const produtoExistente = await prisma.product.findUnique({
      where: { nome: nome },
      select: { nome: true },
    });

    if (produtoExistente) {
      return handleErrors(res, 400, "Produto já existe.");
    }

    // Crie um novo produto
    const novoProduto = await prisma.product.create({
      data: {
        nome,
        description,
        price,
        stock,
        type,
        imageUrl,
      },
    });

    // Retorne o novo produto criado
    return res.status(201).json(novoProduto);
  } catch (err) {
    // Se ocorrer um erro durante a criação, retorne uma resposta de erro
    return handleErrors(res, 500, "Erro ao criar produto.");
  }
};

// Operação para obter todos os produtos
export const pegarProdutos = async (req: Request, res: Response) => {
  try {
    // Obtenha todos os produtos do banco de dados
    const todosProdutos = await prisma.product.findMany({});
    // Retorne a lista de produtos
    return res.status(200).json(todosProdutos);
  } catch (err) {
    // Se ocorrer um erro durante a busca, retorne uma resposta de erro
    return handleErrors(res, 500, "Erro ao buscar produtos.");
  }
};

// Operação para excluir um produto
export const deletarProduto = async (req: Request, res: Response) => {
  const { codigo } = req.params;

  try {
    // Verifique se o usuário possui permissão para excluir produtos
    if (req.user.role !== "Admin") {
      return handleErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem excluir produtos."
      );
    }

    // Exclua o produto pelo código
    await prisma.product.delete({
      where: { id: codigo },
    });

    // Retorne uma resposta de sucesso
    return res.json({
      success: true,
      message: "Produto excluído com sucesso.",
    });
  } catch (err) {
    // Se ocorrer um erro durante a exclusão, retorne uma resposta de erro
    return handleErrors(res, 500, "Erro ao excluir produto.");
  }
};

// Operação para atualizar um produto
export const atualizarProduto = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const { nome, description, price, stock, type, imageUrl } = req.body;

  try {
    // Verifique se o usuário possui permissão para atualizar produtos
    if (req.user.role !== "Admin") {
      return handleErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem atualizar produtos."
      );
    }

    // Atualize o produto pelo código
    const produtoAtualizado = await prisma.product.update({
      where: { id: codigo },
      data: {
        nome,
        description,
        price,
        stock,
        type,
        imageUrl,
      },
    });

    // Retorne uma resposta com o produto atualizado
    return res.json({ success: true, data: produtoAtualizado });
  } catch (err) {
    // Se ocorrer um erro durante a atualização, retorne uma resposta de erro
    return handleErrors(res, 500, "Erro ao atualizar produto.");
  }
};

// Exporte o controlador de produtos
const produtoController = {
  criarProduto,
  pegarProdutos,
  deletarProduto,
  atualizarProduto,
};

export default produtoController;
