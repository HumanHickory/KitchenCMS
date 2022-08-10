import { RecipeIngredient } from "./recipeIngredient";
import { RecipeNote } from "./recipeNote";
import { RecipeStep } from "./recipeStep";

export interface Recipe {
        id: number;
        name: string;
        ingredients: Array<RecipeIngredient>;
        steps: Array<RecipeStep>;
        notes: Array<RecipeNote>;
        minutes: number;
        isPrepRecipe: boolean;

        businessId: number;
    }