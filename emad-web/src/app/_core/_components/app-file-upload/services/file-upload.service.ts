import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { FileUpload } from "../model/file-upload.model";
import { GenericsService } from "../../../_services/generics.service";
import { map } from "rxjs/operators/map";

@Injectable()
export class FileUploadService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  uploadImage(file: FileUpload): Observable<string> {
    return this.http.post<string>('documento/image', JSON.stringify(file))
      .pipe(map((res: any) => {
        return res.id;
      }));
  }

  uploadListImage(files: Array<FileUpload>) {
    let list = [];

    files.forEach(element => {
      list.push({
        id: element.id,
        name: element.name,
        base64: element.base64,
        extension: element.extension
      })
    });

    return this.http.post('documentos/exame', JSON.stringify(list))
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
