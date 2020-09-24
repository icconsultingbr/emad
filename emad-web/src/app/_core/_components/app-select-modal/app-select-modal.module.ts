import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectModalComponent } from "./app-select-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        SelectModalComponent
    ],
    exports: [
        SelectModalComponent
    ]
})

export class AppSelectModalModule { }