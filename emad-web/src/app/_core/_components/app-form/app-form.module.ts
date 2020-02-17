import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AppFormComponent } from "./app-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskModule } from "ngx-mask";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
    imports: [
        CommonModule, 
        ReactiveFormsModule, 
        RouterModule, 
        NgxMaskModule.forRoot({dropSpecialCharacters:false}),
        CurrencyMaskModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.none ,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '4px',
            primaryColour: '#FDBA31',
            secondaryColour: '#FDBA31',
            tertiaryColour: '#ffffff'
        }),
        NgMultiSelectDropDownModule.forRoot(),
    ],
    declarations : [AppFormComponent],
    exports : [AppFormComponent]
})

export class AppFormModule{}


