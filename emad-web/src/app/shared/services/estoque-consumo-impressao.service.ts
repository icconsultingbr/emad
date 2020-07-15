import { Injectable } from "@angular/core";
import * as _moment from 'moment';
import { RelatorioEstoqueService } from "./relatorio-estoque.service";
import { EstoqueConsumoService } from "../../estoque/relatorios/estoque-consumo/estoque-consumo.service";


@Injectable()
export class EstoqueConsumoImpressaoService extends RelatorioEstoqueService{
    constructor(private estoqueConsumoService: EstoqueConsumoService){
        super();

        this.style = `<style type="text/css">

        @page { size: auto;  margin: 5mm; }

        .hidden-button{
            display: block;
        }

        div.page div.print-footer {
            /*Oculta os rodapes de impressão*/
            display: none;
        }
    
        @media print {
            html, body {
                min-height: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }

            .hidden-button{
                display: none;
            }
    
            footer {
                /*some com o rodapé original*/
                display: none;
            }
    
            div.page div.print-footer {
                /*exibe os rodapés de impressão (que no caso são divs)*/
                display: block;
                position: relative;
                top: 98%;
                margin-top: -2%;
                height: 2%; /*quando ajustar a altura deves ajustar margin-top e o top*/
            }
    
            div.content {
                /*Ajuda a trabalhar o conteudo com o .print-footer*/
                position: relative;
                background-color: #f00;
                top: 0;
                left: 0;
            }
    
            div.page {
                /*Força sempre quebrar a página no final*/
                page-break-after: always;
                max-height: 95%;
                height: 95%;
                background-color: #fc0;
            }
        }

        .margin-collapse {
            margin: 20 !important;
        }

        .row {
            margin-bottom: unset !important;
        }

        .collapsible {
            border-radius: 10px;
        }

        .table, th, td{
            border: 2px solid;
            padding: 5px 5px;
            font-size: 12px;
        }

        .container {
            width: 94%;
            margin-left: 30px;
            margin-right: 30px;
        }
        
        .collapsible-body{
            display: block !important;
        }
        
        .input-field{
            margin-top: unset !important;
        }
        
        .cor_topo {            
            color: #000000;
        }
    </style>`
        
        this.script = `<script>
            $(document).ready(function(){
            $('.date').mask('00/00/0000');
            $('.cpf').mask('000.000.000-00');
            $('.cnpj').mask('00.000.000/0000-00');
            });
        </script>`
    }

    imprimir(idMaterial: number, idEstabelecimento: number, estoqueAbaixoMinimo: string, nomeEstabelecimento: string, nomeMaterial: string, target: string = '_blank'){        
        this.estoqueConsumoService.carregaEstoquePorConsumo(idMaterial, idEstabelecimento, estoqueAbaixoMinimo)
        .subscribe((result) => { 
        let gridMedicamentos = '';       
        
        gridMedicamentos += (`<table class="table table-striped">
                            <thead>
                                <tr style="text-align: center;">
                                    <th style="width:10%">Código</th>
                                    <th style="width:40%">Medicamento</th>
                                    <th style="width:10%">Estoque mín.</th>
                                    <th style="width:10%">Qtd. estoque</th>
                                    <th style="width:10%">Qtd. empenhada</th>   
                                    <th style="width:10%">Qtd. dispensar</th>   
                                    <th style="width:10%">Saldo</th>   
                                </tr>
                            </thead>
                                 `);  

                                 
        gridMedicamentos += (result.length > 0 ? `<tbody>` : ``);

        for (const medicamentos of result) {  
            gridMedicamentos += (`
            <tr class="text-left">
                <td class="text-secondary">${medicamentos.codigoMaterial}</td>
                <td class="text-secondary">${medicamentos.nomeMaterial}</td>
                <td class="text-secondary">${medicamentos.estoqueMinimo}</td>
                <td class="text-secondary">${medicamentos.estoque}</td>
                <td class="text-secondary">${medicamentos.comprar}</td>
                <td class="text-secondary">${medicamentos.dispensar}</td>
                <td class="text-secondary">${medicamentos.saldo}</td>                    
            </tr>`);
        }       

        gridMedicamentos += (result.length > 0 ? `</tbody></table>` : `</table>`);

        let tela = `
        <div class="page">
            <div class="content">
                <form class="container" id="form" style="font-size: 12px;">
                    <div class="row hidden-button" style="margin-bottom: 10px !important;">
                        <a class="waves-effect waves-light btn" style="float:right; margin-right:1%" onclick="window.print()">Imprimir</a>
                    </div>
                    <div class="row">
                        <div class="col s4" style="margin-top:20px;">
                            <img style="width:60%; float:left; margin-left:10px;" src="${window.location.origin}${window.location.pathname}/assets/imgs/logo_relatorio.png">
                        </div>                    
                        <div class="col s8" style="margin-top:40px;text-align: right; color: #7d0000; font-weight:bold">
                            Unidade: ${nomeEstabelecimento}               
                        </div>           
                        <div class="col s8" style="text-align: right; color: #7d0000; font-weight:bold">                
                            Consumo estoque
                        </div>           
                    </div>
                    <hr size = 7>
                    <br/>                    
                    <div class="row"> 
                        ${gridMedicamentos}   
                    </div>     
                </form>    
            </div>
        </div>`
            
        this.print(tela, nomeEstabelecimento, target);
        });
    }
}