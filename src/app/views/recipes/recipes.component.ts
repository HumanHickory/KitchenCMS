import { Component, Injectable, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Allergen } from 'src/app/models/allergen';
import { Ingredient } from 'src/app/models/ingredient';
import { Business } from 'src/app/models/business';
import { Measurement } from 'src/app/models/measurement';
import { Recipe } from 'src/app/models/recipe';
import { RecipeIngredient } from 'src/app/models/recipeIngredient';
import { RecipeNote } from 'src/app/models/recipeNote';
import { RecipeStep } from 'src/app/models/recipeStep';
import { LoginService } from 'src/app/services/loginService';
import { OrganizationService } from 'src/app/services/organizationService';
import { PeopleService } from 'src/app/services/peopleService';
import { RecipeService } from 'src/app/services/recipeService';
import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [OrganizationService, PeopleService, RecipeService, LoginService]

})
export class RecipesComponent implements OnInit {
  businesses: Business[];
  allergens: Allergen[];
  selectedAllergens: Allergen[];
  measurements: Measurement[];
  recipeIngredients: RecipeIngredient[] = [];
  allIngredients: Ingredient[] = []; //used for add recipe dialog

  viewRecipe: Recipe;
  selectedBusiness: Business;
  ingredientDialog: boolean = false;
  recipeDialog: boolean = false;
  RecipeSelected: boolean = false;

  dialogIngredient: Ingredient = { id: 0, name: "", businessId: 0, hasAllergens: false, allergens: [] };
  dialogRecipe: Recipe = { id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, businessId: 0 }
  addOrUpdateText: string = "Add Recipe";

  api: any;
  frameworkComponents: any;

  public ingredients!: Observable<Ingredient[]>;
  private ingredientGridApi!: GridApi;
  private ingredientGridColumnApi!: ColumnApi;

  public recipes!: Observable<Recipe[]>;
  private recipeGridApi!: GridApi;
  private recipeGridColumnApi!: ColumnApi;

  public ingredientColDef: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    {
      headerName: 'Edit',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.EditIngredient.bind(this),
        icon: '<i class="pi pi-pencil"></i>',
        buttonColor: 'success'
      }
    },
    {
      headerName: 'Delete',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.DeleteIngredient.bind(this),
        icon: '<i class="pi pi-times"></i>',
        buttonColor: 'danger'
      }
    },
  ];



  public recipeColDef: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    {
      headerName: 'Edit',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.EditRecipe.bind(this),
        icon: '<i class="pi pi-pencil"></i>',
        buttonColor: 'success'
      }
    },
    {
      headerName: 'Delete',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.DeleteRecipe.bind(this),
        icon: '<i class="pi pi-times"></i>',
        buttonColor: 'danger'
      }
    },
  ];


  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };


  constructor(private appComponent: AppComponent,
    private peopleService: PeopleService,
    private recipeService: RecipeService,
    private messageService: MessageService,
    private loginService: LoginService) {

    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit(): void {
    this.peopleService.GetUserBusinesses(this.loginService.User.id, true).subscribe(
      businesss => {
        this.businesses = businesss;
        this.selectedBusiness = this.businesses[0];
        this.ingredients = this.recipeService.getIngredients(this.selectedBusiness.id);
        this.recipes = this.recipeService.getRecipes(this.selectedBusiness.id);
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
    this.ingredientDialog = true;
    this.addOrUpdateText = "Add Ingredient";
  }

  ShowRecipeDialog(recipeId: number) {
    this.ListMeasurements();
    this.recipeService.getIngredients(this.selectedBusiness.id).subscribe(ingredients => {
      this.allIngredients = ingredients;
    });
    this.dialogRecipe.businessId = this.selectedBusiness.id;

    if(recipeId == 0){
    this.dialogRecipe.ingredients = [];
    this.dialogRecipe.steps = [];
    this.dialogRecipe.notes = [];
    this.dialogRecipe.isPrepRecipe = false;
    this.dialogRecipe.minutes = 0;
    this.dialogRecipe.name = "";
    this.dialogRecipe.id = 0;
    this.addOrUpdateText = "Add Recipe";

    var newIngredient: RecipeIngredient = { id: 0, recipeId: 0, ingredientId: 0, measurementId: 0, measurementAmount: 0, measurement: null, ingredient: null, recipe: null };
    var newStep: RecipeStep = { id: 0, recipeId: 0, description: "", stepOrder: 1 };
    this.dialogRecipe.ingredients.push(newIngredient);
    this.dialogRecipe.steps.push(newStep);

  } else {
    this.recipeService.getRecipe(recipeId).subscribe(recipe => {
      this.dialogRecipe = recipe;     
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Fatal Error', detail: 'Could not load recipe: ' + error.error.message });
    });
  }

  this.recipeDialog = true;

  }



  SaveRecipe(recipeId: number) {
    if (recipeId == 0)
      this.CreateRecipe();
    else
      this.UpdateRecipe();

    this.recipes = this.recipeService.getRecipes(this.selectedBusiness.id);
  }

  CreateIngredient() {
    this.dialogIngredient.allergens = this.selectedAllergens;
    this.dialogIngredient.businessId = this.selectedBusiness.id;
    this.recipeService.createIngredient(this.dialogIngredient).subscribe(allergens => {
      this.ingredientDialog = false;
      this.ingredients = this.recipeService.getIngredients(this.selectedBusiness.id);
      this.messageService.add({ severity: 'success', summary: 'Added Ingredient', detail: 'New ingredient added successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Ingredient Not Added', detail: 'Failed to add new ingredient. Error: ' + error.error.message });
    });
  }

  UpdateRecipe() {
    this.recipeService.updateRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Updated Recipe', detail: 'Recipe Updated Successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Recipe Not Updated', detail: 'Failed to Update Recipe. Error: ' + error.error.message });
    });
  }

  CreateRecipe() {
    this.recipeService.createRecipe(this.dialogRecipe).subscribe(data => {
      this.recipeDialog = false;
      this.dialogRecipe = { id: 0, name: "", ingredients: [], steps: [], notes: [], minutes: 0, isPrepRecipe: false, businessId: 0 };
      this.messageService.add({ severity: 'success', summary: 'Added Recipe', detail: 'New recipe added successfully.' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Recipe Not Added', detail: 'Failed to add new Recipe. Error: ' + error.error.message });
    });

  }

  EditRecipe(e: any) {
    this.addOrUpdateText = "Update Recipe";
    this.ShowRecipeDialog(e.data.id);
  }

  EditIngredient(e: any) {
    this.ShowIngredientDialog();
    this.dialogIngredient = e.data;
    this.selectedAllergens = this.dialogIngredient.allergens;
    this.addOrUpdateText = "Update Ingredient";

  }

  LoadRecipe(recipeId: number) {
    this.recipeService.getRecipe(recipeId).subscribe(recipe => {
      this.viewRecipe = recipe;     
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Fatal Error', detail: 'Could not load recipe: ' + error.error.message });
    });
  }

  ViewRecipe(recipe: Recipe) {
    this.LoadRecipe(recipe.id);
    this.RecipeSelected = true;

  }

  DeleteIngredient(ingredientId: number){

  }

  DeleteRecipe(recipeId: number){

  }

  ChangeBusiness() {
    this.ingredients = this.recipeService.getIngredients(this.selectedBusiness.id);
    this.recipes = this.recipeService.getRecipes(this.selectedBusiness.id);
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

