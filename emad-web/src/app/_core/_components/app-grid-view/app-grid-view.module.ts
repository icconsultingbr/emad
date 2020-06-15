import { NgModule } from "@angular/core";
import { AppGridViewComponent } from "./app-grid-view.component";
import { CommonModule } from '@angular/common';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { RouterModule } from "@angular/router";
import { FiltroAppGridView } from "./app-grid-view.pipes";
import { FormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PipeModule } from "../../_pipes/pipe.module";
import { CoreModule } from "../../core.module";


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgxMaskModule.forRoot({ dropSpecialCharacters: false }),
        NgMultiSelectDropDownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PipeModule,
        CoreModule
    ],
    declarations: [
        AppGridViewComponent,
        FiltroAppGridView
    ],
    exports: [
        AppGridViewComponent,
        FiltroAppGridView
    ]
})

export class AppGridViewModule { }


