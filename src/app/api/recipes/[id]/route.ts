// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import { Recipe } from "@/models/Recipe";
// import { RecipeSchema } from "@/lib/validations/recipe";

// // export async function GET(_req: Request, { params }: { params: { id: string } }) {
// //   try {
// //     await connectToDatabase();
// //     const recipe = await Recipe.findById(params.id);
// //     if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
// //     return NextResponse.json(recipe, { status: 200 });
// //   } catch (err: any) {
// //     return NextResponse.json({ error: err.message }, { status: 500 });
// //   }
// // }

// export async function GET(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectToDatabase();
//     const { id } = context.params;

//     const recipe = await Recipe.findById(id);
//     if (!recipe) {
//       return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
//     }

//     return NextResponse.json(recipe, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectToDatabase();
//     const userId = (req.headers as any).get("x-user-id");
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const parsed = RecipeSchema.partial().safeParse(body); // ✅ allow partial updates

//     if (!parsed.success) {
//       return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
//     }

//     const recipe = await Recipe.findOneAndUpdate(
//       { _id: params.id, user: userId }, // ✅ only allow owner to edit
//       parsed.data,
//       { new: true }
//     );

//     if (!recipe) return NextResponse.json({ error: "Recipe not found or unauthorized" }, { status: 404 });

//     return NextResponse.json(recipe, { status: 200 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
//   try {
//     await connectToDatabase();
//     const userId = (_req.headers as any).get("x-user-id");
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const recipe = await Recipe.findOneAndDelete({ _id: params.id, user: userId });
//     if (!recipe) return NextResponse.json({ error: "Recipe not found or unauthorized" }, { status: 404 });

//     return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { RecipeSchema } from "@/lib/validations/recipe";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params; // ✅ await the params

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params; // ✅

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = RecipeSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, user: userId },
      parsed.data,
      { new: true }
    );

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params; // ✅

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipe = await Recipe.findOneAndDelete({ _id: id, user: userId });
    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
