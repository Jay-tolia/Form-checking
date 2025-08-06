"use client";

import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;
