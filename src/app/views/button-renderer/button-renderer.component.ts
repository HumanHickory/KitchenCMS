// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
  <button class="btn btn-icon-{{buttonColor}} btn-sm" type="button" (click)="onClick($event)"  [innerHtml]="icon">{{label}}</button>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params: any;
  label: string;
  buttonColor: string;
  icon: string;

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || 'null';
    this.icon = this.params.icon || this.label;
    this.buttonColor = this.params.buttonColor || "primary";
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(this.params);

    }
  }
}