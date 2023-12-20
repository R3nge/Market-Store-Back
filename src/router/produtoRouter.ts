import { Router } from "express";
import multer from "multer";
import { authenticateJWT } from "../middleware";
import produtoController from "../controller/produtoController";

const router = Router();

// Configuração do multer
const upload = multer();
// Rota para fazer upload de imagem no Imgur
router.post("/Produto/UploadImagem", upload.any(), async (req, res) => {
  try {
    // Verificar se existem arquivos na requisição
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nenhum arquivo enviado." });
    }

    // Aqui você pode acessar os arquivos através de req.files
    const file = req.files[0];

    // Chame a função uploadImagemParaImgur com o buffer da imagem
    const urlImgur = await produtoController.uploadImagemParaImgur(file.buffer);

    // Retorne a URL da imagem no Imgur
    return res.status(200).json({ success: true, imageUrl: urlImgur });
  } catch (err) {
    console.error("Erro ao fazer upload de imagem:", err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao fazer upload de imagem." });
  }
});

// Rota para criar um produto
router.post(
  "/Produto/CriarProduto",
  upload.single("file"),
  authenticateJWT,
  async (req, res) => {
    try {
      const { nome, description, price, stock, type } = req.body;
      const file: Express.Multer.File = req.file;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Nenhum arquivo enviado." });
      }

      // Adicione diretamente a propriedade "file" ao objeto Request
      req.file = file;

      // Chame o controlador para criar o produto
      await produtoController.criarProduto(req, res);
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      res
        .status(500)
        .json({ success: false, message: "Erro ao criar produto." });
    }
  }
);

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
