import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

const saltRounds = 10; // Numero para gerar o hash da senha

const handleUserErrors = (res: Response, status: number, message: string) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};
/* eslint-disable @typescript-eslint/no-unused-vars */

export const criarUsuario = async (req: Request, res: Response) => {
  const { email, password, fullName, birthDate, type, Role } = req.body || {};

  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Usuário já existe." });
    }

    // Gera o hash da senha
    const hash = await bcrypt.hash(password, saltRounds);

    // Divide o nome completo em partes
    const [firstName, middleName, lastName] = fullName.split(" ");

    console.log("birthDate antes:", birthDate);

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        firstName,
        middleName,
        lastName,
        birthDate: new Date(birthDate).toISOString(),
        type: type || Role.User,
      },
    });

    console.log("Usuário criado:", user);

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Erro ao criar usuário." });
  } finally {
    await prisma.$disconnect();
  }
};

export const fazerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  try {
    // Busca o usuário no banco de dados
    const login = await prisma.user.findUnique({
      where: { email },
      select: { email: true, password: true, type: true },
    });

    // Compara as senhas
    const match = await bcrypt.compare(password, String(login?.password));

    if (!login || !match) {
      return res.status(400).json({
        success: false,
        message: "Usuário não encontrado ou senha incorreta.",
      });
    }

    // Gera o token JWT
    const token = jwt.sign({ email, type: login?.type }, "senha_secreta");

    res.status(200).json({ jwt: `Bearer ${token}` });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Usuário incorreto." });
  } finally {
    await prisma.$disconnect();
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verifique se o usuário autenticado tem permissão para deletar usuários
    if (req.user.role !== Role.Admin) {
      return handleUserErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem deletar usuários."
      );
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return res.json({
      success: true,
      message: "Usuário excluído com sucesso.",
    });
  } catch (err) {
    return handleUserErrors(res, 500, "Erro ao excluir usuário.");
  }
};

export const buscarUsuarioUnico = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verifique se o usuário autenticado tem permissão para buscar usuários únicos
    if (req.user.role !== Role.Admin) {
      return handleUserErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem buscar usuários únicos."
      );
    }

    const usuario = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!usuario) {
      return handleUserErrors(res, 404, "Usuário não encontrado.");
    }

    return res.status(200).json(usuario);
  } catch (err) {
    return handleUserErrors(res, 500, "Erro ao buscar usuário único.");
  }
};

export const buscarUsuarios = async (req: Request, res: Response) => {
  try {
    // Verifique se o usuário autenticado tem permissão para buscar todos os usuários
    if (req.user.role !== Role.Admin) {
      return handleUserErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem buscar todos os usuários."
      );
    }

    const todosUsuarios = await prisma.user.findMany({});
    return res.status(200).json(todosUsuarios);
  } catch (err) {
    return handleUserErrors(res, 500, "Erro ao buscar usuários.");
  }
};

const usuarioController = {
  criarUsuario,
  deletarUsuario,
  buscarUsuarioUnico,
  buscarUsuarios,
  fazerLogin,
};

export default usuarioController;
