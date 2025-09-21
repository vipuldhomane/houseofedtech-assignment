"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { RecipeDetailPopup } from "./recipe-detail-popup"

interface Recipe {
  _id: string
  title: string
  ingredients: string[]
  instructions: string
  cookingTime: number
  servings: number
  imageURL: string
  user: string
  createdAt: string
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50">
        <div className="relative overflow-hidden">
          <img
            src={recipe.imageURL || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(recipe.title + " food dish")}`
            }}
          />
          <div className="absolute top-3 right-3">
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {recipe.ingredients.length} ingredients
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-balance group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{recipe.instructions}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          <Button className="w-full" size="sm" onClick={() => setIsPopupOpen(true)}>
            View Recipe
          </Button>
        </CardContent>
      </Card>

      <RecipeDetailPopup recipe={recipe} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  )
}
