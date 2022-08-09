import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { Organization } from "../models/organization";
import { Location } from "../models/location";

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) {}

    GetLocationsByOrganizationId(organizationId: number, isActive: boolean){
        return this.http.get<Location[]>(environment.apiUrl() + "Location/GetLocationsByOrganizationId?OrganizationId=" + organizationId + "&isActive=" + isActive);
    }

    CreateLocation(location: Location){
        return this.http.post<Location>(environment.apiUrl() + "Location/CreateLocation", location );
    }

}