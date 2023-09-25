import { Input } from '@angular/core';

export class Usuario {
    id: Number;
    @Input() nome: string;
    @Input() cpf: string;
    @Input() nomeMae: string;
    @Input() dataNascimento: string;
    @Input() email: string;
    @Input() foto: string;
    @Input() senha: string;
    @Input() confirmaSenha: string;
    @Input() celular: string;
    @Input() idTipoUsuario: number;
    @Input() situacao: Boolean;
    @Input() dataCriacao: string;
    @Input() idEmpresa: number;
    nomeSocial: string;
    token: string;
    @Input() sexo: string;
    @Input() estabelecimentos: any[];
    @Input() ep: Number ;

}
