import { Contact } from "./contact";

export interface User {
    id: number;
    contactId: number;
    dateAdded: Date;
    isActive: boolean;
    organizationId: number;
    
    contact: Contact;
    locations: Location[];
}