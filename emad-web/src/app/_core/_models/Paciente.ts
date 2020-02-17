import { Input } from "@angular/core";

export class Paciente {
    id: Number = null;
    @Input() cartaoSus: String = null;
    @Input() nome: String = null;
    @Input() nomeSocial: String = null;
    @Input() nomeMae: String = null;
    @Input() nomePai: String = null;
    @Input() dataNascimento: String = null;
    @Input() sexo: String = null;
    @Input() idNacionalidade: Number = null ;
    @Input() idNaturalidade: Number = null ;
    @Input() ocupacao: String = null ;
    @Input() cpf: String = null ;
    @Input() rg: String = null ;
    @Input() dataEmissao: String = null ;
    @Input() orgaoEmissor: String = null ;
    @Input() escolaridade: Number = null ;
    @Input() cep: String = null ;
    @Input() logradouro: String = null ;
    @Input() numero: String = null ;
    @Input() complemento: String = null ;
    @Input() bairro: String = null ;
    @Input() idMunicipio: Number = null ;
    @Input() idUf: Number = null ;
    @Input() foneResidencial: String = null ;
    @Input() foneCelular: String = null ;
    @Input() foneContato: String = null ;
    @Input() contato: String = null ;
    @Input() email: String = null ;
    @Input() situacao: Boolean = null ;
    @Input() idModalidade: Number = null ;
    @Input() latitude: number;
    @Input() longitude: number;
    @Input() distancia: number;
    @Input() idade: number = null;
}