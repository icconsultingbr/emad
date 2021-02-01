import { NgModule } from '@angular/core';
import { ReciboReceitaImpressaoService } from './recibo-receita-impressao.service';
import { ReceitaService } from './receita.service';
import { CoreModule } from '../../_core/core.module';
import { EstoqueUnidadeImpressaoService } from './estoque-unidade-impressao.service';
import { EstoqueMedicamentoImpressaoService } from './estoque-medicamento-impressao.service';
import { EstoqueConsumoImpressaoService } from './estoque-consumo-impressao.service';
import { EstoqueImpressaoService } from './estoque-impressao.service';
import { RelatoriosEstoqueService } from './relatorios-estoque.service';
import { ReciboExameImpressaoService } from './recibo-exame-impressao.service';
import { ExameService } from './exame.service';

@NgModule({
    imports: [
        CoreModule
    ],
    declarations: [],
    providers: [
        ReciboReceitaImpressaoService,
        ReceitaService,
        EstoqueUnidadeImpressaoService,  
        EstoqueMedicamentoImpressaoService ,  
        EstoqueConsumoImpressaoService,
        EstoqueImpressaoService,
        RelatoriosEstoqueService,
        ReciboExameImpressaoService,
        ExameService
    ]
})
export class SharedServiceModule { }