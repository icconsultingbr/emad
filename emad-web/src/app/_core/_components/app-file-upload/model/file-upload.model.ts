import { Guid } from 'guid-typescript';

export interface FileUpload extends File {
  id: Guid;
  event?: any;
  extension: string;
  base64?: string | null;
  name: string;
}
