import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { Organization } from "../models/organization";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private http: HttpClient) {}

    User: User = {id: 1, contactId: 1, isActive: true, dateAdded: null, contact: null, locations: null, organizationId: null};
    LocationId: number = 0;

    Login(){
        this.User = {id: 1, contactId: 1, isActive: true, dateAdded: null, contact: null, locations: null, organizationId: 1};
    }

    SetLocationId(id: number){
        this.LocationId = id;
    }
}