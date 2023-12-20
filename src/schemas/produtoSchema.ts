import { z } from "zod";

const produtoCreateSchema = z.object({
  body: z.object({
    nome: z
      .string({
        required_error: "Nome é obrigatório.",
      })
      .max(255),
    description: z.string({
      required_error: "Descrição é obrigatória.",
    }),
    price: z
      .number({
        required_error: "Preço é obrigatório.",
      })
      .min(0),
    stock: z
      .number({
        required_error: "Estoque é obrigatório.",
      })
      .min(0),
    type: z
      .string({
        required_error: "Tipo é obrigatório.",
      })
      .refine(
        (value) =>
          [
            "Camisa",
            "Camiseta",
            "Casaco",
            "Bermuda",
            "Jeans",
            "Tênis",
          ].includes(value),
        {
          message: "Tipo inválido.",
        }
      ),
    imageUrl: z.string({
      required_error: "URL da imagem é obrigatória.",
    }),
  }),
});

export { produtoCreateSchema };
