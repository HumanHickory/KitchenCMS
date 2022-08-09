import { Component, Injectable, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Contact } from 'src/app/models/contact';
import { Organization } from 'src/app/models/organization';
import { OrganizationService } from 'src/app/services/organizationService';
import { PeopleService } from 'src/app/services/peopleService';

@Component({
  selector: 'app-cms-manager',
  templateUrl: './cms-manager.component.html',
  styleUrls: ['./cms-manager.component.css'],
  providers: [OrganizationService, PeopleService]
})
export class CmsManagerComponent implements OnInit {


  constructor(
    private organizationService: OrganizationService,
    private peopleService: PeopleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }
  ShowOrganization: boolean = true;

  Contact: Contact = {
    lastName: "",
    firstName: "",
    phone: "",
    emailAddress: "",
    id: 0,
    title: ""
  }
  Organization: Organization = { name: "", id: 0, contact: this.Contact }


  ngOnInit(): void { }

  CheckIfOrganizationExists() {
    var alreadyExists = this.organizationService.CheckIfOrganizationNameExists(this.Organization.name).subscribe(
      result => {
        if (result) {
          this.confirmationService.confirm({
            message: 'There is already an organization with the name "' + this.Organization.name + '". Would you like to add a new record?',
            accept: () => {
              this.CheckIfContactExists();
            },
            key: "organizationDialog"
          });
        } else {
          this.CheckIfContactExists();
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to Check Organization' });
      });
  }

  CheckIfContactExists() {
    this.peopleService.CheckIfContactExists(this.Organization.contact).subscribe(
      existingContact => {
        if (existingContact.emailAddress != null) {
          this.confirmationService.confirm({
            message: 'There is already a contact with this email address and/or phone number. Would you like to link this existing record? Note: Selecting "No" will create a new record.',
            accept: () => {
              this.Organization.contact = existingContact;
              this.CreateNewOrganization();
            },
            reject: () => {
              this.CreateNewContactAndOrganization();
            },
            key: "contactDialog"
          });
        } else {
          this.CreateNewContactAndOrganization();
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to check existing contacts' });
      });
  }

  CreateNewContactAndOrganization() {
    this.Organization.contact.phone = this.Organization.contact.phone.replace(/\D/g, '');
    this.peopleService.CreateContact(this.Organization.contact).subscribe(
      newContact => {
        this.Organization.contact = newContact;
        this.CreateNewOrganization();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to add new contact' });
      }
    );
  }

  CreateNewOrganization() {
    this.organizationService.CreateOrganization(this.Organization).subscribe(
      result => {
        this.messageService.add({ severity: 'success', summary: 'Organization Created', detail: 'Organization Created' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to add new organization' });
      }
    );

  }

}
