import { prisma } from "../database/prisma";
import e, { Request, Response } from "express";
import imgur from "imgur";
import { produtoCreateSchema } from "../schemas/produtoSchema";
import { Role, Type, User } from "@prisma/client";
import axios from "axios";

const handleUserErrors = (res: Response, status: number, message: string) => {
  console.error(message);
  return res.status(status).json({ success: false, message });
};

export const criarProduto = async (req: Request, res: Response) => {
  try {
    const { nome, description, price, stock, type, imageUrl } = req.body;

    // Verifica se a URL da imagem foi fornecida
    if (!imageUrl) {
      console.log("Erro: Nenhuma URL de imagem fornecida.");
      return res
        .status(400)
        .json({ success: false, message: "Nenhuma URL de imagem fornecida." });
    }

    // Se necessário, você pode salvar a URLImgur no banco de dados
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

    // Retorna o novo produto criado
    return res.status(201).json({ success: true, data: novoProduto });
  } catch (err) {
    // Se ocorrer um erro durante a criação, retorna uma resposta de erro
    console.error("Erro ao criar produto:", err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao criar produto." });
  }
};
// Função para fazer upload de uma imagem para o Imgur
async function uploadImagemParaImgur(imagemBuffer: Buffer): Promise<string> {
  // Aqui você precisa implementar a lógica para fazer upload da imagem para o Imgur
  // e retornar a URL da imagem
  // Exemplo fictício:
  const urlImgur = "https://url-da-imagem-no-imgur.com";
  return urlImgur;
}

// Operação para obter todos os produtos
export const pegarProdutos = async (req: Request, res: Response) => {
  try {
    // Obtenha todos os produtos do banco de dados
    const todosProdutos = await prisma.product.findMany({});
    // Retorne a lista de produtos
    return res.status(200).json(todosProdutos);
  } catch (err) {
    // Se ocorrer um erro durante a busca, retorne uma resposta de erro
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos." });
  }
};

// Operação para excluir um produto
export const deletarProduto = async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    // Verifique se o usuário autenticado tem permissão para deletar usuários
    const userRole = req.user?.role;

    if (userRole !== Role.Admin) {
      return handleUserErrors(
        res,
        403,
        "Permissão negada. Apenas administradores podem deletar usuários."
      );
    }
    // Exclua o produto pelo código
    await prisma.product.delete({
      where: { id: id },
    });

    // Retorne uma resposta de sucesso
    return res.json({
      success: true,
      message: "Produto excluído com sucesso.",
    });
  } catch (err) {
    // Se ocorrer um erro durante a exclusão, retorne uma resposta de erro
    return res
      .status(500)
      .json({ success: false, message: "Erro ao excluir produto." });
  }
};

// Operação para atualizar um produto

export const atualizarProduto = async (req: any, res: Response) => {
  const { id } = req.params;
  const { nome, description, price, stock, type, imageUrl } = req.body;
  try {
    // Verifique se o usuário autenticado tem permissão para deletar usuários
    const userRole = req.user?.role;

    if (userRole !== Role.Admin) {
      return res.status(403).json({
        success: false,
        message:
          "Permissão negada. Apenas administradores podem atualizar produtos.",
      });
    }

    // Atualize o produto pelo código
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

    // Retorne uma resposta com o produto atualizado
    return res.json({ success: true, data: produtoAtualizado });
  } catch (err) {
    // Se ocorrer um erro durante a atualização, retorne uma resposta de erro
    return res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar produto." });
  }
};

// Pegar produto por tipo ( Camisa Calça Etc)

export const pegarProdutosPorTipo = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    // Certifique-se de que o valor fornecido para 'type' é uma opção válida da enumeração Type
    if (!Object.values(type).includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de produto inválido.",
      });
    }

    // Obtenha produtos do banco de dados com base no tipo
    const produtosPorTipo = await prisma.product.findMany({
      where: { type: type as Type }, // Converta para o tipo esperado pelo Prisma
    });

    // Retorne a lista de produtos por tipo
    return res.status(200).json(produtosPorTipo);
  } catch (err) {
    // Se ocorrer um erro durante a busca, retorne uma resposta de erro
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos por tipo." });
  }
};

// Operação para obter produtos por preço
export const pegarProdutosPorPreco = async (req: Request, res: Response) => {
  try {
    // Ordene os produtos por preço
    const produtosPorPreco = await prisma.product.findMany({
      orderBy: { price: "asc" }, // ou "desc" para ordem decrescente
    });

    // Retorne a lista de produtos por preço
    return res.status(200).json(produtosPorPreco);
  } catch (err) {
    // Se ocorrer um erro durante a busca, retorne uma resposta de erro
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar produtos por preço." });
  }
};

// Exporte o controlador de produtos
const produtoController = {
  criarProduto,
  pegarProdutos,
  deletarProduto,
  atualizarProduto,
  uploadImagemParaImgur,
  pegarProdutosPorTipo,
  pegarProdutosPorPreco,
};

export default produtoController;
