import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { FileUpload } from "./model/file-upload.model";
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-file-upload',
  templateUrl: './app-file-upload.component.html',
  styleUrls: ['./app-file-upload.component.css']
})
export class AppFileUploadComponent implements OnInit {

  @Output() changeFiles = new EventEmitter<FileUpload[]>();

  @Input() multiple: boolean;
  @Input() maxSize: number;
  @Input() formatsAllowed: string;
  @Input() buttonLabel: string;

  allowedFiles: FileUpload[] = [];

  notAllowedFiles: {
    fileName: string;
    fileSize: string;
    errorMsg: string;
  }[] = [];

  ngOnInit(): void {
    this.maxSize = this.maxSize || 20 * 1024000;
    this.formatsAllowed = this.formatsAllowed || '.jpg,.png,.pdf,.docx,.txt,.gif,.jpeg'
  }

  resetFileUpload() {
    this.allowedFiles = [];
    this.notAllowedFiles = [];
  }

  onChange(event: any) {
    this.notAllowedFiles = [];
    const fileExtRegExp: RegExp = /(?:\.([^.]+))?$/;
    let fileList: FileList;

    if (!this.multiple) {
      this.allowedFiles = [];
    }

    fileList = event.target.files || event.srcElement.files;

    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i] as FileUpload;

      file.id = Guid.create();
      file.event = event;

      file.extension = file.name.split(".").pop()

      const currentFileExt = fileExtRegExp.exec(file.name)[1].toLowerCase();

      const isFormatValid = this.formatsAllowed.includes(currentFileExt);

      const isSizeValid = fileList[i].size <= this.maxSize;

      if (isFormatValid && isSizeValid) {
        this.allowedFiles.push(file);
      } else {
        this.notAllowedFiles.push({
          fileName: fileList[i].name,
          fileSize: this.convertSize(fileList[i].size),
          errorMsg: !isFormatValid ? 'Invalid format' : 'Invalid size',
        });
      }
    }

    this.changeFiles.emit(this.allowedFiles);
  }

  removeFile(i: any, sf_na: any) {
    if (sf_na === 'sf') {
      this.allowedFiles.splice(i, 1);
    } else {
      this.notAllowedFiles.splice(i, 1);
    }

    this.changeFiles.emit(this.allowedFiles);
  }

  convertSize(fileSize: number): string {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }
}
