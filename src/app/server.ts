import express from "express";
import { produtoRouter, userRouter, permissionRouter } from "../router";
import { config } from "dotenv";
import cors from "cors";
import multer from "multer";
config();
const app = express();

// Importando rotas
app.use(express.json());
app.use(cors());
app.use(produtoRouter);
app.use(userRouter);
app.use(permissionRouter);

// Configurar o middleware multer para processar uploads
function setupMulter() {
  // Configurar o multer como necessário
  const storage = multer.memoryStorage(); // ou utilize multer.diskStorage se preferir salvar em disco
  const upload = multer({ storage: storage });

  return upload;
}

// Usar o middleware multer para todas as rotas
const multerMiddleware = setupMulter();
app.use(multerMiddleware.any());

app.get("/", (req, res) => {
  res.send("Ta rodandooo!");
});
app.use(express.json());

// TESTE
const PORT = 5432;

const server = app.listen(PORT, () =>
  console.log(`Server is running on PORT: ${PORT}`)
);

export default { app, server };
