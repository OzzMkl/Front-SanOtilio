import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel'
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule} from 'primeng/ripple';
import { TooltipModule} from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FileUploadModule } from 'primeng/fileupload';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {SelectButtonModule} from 'primeng/selectbutton';



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
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    FileUploadModule,
    ToggleButtonModule,
    SelectButtonModule
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ]
})
export class PrimengModule { }
