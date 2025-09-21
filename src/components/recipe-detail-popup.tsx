"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart, Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  imageURL: string;
  user: string;
  createdAt: string;
}

interface RecipeDetailPopupProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
}

export function RecipeDetailPopup({
  recipe,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: RecipeDetailPopupProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-balance">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={recipe.imageURL || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(
                  recipe.title + " food dish"
                )}`;
              }}
            />
          </div>

          {/* Recipe Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookingTime} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <Badge variant="secondary">
                {recipe.ingredients.length} ingredients
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button> */}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(recipe)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(recipe._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Ingredients Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Instructions Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {recipe.instructions}
              </p>
            </div>
          </div>

          <Separator />

          {/* Recipe Info */}
          <div className="text-xs text-muted-foreground">
            <p>Created on {new Date(recipe.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
