import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsManagerComponent } from './views/cms-manager/cms-manager.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { BusinessComponent } from './views/business/business.component';
import { LoginComponent } from './views/login/login.component';
import { RecipesComponent } from './views/recipes/recipes.component';
import { UsersComponent } from './views/users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cmsManager', component: CmsManagerComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'businesses', component: BusinessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
