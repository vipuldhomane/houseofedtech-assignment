import { Button } from "@/components/ui/button";
import { Search, User, Plus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              RecipeApp
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Recipes
              </Link>
              <Link
                href="/manage"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Manage
              </Link>
              {/* <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Categories
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Favorites
              </a> */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recipes..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div> */}
            <Link href="/create">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Recipe
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
