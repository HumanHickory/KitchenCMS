import { Address } from "./address";
import { Contact } from "./contact";

export interface Location {
    id: number;
    name: string;
    storeNumber: number;
    organizationId: number;

    isAdmin: boolean
    contact: Contact;
    address: Address;
  }