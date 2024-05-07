import { PlanoTerapeuticoService } from '../../../operacao/plano-terapeutico/plano-terapeutico.service'
import { ObterAgendamentoPorIdDto } from '../dtos';

export class AgendamentoService {
  private service: PlanoTerapeuticoService

  constructor(public _service: PlanoTerapeuticoService) {
    this.service = _service;
  }

  listarPorId(id: string, cb: (result: ObterAgendamentoPorIdDto) => void): void {
    this.service.list(`agendamento/${id}`).subscribe((result) => cb(result))
  }
}
