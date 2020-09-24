import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectBaseModel } from "./model/select-base.model";

@Component({
    selector: 'app-select',
    templateUrl: './app-select.component.html',
    styleUrls: ['./app-select.component.css'],
})
export class SelectComponent {
    @Input() lista: SelectBaseModel[];

    id: number;

    @Output() valueChange = new EventEmitter<number>();

    @Input() set value(value: number) {
        this.id = value;
    }

    customSearchFn(term: string, item: any) {
        term = term.toLocaleLowerCase();
        return item.nome.toLocaleLowerCase().indexOf(term) > -1;
    }

    onChange(value: any) {
        this.valueChange.emit(value.id);
    }
}