import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { Organization } from "../models/organization";
import { Business } from "../models/business";

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    constructor(private http: HttpClient) {}

    GetBusinessByOrganizationId(organizationId: number, isActive: boolean){
        return this.http.get<Business[]>(environment.apiUrl() + "Location/GetLocationsByOrganizationId?OrganizationId=" + organizationId + "&isActive=" + isActive);
    }

    CreateBusiness(business: Business){
        return this.http.post<Business>(environment.apiUrl() + "Location/CreateLocation", business );
    }

}