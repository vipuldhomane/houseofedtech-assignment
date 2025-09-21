"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";

// 🔥 Import services
import { getRecipeById, updateRecipe } from "@/services/recipes";

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    cookingTime: "",
    servings: "",
    imageURL: "",
    instructions: "",
  });
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

  // ✅ Load recipe data from API
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const foundRecipe = await getRecipeById(params.id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          setFormData({
            title: foundRecipe.title,
            cookingTime: foundRecipe.cookingTime.toString(),
            servings: foundRecipe.servings?.toString() || "",
            imageURL: foundRecipe.imageURL || "",
            instructions: foundRecipe.instructions,
          });
          setIngredients(foundRecipe.ingredients || []);
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [params.id]);

  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim())
    ) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // ✅ Submit updated recipe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;

    const updatedRecipeData = {
      title: formData.title,
      cookingTime: Number.parseInt(formData.cookingTime),
      servings: Number.parseInt(formData.servings),
      imageURL: formData.imageURL,
      instructions: formData.instructions,
      ingredients,
    };

    try {
      setSaving(true);
      const updated = await updateRecipe(recipe._id, updatedRecipeData);
      console.log("Recipe updated:", updated);
      router.push("/manage"); // redirect after success
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Recipe Not Found</h1>
          <Button onClick={() => router.push("/manage")}>Back to Manage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Recipe</h1>
            <p className="text-muted-foreground">Update your recipe details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                    <Input
                      id="cookingTime"
                      type="number"
                      value={formData.cookingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cookingTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) =>
                        setFormData({ ...formData, servings: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageURL">Image URL</Label>
                  <Input
                    id="imageURL"
                    value={formData.imageURL}
                    onChange={(e) =>
                      setFormData({ ...formData, imageURL: e.target.value })
                    }
                  />
                </div>

                {formData.imageURL && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img
                        src={formData.imageURL}
                        alt="Recipe preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    placeholder="Add an ingredient"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIngredient())
                    }
                  />
                  <Button type="button" onClick={addIngredient} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border rounded-lg bg-muted/30">
                  {ingredients.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No ingredients added yet
                    </p>
                  ) : (
                    ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={formData.instructions}
                onChange={(value) =>
                  setFormData({ ...formData, instructions: value })
                }
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[120px]">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Update Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
