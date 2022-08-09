import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './views/admin/admin.component';
import { CmsManagerComponent } from './views/cms-manager/cms-manager.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LocationsComponent } from './views/locations/locations.component';
import { LoginComponent } from './views/login/login.component';
import { RecipeComponent } from './views/recipe/recipe.component';
import { UsersComponent } from './views/users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'cmsManager', component: CmsManagerComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'locations', component: LocationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
