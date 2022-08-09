import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeService } from 'src/app/services/recipeService';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]

})
export class RecipesComponent implements OnInit {
  recipe: Recipe;
  recipes: Array<Recipe>;
  RecipeSelected: boolean = false;
  showRecipes: boolean = false;

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'minutes', header: 'Cook Time (min)' },
    { field: 'isPrepRecipe', header: 'Prep Recipe' },
    { field: 'edit', header: 'Edit' }
  ];
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {

  }

  getRecipes(locationId: number){
    this.recipeService.getRecipes(locationId).subscribe(recipes =>{
      //console.log(recipes);
      this.recipes = recipes;
      //this.recipes.push({id: 5, name: "test", ingredients: [], steps: [], notes: [], minutes: 5, isPrepRecipe: true, locationId: 1});
      this.recipes = [...recipes];
    }, error =>{});
  }



  editRecipe(recipe: Recipe){

  }

  viewRecipe(recipe: Recipe){
    this.RecipeSelected = true;
    this.loadRecipe(recipe.id);
  }

  loadRecipe(recipeId: number){
    this.recipeService.getRecipe(recipeId).subscribe(recipe =>{
      this.recipe = recipe;
    }, error =>{});
  }



}
