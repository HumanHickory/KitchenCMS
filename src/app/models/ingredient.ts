import { Allergen } from "./allergen";

export interface Ingredient {
      id: number;
      name: string;
      businessId: number;

      hasAllergens: boolean;

      allergens: Allergen[];
    }