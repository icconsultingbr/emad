import { Input } from "@angular/core";

export class EstabelecimentoGrupoMaterial {
    id: Number;
    @Input() idEstabelecimento : Number = JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idGrupoMaterial: number;
    @Input() principal: boolean;
    @Input() situacao: Boolean;
}