import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredient';
import { RecipeService } from 'src/app/services/recipeService';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
  providers: [RecipeService, AdminComponent]
})
export class IngredientsComponent implements OnInit {

  ingredients: Ingredient[];


  constructor(private recipeService: RecipeService, private adminComponent: AdminComponent) { }

  ngOnInit(): void {
  }

  
}
