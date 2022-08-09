import { Allergen } from "./allergen";

export interface Ingredient {
      id: number;
      name: string;
      locationId: number;

      hasAllergens: boolean;

      allergens: Allergen[];
    }