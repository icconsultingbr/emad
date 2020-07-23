import { Injectable } from "@angular/core";
import * as _moment from 'moment';
import { RelatorioEstoqueService } from "./relatorio-estoque.service";
import { RelatoriosEstoqueService } from "./relatorios-estoque.service";

@Injectable()
export class EstoqueImpressaoService extends RelatorioEstoqueService{
    constructor(private relatoriosEstoqueService: RelatoriosEstoqueService){
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
    }

    imprimir(relatorio: string, nomeRelatorio: string, nomeEstabelecimento: string, dadosRelatorio: any, target: string = '_blank'){        
        
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
                                        ${nomeRelatorio}   
                            </div>           
                        </div>
                        <hr size = 7>
                        <br/>                    
                        `;

        if(relatorio=="ENTRADA_MATERIAL"){

            this.relatoriosEstoqueService.obterRelatorioEntradaMaterial(dadosRelatorio.idMovimentoGeral).subscribe((result) => { 
            let gridMedicamentos = '';       
            
            gridMedicamentos += (`<table class="table table-striped"><thead><tr style="text-align: center;">
                                        <th style="width:10%">Código</th>
                                        <th style="width:30%">Material</th>
                                        <th style="width:30%">Fabricante</th>
                                        <th style="width:10%">Lote</th>
                                        <th style="width:10%">Validade</th>   
                                        <th style="width:10%">Quantidade</th>                                           
                                        </tr></thead>
                                    `);  
                                    
            gridMedicamentos += (result.length > 0 ? `<tbody>` : ``);

            for (const medicamentos of result) {  
                gridMedicamentos += (`
                <tr class="text-left">
                    <td class="text-secondary">${medicamentos.codigoMaterial}</td>
                    <td class="text-secondary">${medicamentos.nomeMaterial}</td>
                    <td class="text-secondary">${medicamentos.nomeFabricanteMaterial}</td>
                    <td class="text-secondary">${medicamentos.lote}</td>
                    <td class="text-secondary">${medicamentos.validade}</td>
                    <td class="text-secondary">${medicamentos.quantidade}</td>                    
                </tr>`);
            }       

            gridMedicamentos += (result.length > 0 ? `</tbody></table>` : `</table>`);

             tela +=              `<div class="row"> 
                            <div class="col s4">
                                Número do documento: ${dadosRelatorio.numeroDocumento} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data: ${dadosRelatorio.dataMovimentacao ? _moment(dadosRelatorio.dataMovimentacao).format('DD/MM/YYYY') : ''}
                            </div>           
                        </div>  
                        <br/>         
                        <div class="row"> 
                            ${gridMedicamentos}   
                        </div>     
                    </form>    
                </div>
            </div>`

            this.print(tela, nomeEstabelecimento, target);
            });
        } else if(relatorio=="MOVIMENTAR_ESTOQUE"){

            this.relatoriosEstoqueService.obterRelatorioEntradaMaterial(dadosRelatorio.idMovimentoGeral).subscribe((result) => { 
            let gridMedicamentos = '';       
            
            gridMedicamentos += (`<table class="table table-striped"><thead><tr style="text-align: center;">
                                        <th style="width:10%">Código</th>
                                        <th style="width:30%">Material</th>
                                        <th style="width:30%">Fabricante</th>
                                        <th style="width:10%">Lote</th>
                                        <th style="width:10%">Validade</th>   
                                        <th style="width:10%">Quantidade</th>                                           
                                        </tr></thead>
                                    `);  
                                    
            gridMedicamentos += (result.length > 0 ? `<tbody>` : ``);

            for (const medicamentos of result) {  
                gridMedicamentos += (`
                <tr class="text-left">
                    <td class="text-secondary">${medicamentos.codigoMaterial}</td>
                    <td class="text-secondary">${medicamentos.nomeMaterial}</td>
                    <td class="text-secondary">${medicamentos.nomeFabricanteMaterial}</td>
                    <td class="text-secondary">${medicamentos.lote}</td>
                    <td class="text-secondary">${medicamentos.validade}</td>
                    <td class="text-secondary">${medicamentos.quantidade}</td>                    
                </tr>`);
            }       

            gridMedicamentos += (result.length > 0 ? `</tbody></table>` : `</table>`);

             tela +=   `<div class="row"> 
                            <div class="col s6">
                                Número do documento: ${dadosRelatorio.idMovimentoGeral} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Data: ${dadosRelatorio.dataMovimentacao ? _moment(dadosRelatorio.dataMovimentacao).format('DD/MM/YYYY') : ''}
                            </div>           
                        </div>  
                        <div class="row"> 
                            <div class="col s6">
                                Tipo de movimento: ${dadosRelatorio.nomeTipoMovimento} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Operação(${dadosRelatorio.operacao == 1 ? 'Entrada' : dadosRelatorio.operacao == 2 ? 'Saída' : 'Perda'})
                            </div>           
                        </div> 
                        <div class="row"> 
                            <div class="col s12">
                                Motivo: ${dadosRelatorio.motivo}
                            </div>           
                        </div>  
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
}