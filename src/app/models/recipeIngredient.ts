import { Ingredient } from "./ingredient";
import { Measurement } from "./measurement";
import { Recipe } from "./recipe";

export interface RecipeIngredient {
    id: number;
    recipeId: number;
    ingredientId: number;
    measurementId: number;
    measurementAmount: number;  


    ingredient: Ingredient;
    recipe: Recipe;
    measurement: Measurement;
    }