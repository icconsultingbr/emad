import { Input } from '@angular/core';

export class AnexarDocumento {
  id: Number;
  @Input() nome: string;
  @Input() nomeArquivo: string;
  @Input() observacaoArquivo: string;
}
