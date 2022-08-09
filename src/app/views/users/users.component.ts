import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { Location } from 'src/app/models/location';
import { Contact } from 'src/app/models/contact';
import { PeopleService } from 'src/app/services/peopleService';
import { RecipeService } from 'src/app/services/recipeService';
import { LoginService } from 'src/app/services/loginService';

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

  constructor(private appComponent: AppComponent, 
    private peopleService: PeopleService, 
    private recipeService: RecipeService,
    private loginService: LoginService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    var userId = this.loginService.User.id;
    this.peopleService.GetUserLocations(userId, true).subscribe(
      locations => {
        this.locations = locations;
        this.selectedLocation = this.locations[0];
            },
      error => { });
  }
  
  ShowUserDialog(){
    this.userDialog = true;

  }
  
  SaveUser(){
    //TODO: call a service to add the user
  }


}
