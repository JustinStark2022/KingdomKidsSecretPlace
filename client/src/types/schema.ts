// client/src/types/schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  email: z.string().email(),
  display_name: z.string(),
  role: z.enum(["parent", "child"]),
  parentId: z.number().optional(),
  firstName: z.string().min(1),  // ✅ Add this
  lastName: z.string().min(1),   // ✅ Add this
});


// Infer the type if needed elsewhere
export type RegisterFormData = z.infer<typeof registerSchema>;