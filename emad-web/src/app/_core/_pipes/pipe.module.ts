import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './cpf-cnpj.pipe';
import { TelefonePipe } from './telefone.pipe';
import { CurrencyFormat } from './currencyformat.pipe';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ CpfCnpjPipe, TelefonePipe, CurrencyFormat ],
    exports: [ CpfCnpjPipe, TelefonePipe, CurrencyFormat ],
})
export class PipeModule { }