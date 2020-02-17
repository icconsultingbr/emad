import { Input } from "@angular/core";

export class Usuario {
    id : Number;
    @Input() nome : string;
    @Input() cpf : String;
    @Input() nomeMae : String;
    @Input() dataNascimento : String;
    @Input() email : String;
    @Input() foto : String;
    @Input() senha : String;
    @Input() confirmaSenha : String;
    @Input() celular : String;
    @Input() idTipoUsuario : number;
    @Input() situacao : Boolean;
    @Input() dataCriacao : String;
    @Input() idEmpresa : number; 
    nomeSocial : String;
    token : String;
    @Input() sexo : String;
    @Input() estabelecimentos : any[];
    @Input() ep : Number ;

}