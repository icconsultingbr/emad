import { Input } from "@angular/core";

export class Atendimento {
    @Input() id: Number = null;
    @Input() cpf: String = null;
    @Input() idPaciente: Number = null;
    @Input() pacienteNome : String;
    @Input() pressaoArterial: String = null;
    @Input() pulso: String = null;
    @Input() saturacao: String = null;
    @Input() temperatura: String = null;
    @Input() altura: String = null;
    @Input() peso: String = null;
    @Input() historicoClinico: String = null;
    @Input() historiaProgressa: String = null;
    @Input() exameFisico: String = null;
    @Input() observacoesGerais: String = null;
    @Input() situacao: String = null;
    @Input() dataFinalizacao : String = null;
    @Input() dataCancelamento : String = null;
    @Input() idEstabelecimento : Number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idProfissional: Number = null;
}
