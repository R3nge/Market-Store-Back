import { prisma } from "../database/prisma";
import { Request, Response } from "express";

export const changePermission = async (req: Request, res: Response) => {
  try {
    const { userId, type } = req.body ?? {};

    // Certifique-se de validar se o tipo fornecido é um valor válido
    if (!["Admin", "Usuario"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Tipo de permissão inválido." });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        type: type, // Use 'as any' para contornar o erro de tipo
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Permissão alterada com sucesso." });
  } catch (err) {
    res
      .status(400)
      .json({ error: err, message: "Falha ao alterar permissão." });
  }
};

const permissionController = {
  changePermission,
};
export default permissionController;
