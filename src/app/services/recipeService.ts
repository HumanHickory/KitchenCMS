import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Allergen } from "../models/allergen";
import { Ingredient } from "../models/ingredient";
import { Measurement } from "../models/measurement";
import { Recipe } from "../models/recipe";
import { RecipeIngredient } from "../models/recipeIngredient";

@Injectable()
export class RecipeService {
    constructor(private http: HttpClient) { }
    
    getRecipes(locationId: number){
        return this.http.get<Array<Recipe>>(environment.apiUrl() + "menu/getlocationrecipes?locationId=" + locationId);       
    }
       
    getRecipe(recipeId: number){
        return this.http.get<Recipe>(environment.apiUrl() + "menu/getRecipe?recipeId=" + recipeId);       
    }
    
    getIngredients(locationId: number){
        return this.http.get<Array<Ingredient>>(environment.apiUrl() + "menu/GetIngredientByLocationId?locationId=" + locationId);       
    }

    listAllergens(){
        return this.http.get<Array<Allergen>>(environment.apiUrl() + "menu/ListAllergens");       
    }

    listMeasurements(){
        return this.http.get<Array<Measurement>>(environment.apiUrl() + "menu/ListMeasurements");       
    }

    createIngredient(ingredient: Ingredient){
        return this.http.post<Ingredient>(environment.apiUrl() + "menu/CreateIngredient", ingredient);
    }
       
    createRecipe(recipe: Recipe){
        return this.http.post<Recipe>(environment.apiUrl() + "menu/CreateRecipe", recipe);
    }

    updateRecipe(recipe: Recipe){
        return this.http.post<Recipe>(environment.apiUrl() + "menu/UpdateRecipe", recipe);
    }

}