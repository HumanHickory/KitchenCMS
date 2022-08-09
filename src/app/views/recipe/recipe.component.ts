import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeService } from 'src/app/services/recipeService';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
  providers: [RecipeService] 
})
export class RecipeComponent implements OnInit {

  recipe: Recipe;
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }


}
