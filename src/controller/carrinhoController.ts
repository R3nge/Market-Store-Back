import { CartStatus, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../database/prisma";

const handleErrors = (res: Response, status: number, message: string) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};

export const criarCarrinho = async (req: Request, res: Response) => {
  const { userId, products } = req.body ?? {};

  try {
    const existingCart = await prisma.cart.findFirst({
      where: { userId, status: CartStatus.IN_PROGRESS },
      select: { userId: true },
    });

    if (existingCart) {
      return handleErrors(res, 400, "Carrinho já existe para este usuário.");
    }

    const newCart = await prisma.cart.create({
      data: {
        userId,
        status: CartStatus.IN_PROGRESS,
        products: { create: products },
      },
    });

    res.status(201).json(newCart);
  } catch (err) {
    return handleErrors(res, 500, "Erro ao criar carrinho.");
  }
};

export const deletarCarrinho = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await prisma.cart.delete({
      where: {
        userId_status: {
          userId,
          status: CartStatus.IN_PROGRESS,
        },
      },
    });

    return res.json({
      success: true,
      message: "Carrinho excluído com sucesso.",
    });
  } catch (err) {
    return handleErrors(res, 500, "Erro ao excluir carrinho.");
  }
};

export const buscarCarrinho = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const carrinho = await prisma.cart.findMany({
      where: { userId, status: CartStatus.IN_PROGRESS },
      include: { products: true },
    });

    if (!carrinho || carrinho.length === 0) {
      return handleErrors(res, 404, "Carrinho não encontrado.");
    }

    return res.status(200).json(carrinho);
  } catch (err) {
    return handleErrors(res, 500, "Erro ao buscar carrinho.");
  }
};

const cartController = {
  criarCarrinho,
  deletarCarrinho,
  buscarCarrinho,
};

export default cartController;
