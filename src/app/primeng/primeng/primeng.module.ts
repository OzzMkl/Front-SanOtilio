import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel'
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';



@NgModule({
  declarations: [],
  exports:[
    InputTextModule,
    PanelModule,
    AccordionModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    MenubarModule,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ]
})
export class PrimengModule { }
