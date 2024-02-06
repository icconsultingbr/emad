import { Input } from '@angular/core';
export class ParticipanteAtividadeColetiva {
    @Input() id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() nomePaciente: string = null;
    @Input() cartaoSus: string = null;
    @Input() dataNascimento: string = null;
    @Input() sexo: number = null;
    @Input() parouFumar: boolean = null;
    @Input() abandonouGrupo: boolean = null;
    @Input() avaliacaoAlterada: boolean = null;
    @Input() peso: string = null;
    @Input() altura: string = null;
    @Input() pulso: string = null
    @Input() saturacao: string = null
    @Input() pressaoArterial: string = null
    @Input() temperatura: string = null
    @Input() queixaHistoriaDoenca: string = null
    @Input() observacao: string = null
    @Input() avaliacao: string = null
    @Input() descricaoTipoAtividade: string = null
}
