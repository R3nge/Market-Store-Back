
import { z } from "zod";
const projectCreateSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Project Name is required.",
        })
        .max(50)
        .min(5),
    })
});



export { projectCreateSchema };
