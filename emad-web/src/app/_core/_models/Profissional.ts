import { Input } from "@angular/core";

export class Profissional {
    id: Number;
    @Input() cpf: String;
    @Input() nome: String;
    @Input() nomeMae: String;
    @Input() nomePai: String;
    @Input() dataNascimento: String;
    @Input() sexo: String;
    @Input() idNacionalidade: Number;
    @Input() idNaturalidade: Number;
    @Input() profissionalSus: String;
    @Input() rg: String;
    @Input() dataEmissao: String;
    @Input() orgaoEmissor: String;
    @Input() escolaridade: Number;
    @Input() cep: String;
    @Input() logradouro: String;
    @Input() numero: String;
    @Input() complemento: String;
    @Input() idMunicipio: Number;
    @Input() idUf: Number;
    @Input() bairro: String;
    @Input() foneResidencial: String;
    @Input() foneCelular: Boolean;
    @Input() email: Boolean;
    @Input() idEspecialidade: Number;
    @Input() vinculo: String;
    @Input() crm: String;
    @Input() cargaHorariaSemanal: String;
    @Input() cargoProfissional: String;
    @Input() situacao: Boolean;
    @Input() estabelecimentos : any[];
    @Input() latitude: number;
    @Input() longitude: number;
    @Input() idEstabelecimento : Number = +JSON.parse(localStorage.getItem("est"))[0].id;
}