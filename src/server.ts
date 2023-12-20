import express, { response } from "express";
import routes from "./routes";
import { produtoRouter, userRouter, permissionRouter } from "./router";
import { config } from "dotenv";
import cors from "cors";
config();
const app = express();

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(produtoRouter);
app.use(userRouter);
app.use(permissionRouter);

app.get("/", (req, res) => {
  res.send("Ta rodandooo!");
});
app.use(express.json());

// TESTE

const PORT = 5432;

const server = app.listen(PORT, () =>
  console.log(`Server is running on PORT: ${PORT}`)
);

export default { app, server, routes };
