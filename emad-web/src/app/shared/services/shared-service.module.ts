import { NgModule } from '@angular/core';
import { ReciboReceitaImpressaoService } from './recibo-receita-impressao.service';
import { ReceitaService } from './receita.service';
import { CoreModule } from '../../_core/core.module';

@NgModule({
    imports: [
        CoreModule
    ],
    declarations: [],
    providers: [
        ReciboReceitaImpressaoService,
        ReceitaService
    ]
})
export class SharedServiceModule { }