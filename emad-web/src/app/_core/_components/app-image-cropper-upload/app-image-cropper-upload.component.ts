import { Component, ChangeDetectorRef, Output, EventEmitter, Input, ChangeDetectionStrategy } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { FileUpload } from "../app-file-upload/model/file.model";
import { NgbModal, ModalDismissReasons, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-image-cropper-upload',
  templateUrl: './app-image-cropper-upload.component.html',
  styleUrls: ['./app-image-cropper-upload.component.css']
})
export class AppImageCropperUploadComponent {
  @Output() cropped = new EventEmitter<FileUpload>();
  @Input() currentFile: FileUpload;

  public imageChangedEvent = '';

  private modalRef: NgbModalRef = null;
  private base64: string;

  constructor(private cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.base64 = event.base64;
  }

  saveCropper() {
    if (!this.currentFile)
      this.currentFile = {} as FileUpload;

    this.currentFile.base64 = this.base64;
    this.imageChangedEvent = '';

    this.cropped.emit(this.currentFile);

    this.close();
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
    if (this.modalRef)
      this.modalRef.close();
  }
}
