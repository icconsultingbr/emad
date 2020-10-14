import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageCropperModule } from 'ngx-image-cropper';
import { AppFileUploadModule } from "../app-file-upload/app-file-upload.module";
import { AppImageCropperUploadComponent } from "./app-image-cropper-upload.component";
import { AvatarModule } from 'ngx-avatar';
import { FileUploadService } from "../app-file-upload/services/file-upload.service";
import { UsuarioService } from "../../../seguranca/usuario/usuario.service";
import { PipeModule } from "../../_pipes/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AppFileUploadModule,
    AvatarModule,
    PipeModule
  ],
  declarations: [
    AppImageCropperUploadComponent
  ],
  exports: [
    AppImageCropperUploadComponent
  ],
  providers: [
    FileUploadService,
    UsuarioService
  ]
})

export class AppImageCropperUploadModule { }
