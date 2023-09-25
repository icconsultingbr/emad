import { Input } from '@angular/core';

export class Material {
    id: Number;
    @Input() codigo: string;
    @Input() descricao: string;
    @Input() idUnidadeMaterial: number;
    @Input() dispensavel: boolean;
    @Input() periodoDispensavel: number;
    @Input() necessitaAutorizacao: boolean;
    @Input() estoqueMinimo: number;
    @Input() generico: boolean;
    @Input() idListaControleEspecial: number;
    @Input() idGrupoMaterial: number;
    @Input() idSubGrupoMaterial: number;
    @Input() idFamiliaMaterial: number;
    @Input() idTipoMaterial: number;
    @Input() descricaoCompleta: string;
    @Input() vacina: boolean;
    @Input() situacao: boolean;
}
