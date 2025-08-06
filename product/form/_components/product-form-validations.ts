"use client";

import { z } from "zod";

export const ProductFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  discountedPrice: z.number().min(0, "Discounted price must be positive"),
  summary: z.string().optional(),
  stock: z.number().min(0, "Stock must be positive"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
