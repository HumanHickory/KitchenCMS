import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { Location } from 'src/app/models/location';
import { Contact } from 'src/app/models/contact';
import { PeopleService } from 'src/app/services/peopleService';
import { RecipeService } from 'src/app/services/recipeService';
import { LoginService } from 'src/app/services/loginService';
import { User } from 'src/app/models/user';
import {InputMaskModule} from 'primeng/inputmask';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [PeopleService, RecipeService, LoginService]

})
export class UsersComponent implements OnInit {
  locations: Location[];
  selectedLocation: Location;
  userDialog: boolean = false;
  dialogContact: Contact = {id:0, firstName:"", lastName:"",emailAddress:"",phone:"",title:""};
  users!: Observable<User[]>;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  constructor(private appComponent: AppComponent, 
    private peopleService: PeopleService, 
    private recipeService: RecipeService,
    private loginService: LoginService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    var userId = this.loginService.User.id;
    this.peopleService.GetUserLocations(userId, false).subscribe(result =>{this.locations = result});
    }
  
  ShowUserDialog(){
    this.userDialog = true;

  }
  
  SaveUser(){
    //TODO: call a service to add the user
  }
  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Id'},
    { field: 'contact.firstName', headerName: 'First Name'},
    { field: 'contact.lastName', headerName: 'Last Name'},
    { field: 'contact.emailAddress', headerName: 'Email Address'},
    { field: 'contact.phone', headerName: 'Phone #'},
      
  ];
  
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.users = this.peopleService.GetUsersByLocation(1);
    this.gridApi.sizeColumnsToFit();
  }
  
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }
  

}


