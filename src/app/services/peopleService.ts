import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { Organization } from "../models/organization";
import { environment } from "src/environments/environment";
import { Contact } from "../models/contact";
import { User } from '../models/user';
import { Business } from "../models/business";

@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    constructor(private http: HttpClient) {}

    CreateContact(contact: Contact){
        return this.http.post<Contact>(environment.apiUrl() + "People/CreateContact", contact);       
    }

    GetUserBusinesses(userId: number, adminOnly: boolean){
        return this.http.get<Business[]>(environment.apiUrl() + "People/GetUserLocations?userId=" + userId + "&adminOnly=" + adminOnly);       
    }


    CheckIfContactExists(contact: Contact){
        const params = new HttpParams()
        .set('phone', contact.phone.replace(/\D/g,''))
        .set('emailAddress', contact.emailAddress);

        return this.http.get<Contact>(environment.apiUrl() + "People/CheckIfContactExists", {params});       
    }

    GetUsersByBusiness(businessId: number){
        return this.http.get<User[]>(environment.apiUrl() + "People/GetUsersByLocation?locationId=" + businessId);
    }

    GetContactByPhoneNumber(phone: string){
        return this.http.get<Contact>(environment.apiUrl() + "People/GetContactByPhoneNumber?phoneNumber=" + phone);
    }

    GetUsersByOrganization(organizationId: number){
        return this.http.get<User[]>(environment.apiUrl() + "People/GetUsersByOrganization?organizationId=" + organizationId);

    }


    
}