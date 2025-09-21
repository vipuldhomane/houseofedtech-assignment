"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createRecipe } from "@/services/recipes";

export default function CreateRecipePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    cookingTime: "",
    servings: "",
    imageURL: "",
    instructions: "",
  });
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Here you would typically send the data to your API
  //   const recipeData = {
  //     ...formData,
  //     ingredients,
  //     cookingTime: Number.parseInt(formData.cookingTime),
  //     servings: Number.parseInt(formData.servings),
  //     createdAt: new Date().toISOString(),
  //     _id: Date.now().toString(), // Temporary ID generation
  //     user: "current-user-id",
  //   }
  //   console.log("Recipe created:", recipeData)
  //   // Navigate back to home or show success message
  //   router.push("/")
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData = {
      ...formData,
      ingredients,
      cookingTime: Number(formData.cookingTime),
      servings: Number(formData.servings),
    };

    try {
      const res = await createRecipe(recipeData);
      console.log("Recipe created:", res);

      // Redirect to home (or recipe detail page if you want)
      router.push("/");
    } catch (err) {
      console.error("Failed to create recipe", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Recipe</h1>
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
                    placeholder="Enter recipe title"
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
                      placeholder="30"
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
                      placeholder="4"
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
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Image Preview */}
                {formData.imageURL && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img
                        src={formData.imageURL || "/placeholder.svg"}
                        alt="Recipe preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `/placeholder.svg?height=200&width=300&query=recipe image`;
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
                placeholder="Write your recipe instructions here..."
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              <Save className="h-4 w-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
