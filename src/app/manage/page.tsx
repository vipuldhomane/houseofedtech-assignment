"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Filter,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RecipeDetailPopup } from "@/components/recipe-detail-popup";
import { getRecipes, deleteRecipe } from "@/services/recipes"; // ✅ use helpers

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
  updatedAt: string;
}

export default function ManageRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);

  // ✅ Fetch recipes from API
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        //@ts-expect-error // mongoose typing issue
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailPopupOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    router.push(`/edit/${recipe._id}`);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipe(recipeId); // ✅ API call
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId)); // Optimistic UI update
    } catch (err: any) {
      alert(err.message || "Failed to delete recipe");
    } finally {
      setDeleteRecipeId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading recipes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Manage Recipes</h1>
              <p className="text-muted-foreground">
                Edit, delete, or view your recipes
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/create")}>Add New Recipe</Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes by name or ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipe List */}
        <div className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No recipes found matching your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card
                key={recipe._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Recipe Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={recipe.imageURL || "/placeholder.svg"}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(
                            recipe.title + " food dish"
                          )}`;
                        }}
                      />
                    </div>

                    {/* Recipe Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-2 truncate">
                        {recipe.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {recipe.instructions}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cookingTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        <Badge variant="secondary">
                          {recipe.ingredients.length} ingredients
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(recipe.createdAt).toLocaleDateString()}
                        {recipe.updatedAt !== recipe.createdAt && (
                          <span>
                            {" "}
                            • Updated:{" "}
                            {new Date(recipe.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRecipe(recipe)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewRecipe(recipe)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditRecipe(recipe)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Recipe
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteRecipeId(recipe._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Recipe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recipe Detail Popup */}
        <RecipeDetailPopup
          recipe={selectedRecipe}
          isOpen={isDetailPopupOpen}
          onClose={() => setIsDetailPopupOpen(false)}
          onEdit={handleEditRecipe}
          onDelete={(id) => setDeleteRecipeId(id)}
        />

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteRecipeId}
          onOpenChange={() => setDeleteRecipeId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this recipe? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteRecipeId && handleDeleteRecipe(deleteRecipeId)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
