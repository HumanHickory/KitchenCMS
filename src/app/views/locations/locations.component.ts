import { Component, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { Address } from 'src/app/models/address';
import { Contact } from 'src/app/models/contact';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/locationService';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
  providers: [LocationService]
})
export class LocationsComponent {
  ShowLocationDialog: boolean = false;
  DialogHeader: string = "Add New Location";
  OrganizationId: number = 1;
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
    zip: 0,
  }
  dialogLocation: Location = {id: 0, name: "", storeNumber: null, organizationId: 1, isAdmin: false, contact: this.Contact, address: this.Address};
  public locations!: Observable<Location[]>;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

 public columnDefs: ColDef[] = [
  { field: 'id', headerName: 'Id'},
  { field: 'name', headerName: 'Name'},
  { field: 'storeNumber', headerName: 'Store #' },
  { field: 'address.addressLine1', headerName: 'Add. Line 1'},
  { field: 'address.city', headerName: 'City'},
  { field: 'address.state', headerName: 'State'},
  { field: 'contact.phone', headerName: 'Contact Phone'}

];

public defaultColDef: ColDef = {
  sortable: true,
  filter: true
};


constructor(private locationService: LocationService) {}

onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  this.locations = this.locationService.GetLocationsByOrganizationId(1, true);
  this.gridApi.sizeColumnsToFit();
}

onCellClicked( e: CellClickedEvent): void {
  console.log('cellClicked', e);
}

ToggleLocationDialog(){
this.ShowLocationDialog = true;
}

  SaveLocation(){
    this.dialogLocation.contact.phone = this.dialogLocation.contact.phone.replace(/\D/g, '');
    if(this.dialogLocation.id == 0){
      this.locationService.CreateLocation(this.dialogLocation).subscribe(
        location => {
          this.ShowLocationDialog = false;
          //refresh grid
              },
        error => { });
    }
  };
}


//TODO: Link existing contact
//TODO: Refresh grid
//TODO: Update, Delete