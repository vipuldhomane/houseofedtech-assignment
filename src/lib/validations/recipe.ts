import { z } from "zod";

export const RecipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  ingredients: z.array(z.string().min(1, "Ingredient cannot be empty")),
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
  cookingTime: z.number().int().positive().max(600).optional(), // up to 10h
  servings: z.number().int().positive().max(50).optional(),
  imageURL: z.string().url()

});

export type RecipeInput = z.infer<typeof RecipeSchema>;
