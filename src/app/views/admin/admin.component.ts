import { Component, Injectable, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { Allergen } from 'src/app/models/allergen';
import { Ingredient } from 'src/app/models/ingredient';
import { Location } from 'src/app/models/location';
import { Measurement } from 'src/app/models/measurement';
import { Recipe } from 'src/app/models/recipe';
import { RecipeIngredient } from 'src/app/models/recipeIngredient';
import { RecipeNote } from 'src/app/models/recipeNote';
import { RecipeStep } from 'src/app/models/recipeStep';
import { LoginService } from 'src/app/services/loginService';
import { OrganizationService } from 'src/app/services/organizationService';
import { PeopleService } from 'src/app/services/peopleService';
import { RecipeService } from 'src/app/services/recipeService';
import { RecipesComponent } from '../recipes/recipes.component';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [OrganizationService, PeopleService, RecipeService, RecipesComponent, LoginService]

})
export class AdminComponent implements OnInit {

  locations: Location[];
  selectedLocation: Location;

  ingredients: Ingredient[];
  allergens: Allergen[];
  measurements: Measurement[];
  selectedAllergens: Allergen[];

  newIngredientDialog: boolean = false;
  recipeDialog: boolean = false;
  newIngredient: Ingredient = { id: 0, name: "", locationId: 0, hasAllergens: false, allergens: [] };
  dialogRecipe: Recipe = {id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, locationId: 0}

  RecipeIngredients: RecipeIngredient[] = [];
  AddOrUpdateText: string = "Add Recipe";

  recipe: Recipe;
  recipes: Array<Recipe>;
  RecipeSelected: boolean = false;
  ingredientCols = [
    { field: 'name', header: 'Name' },
    { field: 'hasAllergens', header: 'Contains Allergens' }

  ];

  recipeCols = [
    { field: 'name', header: 'Name' },
    { field: 'minutes', header: 'Cook Time (min)' },
    { field: 'isPrepRecipe', header: 'Prep Recipe' },
    { field: 'edit', header: 'Edit' }
  ];

  constructor(private appComponent: AppComponent, 
    private peopleService: PeopleService, 
    private recipeService: RecipeService,
    private messageService: MessageService,
    private recipesComp: RecipesComponent,
    private loginService: LoginService) { }
  ngOnInit(): void {
    this.peopleService.GetUserLocations(this.loginService.User.id, true).subscribe(
      locations => {
        this.locations = locations;
        this.selectedLocation = this.locations[0];
        this.getIngredients(this.selectedLocation.id);
        this.getRecipes(this.selectedLocation.id);    
        this.recipesComp.getRecipes(this.selectedLocation.id);      
            },
      error => { });
  }

  changeLocation() {
    this.getIngredients(this.selectedLocation.id);
    this.getRecipes(this.selectedLocation.id)
  }

  getIngredients(locationId: number) {
    this.recipeService.getIngredients(locationId).subscribe(ingredients => {
      this.ingredients = ingredients;
      this.ingredients.forEach(function (ingredient) {
        if (ingredient.allergens.length > 0)
          ingredient.hasAllergens = true;
        else
          ingredient.hasAllergens = false;
      });
    }, error => { });
  }

  listAllergens() {
    this.recipeService.listAllergens().subscribe(allergens => {
      this.allergens = allergens;
    }, error => { });
  }

  listMeasurements() {
    this.recipeService.listMeasurements().subscribe(measurements => {
      this.measurements = measurements;
    }, error => { });
  }

  ShowIngredientDialog() {
    this.listAllergens();
    this.newIngredientDialog = true;
  }

  ShowRecipeDialog(){
    this.recipeDialog = true;
    this.dialogRecipe.ingredients = [];
    this.dialogRecipe.steps = [];
    this.dialogRecipe.notes = [];
    this.dialogRecipe.isPrepRecipe = false;
    this.dialogRecipe.minutes = 0;
    this.dialogRecipe.name = "";
    this.dialogRecipe.locationId = this.selectedLocation.id;
    this.AddOrUpdateText = "Add Recipe";

    this.listMeasurements();
    var newIngredient: RecipeIngredient = {id: 0, recipeId: 0, ingredientId: 0, measurementId: 0, measurementAmount: 0, measurement: null, ingredient: null, recipe: null};
    var newStep: RecipeStep = {id: 0, recipeId: 0, description: "", stepOrder: 1};
    this.dialogRecipe.ingredients.push(newIngredient);
    this.dialogRecipe.steps.push(newStep);

  }

  CreateIngredient() {
    this.newIngredient.allergens = this.selectedAllergens;
    this.newIngredient.locationId = this.selectedLocation.id;
    this.recipeService.createIngredient(this.newIngredient).subscribe(allergens => {
      this.newIngredientDialog = false;
      this.messageService.add({severity:'success', summary:'Added Ingredient', detail:'New ingredient added successfully.'});
      this.ingredients = [...this.ingredients, this.newIngredient];
    }, error => {       
      this.messageService.add({severity:'error', summary:'Ingredient Not Added', detail:'Failed to add new ingredient. Error: ' + error.error.message});
  });

    
  }

  SaveRecipe(recipeId: number){
    if(recipeId == 0)
      this.CreateRecipe();
    else 
      this.UpdateRecipe();
  }

  CreateRecipe(){ 
    this.recipeService.createRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = true;
      this.dialogRecipe = {id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, locationId: 0};
      this.messageService.add({severity:'success', summary:'Added Recipe', detail:'New recipe added successfully.'});
    }, error => {       
      this.messageService.add({severity:'error', summary:'Recipe Not Added', detail:'Failed to add new Recipe. Error: ' + error.error.message});
  });

  }

  getRecipes(locationId: number){
    this.recipeService.getRecipes(locationId).subscribe(recipes =>{
      this.recipes = recipes;
      this.recipesComp.recipes = recipes;
    }, error =>{});
  }

  editRecipe(recipe: Recipe){
    this.AddOrUpdateText = "Update Recipe";
    this.recipeDialog = true;
    this.listMeasurements();

    this.loadRecipe(recipe.id);
  }

  UpdateRecipe(){
    this.recipeService.updateRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = true;
      this.messageService.add({severity:'success', summary:'Added Recipe', detail:'New recipe added successfully.'});
    }, error => {       
      this.messageService.add({severity:'error', summary:'Recipe Not Added', detail:'Failed to add new Recipe. Error: ' + error.error.message});
  });
  }

  viewRecipe(recipe: Recipe){
    this.RecipeSelected = true;
    this.loadRecipe(recipe.id);
  }

  loadRecipe(recipeId: number){
    this.recipeService.getRecipe(recipeId).subscribe(recipe =>{
      this.recipe = recipe;
      this.dialogRecipe = recipe;
    }, error =>{
      this.messageService.add({severity:'error', summary:'Fatal Error', detail:'Could not load recipe: ' + error.error.message});
    });

  }

  AddNewRecipeIngredient(){
    var newIngredient: RecipeIngredient = {id: 0, recipeId: 0, ingredientId: 0, measurementId: 0, measurementAmount: 0, measurement: null, ingredient: null, recipe: null}
    this.dialogRecipe.ingredients.push(newIngredient);  
  }

  AddNewRecipeStep(){
    var stepOrder = this.dialogRecipe.steps.length + 1;
    var newStep: RecipeStep = {id: 0, recipeId: 0, description: "", stepOrder: stepOrder};
    this.dialogRecipe.steps.push(newStep);
  }
  AddNewRecipeNotes(){
    var noteOrder = this.dialogRecipe.notes.length + 1;
    var newNote: RecipeNote = {id: 0, recipeId: 0, description: "", noteOrder: noteOrder};
    this.dialogRecipe.notes.push(newNote);
  }

  removeIngredientFromRecipe(ingredient: any){
    this.dialogRecipe.ingredients = this.dialogRecipe.ingredients.filter( x => x.id != ingredient.id ); // delete row
  }

  removeStepFromRecipe(step: any){
    this.dialogRecipe.steps = this.dialogRecipe.steps.filter( x => x.id != step.id ); // delete row
  }
  
  removeNoteFromRecipe(note: any){
    this.dialogRecipe.notes = this.dialogRecipe.notes.filter( x => x.id != note.id ); // delete row
  }


}

