import { z } from "zod";
const userCreateSchema = z.object({
  body: z
    .object({
      fullName: z
        .string({
          required_error: "Full name is required.",
        })
        .max(50)
        .min(5),
      password: z
        .string({
          required_error: "Password is required.",
        })
        .max(50)
        .min(5),
      confirmPassword: z.string({
        required_error: "Confirm Password is required.",
      }),
      birthDate: z
        .string({
          required_error: "Please select a date and time.",
          invalid_type_error: "That's not a date!",
        })
        .pipe(z.coerce.date())
        .refine(
          (date) => {
            const ageDifMs = Date.now() - date.getTime();
            const ageDate = new Date(ageDifMs);

            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            return age >= 18;
          },
          { message: "You must be 18 years or older" }
        ),
      email: z
        .string({
          required_error: "Email is required.",
        })
        .max(50)
        .email("Not a valid email."),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match.",
        });
      }
    }),
});

const userLoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .email("Not a valid email."),
  }),
});

export { userCreateSchema, userLoginSchema };
