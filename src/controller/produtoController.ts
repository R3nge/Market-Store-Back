import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { Role, Type } from "@prisma/client";

const handleProductErrors = (
  res: Response,
  status: number,
  message: string
) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};

export const criarProduto = async (req: Request, res: Response) => {
  try {
    const { nome, description, price, stock, type, imageUrl } = req.body;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Nenhuma URL de imagem fornecida." });
    }

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

    return res.status(201).json({ success: true, data: novoProduto });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao criar produto." });
  }
};

export const pegarProdutos = async (req: Request, res: Response) => {
  try {
    const todosProdutos = await prisma.product.findMany({});
    return res.status(200).json(todosProdutos);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos." });
  }
};

export const deletarProduto = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    const userRole = req.user?.role;

    if (userRole !== Role.Admin) {
      return handleProductErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem deletar produtos."
      );
    }

    await prisma.product.delete({
      where: { id: id },
    });

    return res.json({
      success: true,
      message: "Produto excluído com sucesso.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Erro ao excluir produto." });
  }
};

export const atualizarProduto = async (req: any, res: Response) => {
  const { id } = req.params;
  const { nome, description, price, stock, type, imageUrl } = req.body;

  try {
    const userRole = req.user?.role;

    if (userRole !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message:
          "Permissão negada. Apenas administradores podem atualizar produtos.",
      });
    }

    const produtoAtualizado = await prisma.product.update({
      where: { id: id },
      data: {
        nome,
        description,
        price,
        stock,
        type,
        imageUrl,
      },
    });

    return res.json({ success: true, data: produtoAtualizado });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar produto." });
  }
};

export const pegarProdutosPorTipo = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (!Object.values(Type).includes(type as Type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de produto inválido.",
      });
    }

    const produtosPorTipo = await prisma.product.findMany({
      where: { type: type as Type },
    });

    return res.status(200).json(produtosPorTipo);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos por tipo." });
  }
};

export const pegarProdutosPorPreco = async (req: Request, res: Response) => {
  try {
    const produtosPorPreco = await prisma.product.findMany({
      orderBy: { price: "asc" },
    });

    return res.status(200).json(produtosPorPreco);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos por preço." });
  }
};

const produtoController = {
  criarProduto,
  pegarProdutos,
  deletarProduto,
  atualizarProduto,
  pegarProdutosPorTipo,
  pegarProdutosPorPreco,
};

export default produtoController;
