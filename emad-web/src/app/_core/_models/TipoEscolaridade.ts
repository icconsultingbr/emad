import { Input } from "@angular/core";

export class TipoEscolaridade {
  id: Number;
  @Input() nome: string;
  @Input() situacao: Boolean;
}
