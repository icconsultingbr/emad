import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppFormComponent } from './app-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CoreModule } from '../../core.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgMultiSelectDropDownModule.forRoot(),
        CoreModule
    ],
    declarations: [AppFormComponent],
    exports: [AppFormComponent]
})

export class AppFormModule { }


