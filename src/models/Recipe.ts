import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime?: number;
  servings?: number;
  imageURL?: string;
  user: mongoose.Types.ObjectId;
}

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    cookingTime: { type: Number },
    servings: { type: Number },
    imageURL: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Recipe =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);
