import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppFileUploadModule } from "../app-file-upload/app-file-upload.module";
import { AppImageCropperUploadComponent } from "./app-image-cropper-upload.component";
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AppFileUploadModule,
    AvatarModule
  ],
  declarations: [
    AppImageCropperUploadComponent
  ],
  exports: [
    AppImageCropperUploadComponent
  ]
})

export class AppImageCropperUploadModule { }
