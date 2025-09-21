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
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <span>Assignment by Vipul Dhomane</span>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <a
              href="https://github.com/vipuldhomane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Vipul Dhomane GitHub
            </a>
            <a
              href="https://github.com/vipuldhomane/houseofedtech-assignment"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub Repo
            </a>
            <a
              href="https://www.linkedin.com/in/vipuldhomane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
