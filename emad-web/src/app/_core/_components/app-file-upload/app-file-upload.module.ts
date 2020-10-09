import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppFileUploadComponent } from "./app-file-upload.component";
import { NgxUploaderModule } from "ngx-uploader";

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgxUploaderModule
    ],
    declarations: [
        AppFileUploadComponent
    ],
    exports: [
        AppFileUploadComponent
    ]
})

export class AppFileUploadModule { }