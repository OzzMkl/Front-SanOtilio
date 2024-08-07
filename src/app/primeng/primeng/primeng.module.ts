import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import {FieldsetModule} from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpeedDialModule } from 'primeng/speeddial';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ChartModule } from 'primeng/chart';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';


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
    SelectButtonModule,
    FieldsetModule,
    ToastModule,
    InputSwitchModule,
    TableModule,
    ConfirmDialogModule,
    SpeedDialModule,
    ProgressSpinnerModule,
    DialogModule,
    CheckboxModule,
    PaginatorModule,
    OverlayPanelModule,
    RadioButtonModule,
    ChartModule,
    ContextMenuModule,
    BreadcrumbModule,
  ],
  imports: [
    CommonModule,
  ],
  providers: [MessageService],
})
export class PrimengModule { }
