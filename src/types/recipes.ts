// src/types/recipe.ts
export interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime?: number;
  servings?: number;
  imageURL?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
