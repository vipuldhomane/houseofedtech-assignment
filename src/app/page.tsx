import { RecipeGrid } from "@/components/recipe-grid";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">
            Discover Amazing Recipes
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our collection of delicious recipes from around the world
          </p>
        </div>
        <RecipeGrid />
      </main>
    </div>
  );
}
