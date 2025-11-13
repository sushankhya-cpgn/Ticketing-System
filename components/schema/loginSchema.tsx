import {z} from "zod";

const loginSchema = z.object({
  // email: z.email("Invalid email address"),
  username:z.string(),
  password: z.string().min(6,"Password must be atleast 6 characters"),
  remember: z.boolean().optional()
})

export default loginSchema;