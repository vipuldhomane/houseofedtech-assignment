import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { RecipeSchema } from "@/lib/validations/recipe";

// POST /api/recipes — Create a new recipe
export async function POST(req: Request) {
  try {
    console.log("userId from header");
    await connectToDatabase();

    // Get userId from middleware-injected header
    const userId = (req.headers as any).get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body using Zod
    const body = await req.json();
    const parsed = RecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Create recipe with authenticated user
    const recipe = await Recipe.create({ ...parsed.data, user: userId });

    return NextResponse.json(recipe, { status: 201 });
  } catch (err: any) {
    console.error(" inside it POST /api/recipes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/recipes — Get all recipes
export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all recipes and populate user email
    const recipes = await Recipe.find() 

    return NextResponse.json(recipes, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/recipes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
