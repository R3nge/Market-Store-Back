import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import imgur from "imgur";
import { produtoCreateSchema } from "../schemas/produtoSchema";

interface CustomRequest extends Request {
  file?: any;
}

export const criarProduto = async (req: CustomRequest, res: Response) => {
  try {
    const { nome, description, price, stock, type, imageUrl } = req.body;
    const { file } = req;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Nenhum arquivo enviado." });
    }

    // Aqui você pode acessar os arquivos através de req.files
    const fileBuffer = file.buffer;

    // Aqui você precisa implementar ou chamar a função que faz o upload da imagem para o Imgur
    const urlImgur = await uploadImagemParaImgur(fileBuffer);

    // Restante do código...

    // Criar um novo produto com o link da imagem
    const novoProduto = await prisma.product.create({
      data: {
        nome,
        description,
        price,
        stock,
        type,
        imageUrl: imageUrl || urlImgur, // Usa a URL obtida do Imgur ou a fornecida pelos usuários
      },
    });

    // Retornar o novo produto criado
    return res.status(201).json({ success: true, data: novoProduto });
  } catch (err) {
    // Se ocorrer um erro durante a criação, retornar uma resposta de erro
    console.error("Erro ao criar produto:", err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao criar produto." });
  }
};

// Restante do código...

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
export const deletarProduto = async (req: Request, res: Response) => {
  const { codigo } = req.params;

  try {
    // Verifique se o usuário possui permissão para excluir produtos
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message:
          "Permissão negada. Apenas administradores podem excluir produtos.",
      });
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
    return res
      .status(500)
      .json({ success: false, message: "Erro ao excluir produto." });
  }
};

// Operação para atualizar um produto
export const atualizarProduto = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const { nome, description, price, stock, type, imageUrl } = req.body;

  try {
    // Verifique se o usuário possui permissão para atualizar produtos
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message:
          "Permissão negada. Apenas administradores podem atualizar produtos.",
      });
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
    return res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar produto." });
  }
};

// Exporte o controlador de produtos
const produtoController = {
  criarProduto,
  pegarProdutos,
  deletarProduto,
  atualizarProduto,
  uploadImagemParaImgur,
};

export default produtoController;
