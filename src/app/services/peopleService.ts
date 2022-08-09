import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { Organization } from "../models/organization";
import { environment } from "src/environments/environment";
import { Contact } from "../models/contact";
import { Location } from "../models/location";
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    constructor(private http: HttpClient) {}

    CreateContact(contact: Contact){
        return this.http.post<Contact>(environment.apiUrl() + "People/CreateContact", contact);       
    }

    GetUserLocations(userId: number, adminOnly: boolean){
        return this.http.get<Location[]>(environment.apiUrl() + "People/GetUserLocations?userId=" + userId + "&adminOnly=" + adminOnly);       
    }


    CheckIfContactExists(contact: Contact){
        const params = new HttpParams()
        .set('phone', contact.phone.replace(/\D/g,''))
        .set('emailAddress', contact.emailAddress);

        return this.http.get<Contact>(environment.apiUrl() + "People/CheckIfContactExists", {params});       
    }

    GetUsersByLocation(locationId: number){
        return this.http.get<User[]>(environment.apiUrl() + "People/GetUsersByLocation?locationId=" + locationId);
    }



    
}