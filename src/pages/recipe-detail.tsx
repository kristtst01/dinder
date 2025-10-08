// ...existing code...
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ALL_RECIPES } from "../data/recipes";
import { useSavedRecipesContext } from "../context/SavedRecipesContext";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { isSaved, toggle } = useSavedRecipesContext();

  // find recipe by id from sample data
  const recipe = useMemo(() => ALL_RECIPES.find((r) => r.id === id), [id]) as any | undefined;

  if (!recipe) {
    return <div className="p-4">Recipe not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header with back */}
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <button onClick={() => window.history.back()} className="p-2 rounded-lg">
          Back
        </button>
        <h1 className="text-lg font-semibold">Recipe</h1>
        <div className="ml-auto">
          <button
            onClick={() => toggle(recipe.id)}
            aria-pressed={isSaved(recipe.id)}
            className="px-3 py-1 rounded-lg border"
          >
            {isSaved(recipe.id) ? "Unsave" : "Save"}
          </button>
        </div>
      </div>

      {/* Hero image */}
      {recipe.image && (
        <div className="p-4">
          <img src={recipe.image} alt={recipe.title || "recipe"} className="w-full h-56 object-cover rounded-lg" />
        </div>
      )}

      {/* Basic meta */}
      <main className="p-4">
        <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
        <p className="text-sm text-gray-600 mb-2">By: {recipe.chef ?? "Unknown"}</p>
        <p className="text-sm text-gray-600 mb-2">
          Kitchen: {recipe.kitchen ?? "Other"} • Prep: {recipe.prepMinutes ?? "—"} min •{" "}
          {recipe.vegetarian ? "Vegetarian" : "Non-vegetarian"}
        </p>

        {/* Ingredients (if present) */}
        {recipe.ingredients ? (
          <>
            <h3 className="font-semibold mt-4 mb-2">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ing: string, i: number) => (
                <li key={i} className="text-gray-700">
                  {ing}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {/* Instructions (fallback text if missing) */}
        <section className="mt-4">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <p className="text-gray-700">
            {recipe.instructions || recipe.strInstructions || "No instructions available for this recipe."}
          </p>
        </section>
      </main>
    </div>
  );
}
