import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectComponent } from "./app-select.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        SelectComponent
    ],
    exports: [
        SelectComponent
    ]
})

export class AppSelectModule { }