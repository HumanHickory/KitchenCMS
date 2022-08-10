import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessageService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PasswordModule} from 'primeng/password';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipesComponent } from './views/recipes/recipes.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';
import { CmsManagerComponent } from './views/cms-manager/cms-manager.component';
import { UsersComponent } from './views/users/users.component';
import { LocationsComponent } from './views/locations/locations.component';




@NgModule({
  declarations: [
    AppComponent,
    RecipesComponent,
    DashboardComponent,
    LoginComponent,
    CmsManagerComponent,
    UsersComponent,
    LocationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgGridModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    CheckboxModule,
    InputNumberModule,
    InputTextareaModule,
    PasswordModule
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
