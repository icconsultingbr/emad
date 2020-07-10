import { ReciboReceitaImpressaoService } from "../../shared/services/recibo-receita-impressao.service";
import { ActivatedRoute } from "@angular/router";
import { OnInit, Component } from "@angular/core";

@Component({
    templateUrl: './relatorio-receita.component.html'
})
export class RelatorioReceitaComponent implements OnInit {
    
    constructor(private relatorioReceitaService: ReciboReceitaImpressaoService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const ano = params['ano'];
            const estabelecimentoId = params['estabelecimentoId'];
            const numero = params['numero'];
            const farmacia = params['farmacia'];

            this.relatorioReceitaService.imprimir(ano, estabelecimentoId, numero, farmacia, '_self');
        });
    }
}