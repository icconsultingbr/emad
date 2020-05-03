import { Input } from "@angular/core";

export class MedicamentoDim {
    id: Number;  
    @Input() id_material: Number; 
    @Input() codigo_material: String;
    @Input() descricao: String;
    @Input() unidade: String;
}