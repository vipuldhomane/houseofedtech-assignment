


import api from "@/lib/axios";

export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string[];
  instructions: string;
  servings?: number;
  cookingTime: number;
  imageURL?: string;
  user?: string; // populated user ID or email
}



//Get all recipes
export async function getRecipes(): Promise<Recipe[]> {
  const res = await api.get("/recipes");
  return res.data;
}

//Get one recipe by ID
export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
}

// Create new recipe
export async function createRecipe(data: Omit<Recipe, "_id" | "user">): Promise<Recipe> {
  const res = await api.post("/recipes", data);
  return res.data;
}

//Update recipe 
export async function updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
  const res = await api.put(`/recipes/${id}`, data);
  return res.data;
}

//Delete recipe
export async function deleteRecipe(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/recipes/${id}`);
  return res.data;
}
