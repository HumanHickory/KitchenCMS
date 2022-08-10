import { Contact } from "./contact";
import { Business } from "./business";

export interface User {
    id: number;
    contactId: number;
    dateAdded: Date;
    isActive: boolean;
    organizationId: number;
    
    contact: Contact;
    buisnesses: Business[];
}