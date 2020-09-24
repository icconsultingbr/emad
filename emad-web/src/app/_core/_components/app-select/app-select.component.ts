import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SelectBaseModel } from "./model/select-base.model";

@Component({
    selector: 'app-select',
    templateUrl: './app-select.component.html',
    styleUrls: ['./app-select.component.css']
})
export class SelectComponent implements AfterViewChecked {
    @Input() formGroup: FormGroup;
    @Input() name: string;

    @Input() lista: SelectBaseModel[];

    id: number;

    @Output() valueChange = new EventEmitter<number>();

    @Input() set value(value: number) {
        this.id = value;
    }

    constructor(private cdr: ChangeDetectorRef) {

    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    customSearchFn(term: string, item: any) {
        term = term.toLocaleLowerCase();
        return item.nome.toLocaleLowerCase().indexOf(term) > -1;
    }

    onChange(value: any) {
        if (this.formGroup) {
            this.formGroup.get(this.name).patchValue(value.id, { emitEvent: false });
        }

        this.valueChange.emit(value.id);
    }
}