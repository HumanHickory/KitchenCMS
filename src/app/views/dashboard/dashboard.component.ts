import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { Business } from 'src/app/models/business';
import { Recipe } from 'src/app/models/recipe';
import { LoginService } from 'src/app/services/loginService';
import { OrganizationService } from 'src/app/services/organizationService';
import { PeopleService } from 'src/app/services/peopleService';
import { RecipeService } from 'src/app/services/recipeService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [OrganizationService, PeopleService, RecipeService, LoginService]
})
export class DashboardComponent implements OnInit {

  businesses: Business[];
  selectedBusiness: Business;
  recipe: Recipe;
  recipes: Array<Recipe>;
  RecipeSelected: boolean = false;
  recipeCols = [
    { field: 'name', header: 'Name' },
    { field: 'minutes', header: 'Cook Time (min)' },
    { field: 'isPrepRecipe', header: 'Prep Recipe' },
    { field: 'view', header: 'View' }
  ];
  constructor(private appComponent: AppComponent, 
    private peopleService: PeopleService, 
    private recipeService: RecipeService,
    private messageService: MessageService,
    private loginService: LoginService,
    ) { }


  ngOnInit(): void {
    var userId = this.loginService.User.id;
    this.peopleService.GetUserBusinesses(userId, false).subscribe(
      business => {
        this.businesses = business;
        this.selectedBusiness= this.businesses[0];
        this.loginService.SetBusienssId(this.businesses[0].id);
        
        this.getRecipes(this.selectedBusiness.id);          
            },
      error => { });
  }

  getRecipes(businessId: number){
    this.recipeService.getRecipes(businessId).subscribe(recipes =>{
      this.recipes = recipes;
    }, error =>{});
  }

  viewRecipe(recipe: Recipe){
    this.RecipeSelected = true;
    this.loadRecipe(recipe.id);
  }

  loadRecipe(recipeId: number){
    this.recipeService.getRecipe(recipeId).subscribe(recipe =>{
      this.recipe = recipe;
    }, error =>{
      this.messageService.add({severity:'error', summary:'Fatal Error', detail:'Could not load recipe: ' + error.error.message});
    });

  }


}
