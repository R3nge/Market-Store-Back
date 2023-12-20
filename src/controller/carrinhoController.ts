import { CartStatus } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { twilioClient } from "twilio";

// Configure suas credenciais Twilio
const accountSid = "SuaContaSid";
const authToken = "SeuAuthToken";
const twilioPhoneNumber = "SeuNúmeroTwilio";

const handleCartErrors = (res: Response, status: number, message: string) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};

export const criarCarrinho = async (req: Request, res: Response) => {
  const { userId, products } = req.body ?? {};

  try {
    const existingCart = await prisma.cart.findFirst({
      where: { userId: userId, status: CartStatus.IN_PROGRESS },
      select: { userId: true },
    });

    if (existingCart) {
      return handleCartErrors(
        res,
        400,
        "Carrinho já existe para este usuário."
      );
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
    return handleCartErrors(res, 500, "Erro ao criar carrinho.");
  }
};

export const deletarCarrinho = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await prisma.cart.deleteMany({
      where: { userId: userId, status: CartStatus.IN_PROGRESS },
    });

    return res.json({
      success: true,
      message: "Carrinho excluído com sucesso.",
    });
  } catch (err) {
    return handleCartErrors(res, 500, "Erro ao excluir carrinho.");
  }
};

export const buscarCarrinho = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const carrinho = await prisma.cart.findMany({
      where: { userId: userId, status: CartStatus.IN_PROGRESS },
      include: { products: true },
    });

    if (!carrinho || carrinho.length === 0) {
      return handleCartErrors(res, 404, "Carrinho não encontrado.");
    }

    return res.status(200).json(carrinho);
  } catch (err) {
    return handleCartErrors(res, 500, "Erro ao buscar carrinho.");
  }
};

// Rota para finalizar a compra e enviar para o WhatsApp do vendedor
export const finalizarCompra = async (req: Request, res: Response) => {
  const { userId, items } = req.body;

  try {
    const itemsDetails = await prisma.product.findMany({
      where: { id: { in: items } },
    });

    const messageBody = `Novo pedido de compra:\n${itemsDetails
      .map((item) => `${item.nome}: R$ ${item.price.toFixed(2)}`)
      .join("\n")}`;

    // Substitua o número do vendedor pelo número real do vendedor
    const vendedorPhoneNumber = "Número_do_vendedor";

    // Envie a mensagem para o WhatsApp do vendedor usando a API do Twilio
    await twilioClient.messages.create({
      body: messageBody,
      from: "seu_numero_no_twilio",
      to: `whatsapp:${vendedorPhoneNumber}`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Pedido enviado com sucesso." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao processar o pedido." });
  }
};

const cartController = {
  criarCarrinho,
  deletarCarrinho,
  buscarCarrinho,
  finalizarCompra, // Adiciona a nova rota para finalizar a compra
};

export default cartController;
