import { Guid } from "guid-typescript";

export interface FileUpload extends File {
  id: Guid;
  event?: any;
  base64?: string | null;
}
