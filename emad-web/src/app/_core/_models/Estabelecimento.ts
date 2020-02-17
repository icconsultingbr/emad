import { Input } from "@angular/core";

export class Estabelecimento {
    id:Number;
    @Input() nome: string;
    @Input() cnes: string;
    @Input() cnpj: String;
    @Input() razaoSocial: String;
    @Input() nomeFantasia: String;
    @Input() cep: String;
    @Input() logradouro: String;
    @Input() numero: String;
    @Input() complemento: String;
    @Input() bairro: String;
    @Input() idMunicipio: Number;
    @Input() idUf: Number;
    @Input() telefone1: String;
    @Input() telefone2: String;
    @Input() email: String;
    @Input() cnpjMantedora: String;
    @Input() grauDependencia: String;
    @Input() terceiros: Boolean;
    @Input() idTipoUnidade: Number;
    @Input() esferaAdministradora: String;
    @Input() situacao: Boolean;
    @Input() latitude: number;
    @Input() longitude: number;
    @Input() distancia: number;
}