import { Input } from "@angular/core";

export class Estabelecimento {
    id:Number;
    @Input() nome: string;
    @Input() cnes: string;
    @Input() cnpj: string;
    @Input() razaoSocial: string;
    @Input() nomeFantasia: string;
    @Input() cep: string;
    @Input() logradouro: string;
    @Input() numero: string;
    @Input() complemento: string;
    @Input() bairro: string;
    @Input() idMunicipio: Number;
    @Input() idUf: Number;
    @Input() telefone1: string;
    @Input() telefone2: string;
    @Input() email: string;
    @Input() cnpjMantedora: string;
    @Input() grauDependencia: string;
    @Input() terceiros: Boolean;
    @Input() idTipoUnidade: Number;
    @Input() esferaAdministradora: string;
    @Input() situacao: Boolean;
    @Input() latitude: number;
    @Input() longitude: number;
    @Input() distancia: number;
    @Input() idUnidadeCorrespondenteDim: Number = null;
    @Input() idUnidadePesquisaMedicamentoDim: Number = null;
    @Input() idUnidadeRegistroReceitaDim: Number = null;
}