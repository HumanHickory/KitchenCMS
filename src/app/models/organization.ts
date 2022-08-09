import { Contact } from "./contact";

export interface Organization {
    id: number;
    name: string;

    contact: Contact;
}