import { Component, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { Address } from 'src/app/models/address';
import { Business } from 'src/app/models/business';
import { Contact } from 'src/app/models/contact';
import { User } from 'src/app/models/user';
import { BusinessService } from 'src/app/services/businessService';
import { PeopleService } from 'src/app/services/peopleService';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
  providers: [BusinessService, PeopleService]
})
export class BusinessComponent {
  ShowBusinessDialog: boolean = false;
  Editing: boolean = true;
  DialogHeader: string = "Add New Business";
  OrganizationId: number = 1;
  LookUpPhoneNumber: string = "";
  UsingNewContact: boolean = true;
  OrganizationUsers: User[] = [];
  SelectedUsers: User[] = [];
  ExistingContact = {
    lastName: "",
    firstName: "",
    phone: "",
    emailAddress: "",
    id: 0,
    title: ""
  }
  Contact: Contact = {
    lastName: "",
    firstName: "",
    phone: "",
    emailAddress: "",
    id: 0,
    title: ""
  }
  Address: Address = {
    id: 0,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: null,
  }
  dialogBusiness: Business = { id: 0, name: "", storeNumber: null, organizationId: 1, isAdmin: false, contact: this.Contact, address: this.Address };
  public businesss!: Observable<Business[]>;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Id' },
    { field: 'name', headerName: 'Name' },
    { field: 'storeNumber', headerName: 'Store #' },
    { field: 'address.addressLine1', headerName: 'Add. Line 1' },
    { field: 'address.city', headerName: 'City' },
    { field: 'address.state', headerName: 'State' },
    { field: 'contact.phone', headerName: 'Contact Phone' }

  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };


  constructor(private businessService: BusinessService, private peopleService: PeopleService) { }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.businesss = this.businessService.GetBusinessByOrganizationId(1, true);
    this.gridApi.sizeColumnsToFit();
  }

  onCellClicked(e: CellClickedEvent): void {
    this.ViewBusinessDetails(e.data);
  }

  ToggleBusinessDialog() {
    this.ShowBusinessDialog = true;
    this.Editing = true;
  }

  SaveBusiness() {
    if(!this.UsingNewContact){
      this.dialogBusiness.contact = this.ExistingContact;
    }
    this.dialogBusiness.contact.phone = this.dialogBusiness.contact.phone.replace(/\D/g, '');

    if (this.dialogBusiness.id == 0) {
      this.businessService.CreateBusiness(this.dialogBusiness).subscribe(
        business => {
          this.ShowBusinessDialog = false;
          this.businesss = this.businessService.GetBusinessByOrganizationId(1, true);
        },
        error => { });
    }
  };


  LookUpContact() {
    this.LookUpPhoneNumber = this.LookUpPhoneNumber.replace(/\D/g, '');
    this.peopleService.GetContactByPhoneNumber(this.LookUpPhoneNumber).subscribe(contact =>{
      this.UsingNewContact = false;
      this.ExistingContact = contact;
    });
  }

  RemoveExistingContact(){
    this.ExistingContact = {
      lastName: "",
      firstName: "",
      phone: "",
      emailAddress: "",
      id: 0,
      title: ""
    };
    this.UsingNewContact = true;
  }

  ViewBusinessDetails(selectedBusiness: Business){
    this.dialogBusiness = selectedBusiness;
    this.GetOrganizationUsers();
    this.ShowBusinessDialog = true;
    this.Editing = false;
  }

  GetOrganizationUsers(){
    this.peopleService.GetUsersByOrganization(this.OrganizationId).subscribe(users => {
      this.OrganizationUsers = users;
    });
  }

  ManageUserBusinesss(){
    this.OrganizationUsers.forEach(user => {
      user.buisnesses.forEach(business => { business.id == this.dialogBusiness.id});
    });

  

  }


}

//TODO: Update, Delete