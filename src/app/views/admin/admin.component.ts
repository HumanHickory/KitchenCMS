import { Component, Injectable, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
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
  allergens: Allergen[];
  selectedAllergens: Allergen[];
  measurements: Measurement[];
  recipeIngredients: RecipeIngredient[] = [];
  allIngredients: Ingredient[] = []; //used for add recipe dialog

  recipe: Recipe;
  selectedLocation: Location;
  newIngredientDialog: boolean = false;
  recipeDialog: boolean = false;
  RecipeSelected: boolean = false;

  newIngredient: Ingredient = { id: 0, name: "", locationId: 0, hasAllergens: false, allergens: [] };
  dialogRecipe: Recipe = { id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, locationId: 0 }
  addOrUpdateText: string = "Add Recipe";



  public ingredients!: Observable<Ingredient[]>;
  private ingredientGridApi!: GridApi;
  private ingredientGridColumnApi!: ColumnApi;

  public recipes!: Observable<Recipe[]>;
  private recipeGridApi!: GridApi;
  private recipeGridColumnApi!: ColumnApi;

  public ingredientColDef: ColDef[] = [
    { field: 'id', headerName: 'Id' },
    { field: 'name', headerName: 'Name' }
  ];

  public recipeColDef: ColDef[] = [
    { field: 'id', headerName: 'Id' },
    { field: 'name', headerName: 'Name' }
  ];


  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };


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
        this.recipesComp.getRecipes(this.selectedLocation.id);
        this.ingredients = this.recipeService.getIngredients(this.selectedLocation.id);
        this.recipes = this.recipeService.getRecipes(this.selectedLocation.id);
      },
      error => { });
  }

  onIngredientGridReady(params: GridReadyEvent) {
    this.ingredientGridApi = params.api;
    this.ingredientGridColumnApi = params.columnApi;
    this.ingredientGridApi.sizeColumnsToFit();
  }

  onRecipeGridReady(params: GridReadyEvent) {
    this.recipeGridApi = params.api;
    this.recipeGridColumnApi = params.columnApi;
    this.recipeGridApi.sizeColumnsToFit();
  }

  OnIngredientCellClicked(e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }  
  
  OnRecipeCellClicked(e: CellClickedEvent): void {
    this.ViewRecipe(e.data);
  }

  ShowIngredientDialog() {
    this.ListAllergens();
    this.newIngredientDialog = true;
  }

  ShowRecipeDialog() {
    this.recipeDialog = true;
    this.dialogRecipe.ingredients = [];
    this.dialogRecipe.steps = [];
    this.dialogRecipe.notes = [];
    this.dialogRecipe.isPrepRecipe = false;
    this.dialogRecipe.minutes = 0;
    this.dialogRecipe.name = "";
    this.dialogRecipe.id = 0;
    this.dialogRecipe.locationId = this.selectedLocation.id;
    this.addOrUpdateText = "Add Recipe";
    this.recipeService.getIngredients(this.selectedLocation.id).subscribe(ingredients => {
      this.allIngredients = ingredients;
    });

    this.ListMeasurements();
    var newIngredient: RecipeIngredient = { id: 0, recipeId: 0, ingredientId: 0, measurementId: 0, measurementAmount: 0, measurement: null, ingredient: null, recipe: null };
    var newStep: RecipeStep = { id: 0, recipeId: 0, description: "", stepOrder: 1 };
    this.dialogRecipe.ingredients.push(newIngredient);
    this.dialogRecipe.steps.push(newStep);

  }

  SaveRecipe(recipeId: number) {
    if (recipeId == 0)
      this.CreateRecipe();
    else
      this.UpdateRecipe();

    this.recipes = this.recipeService.getRecipes(this.selectedLocation.id);
  }

  CreateIngredient() {
    this.newIngredient.allergens = this.selectedAllergens;
    this.newIngredient.locationId = this.selectedLocation.id;
    this.recipeService.createIngredient(this.newIngredient).subscribe(allergens => {
      this.newIngredientDialog = false;
      this.ingredients = this.recipeService.getIngredients(this.locations[0].id);
      this.messageService.add({ severity: 'success', summary: 'Added Ingredient', detail: 'New ingredient added successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Ingredient Not Added', detail: 'Failed to add new ingredient. Error: ' + error.error.message });
    });
  }

  UpdateRecipe() {
    this.recipeService.updateRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Added Recipe', detail: 'New recipe added successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Recipe Not Added', detail: 'Failed to add new Recipe. Error: ' + error.error.message });
    });
  }

  CreateRecipe() {
    this.recipeService.createRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = false;
      this.dialogRecipe = { id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, locationId: 0 };
      this.messageService.add({ severity: 'success', summary: 'Added Recipe', detail: 'New recipe added successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Recipe Not Added', detail: 'Failed to add new Recipe. Error: ' + error.error.message });
    });

  }

  EditRecipe(recipe: Recipe){
    this.addOrUpdateText = "Update Recipe";
    this.recipeDialog = true;
    this.recipeService.getIngredients(this.selectedLocation.id).subscribe(ingredients => {
      this.allIngredients = ingredients;
    });
    this.ListMeasurements();

    this.LoadRecipe(recipe.id);
  }

  LoadRecipe(recipeId: number){
    this.recipeService.getRecipe(recipeId).subscribe(recipe =>{
      this.recipe = recipe;
    }, error =>{
      this.messageService.add({severity:'error', summary:'Fatal Error', detail:'Could not load recipe: ' + error.error.message});
    });

  }

  ViewRecipe(recipe: Recipe){
    this.LoadRecipe(recipe.id);
    this.RecipeSelected = true;

  }

  ChangeLocation() {
    this.ingredients = this.recipeService.getIngredients(this.selectedLocation.id);
    this.recipes = this.recipeService.getRecipes(this.selectedLocation.id);
  }

  ListAllergens() {
    this.recipeService.listAllergens().subscribe(allergens => {
      this.allergens = allergens;
    }, error => { });
  }

  ListMeasurements() {
    this.recipeService.listMeasurements().subscribe(measurements => {
      this.measurements = measurements;
    }, error => { });
  }

  AddNewRecipeIngredient() {
    var newIngredient: RecipeIngredient = { id: 0, recipeId: 0, ingredientId: 0, measurementId: 0, measurementAmount: 0, measurement: null, ingredient: null, recipe: null }
    this.dialogRecipe.ingredients.push(newIngredient);
  }

  AddNewRecipeStep() {
    var stepOrder = this.dialogRecipe.steps.length + 1;
    var newStep: RecipeStep = { id: 0, recipeId: 0, description: "", stepOrder: stepOrder };
    this.dialogRecipe.steps.push(newStep);
  }
  AddNewRecipeNotes() {
    var noteOrder = this.dialogRecipe.notes.length + 1;
    var newNote: RecipeNote = { id: 0, recipeId: 0, description: "", noteOrder: noteOrder };
    this.dialogRecipe.notes.push(newNote);
  }

  RemoveIngredientFromRecipe(ingredient: any) {
    this.dialogRecipe.ingredients = this.dialogRecipe.ingredients.filter(x => x.ingredientId != ingredient.ingredientId); // delete row
  }

  RemoveStepFromRecipe(step: any) {
    this.dialogRecipe.steps = this.dialogRecipe.steps.filter(x => x.description != step.description); // delete row
    //TODO: Iterate through remaining steps to see if StepOrder is correct. For example, if we delete step 2, step 3 should become step 2
  }

  RemoveNoteFromRecipe(note: any) {
    this.dialogRecipe.notes = this.dialogRecipe.notes.filter(x => x.description != note.description); // delete row
        //TODO: Iterate through remaining steps to see if StepOrder is correct. For example, if we delete step 2, step 3 should become step 2

  }


}

