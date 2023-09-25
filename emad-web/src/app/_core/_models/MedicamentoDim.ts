import { Input } from '@angular/core';

export class MedicamentoDim {
    id: Number;
    @Input() id_material: Number;
    @Input() codigo_material: string;
    @Input() descricao: string;
    @Input() unidade: string;
}
