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

  upload(file: FileUpload): Observable<string> {
    return this.http.post<string>('documento', JSON.stringify(file))
      .pipe(map((res: any) => {
        return res.id;
      }));
  }

  get(id: string): Observable<FileUpload> {
    return this.http.get<FileUpload>('documento/' + id);
  }
}
