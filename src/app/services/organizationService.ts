import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { Organization } from "../models/organization";

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private http: HttpClient) {}

    CheckIfOrganizationNameExists(organizationName: string){
        return this.http.get<boolean>(environment.apiUrl() + "Organization/CheckIfOrganizationNameExists?organizationName=" + organizationName);
       
    }

    CreateOrganization(organization: Organization){
        return this.http.post<Organization>(environment.apiUrl() + "Organization/CreateOrganization", organization );
  
    }

    ListOrganizations(){
        return this.http.get<Organization>(environment.apiUrl() + "Organization/ListOrganization");
    }


    
}