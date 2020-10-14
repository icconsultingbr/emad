import { Component, Output, EventEmitter, Input, ChangeDetectorRef, OnInit } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { FileUpload } from "../app-file-upload/model/file-upload.model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Guid } from "guid-typescript";
import { HttpClient } from "@angular/common/http";
import { FileUploadService } from "../app-file-upload/services/file-upload.service";
import { environment } from "../../../../environments/environment";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-image-cropper-upload',
  templateUrl: './app-image-cropper-upload.component.html',
  styleUrls: ['./app-image-cropper-upload.component.css']
})
export class AppImageCropperUploadComponent {

  @Input() public id: string;
  @Input() public size: number;
  @Input() public readOnly: boolean;

  @Output() private saved = new EventEmitter<string>();

  private modalRef: NgbModalRef = null;

  public images: any[] = [];

  pathFiles = `${environment.apiUrl}/`;

  constructor(private modalService: NgbModal,
    private fileUploadService: FileUploadService,
    private cd: ChangeDetectorRef) { }

  fileChangeEvent(event: any): void {
    this.images = event;
    this.cd.detectChanges();
  }

  imageCropped(file: FileUpload, event: ImageCroppedEvent) {
    file.base64 = event.base64;
  }

  saveCropper() {
    this.fileUploadService.uploadImage(this.images[0])
    .subscribe((result) => {
      this.id = result;

      this.saved.emit(this.id);
      this.close();
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
      this.images = [];
    }
  }
}
