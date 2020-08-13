import { Injectable } from "@angular/core";
import * as _moment from 'moment';
import { RelatorioMedicamentoService } from "./relatorio-medicamento.service";
import { MedicamentoMovimentoService } from "../../farmacia/relatorios/medicamento-movimento/medicamento-movimento.service";

@Injectable()
export class MedicamentoMovimentoImpressaoService extends RelatorioMedicamentoService{
    constructor(private medicamentoMovimentoService: MedicamentoMovimentoService){
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
        }</style>`
    }

    imprimir(object: any, nomeEstabelecimento: string, criteriosPesquisa: any, target: string = '_blank'){
        
        this.medicamentoMovimentoService.carregaMedicamentoMovimentacao(object.idTipoMovimento, object.params)
        .subscribe((medicamentos) => { 
        let gridMedicamentos = ''; 
      
        gridMedicamentos += (`
                                   <table class="table table-striped">
                                   <thead>
                                       <tr style="text-align: center;">                                           
                                           <th style="width:10%">Tipo de movimento</th>    
                                           <th style="width:8%">Documento</th>
                                           <th style="width:30%">Medicamento</th>                                           
                                           <th style="width:8%">Lote</th>   
                                           <th style="width:20%">Fabricante</th>
                                           <th style="width:8%">Validade</th>
                                           <th style="width:8%">Quantidade</th>
                                           <th style="width:8%">Data</th>                                             
                                       </tr>
                                   </thead>
                                 `); 

        gridMedicamentos += (medicamentos.lista.length > 0 ? `<tbody>` : ``);                                 

        for (const medicamento of medicamentos.lista) { 

            for (const itemMovimento of medicamento.itensUnidade) { 
                gridMedicamentos += (`
                <tr class="text-left">
                    <td class="text-secondary">${itemMovimento.nomeTipoMovimento}</td>
                    <td class="text-secondary">${itemMovimento.documento}</td>                
                    <td class="text-secondary">${itemMovimento.codigoMaterial + ' - ' + itemMovimento.nomeMaterial}</td>
                    <td class="text-secondary">${itemMovimento.lote}</td>                
                    <td class="text-secondary">${itemMovimento.nomeFabricanteMaterial}</td>                
                    <td class="text-secondary">${itemMovimento.validade ? _moment(itemMovimento.validade).format('DD/MM/YYYY') : '' }</td>
                    <td class="text-secondary">${itemMovimento.quantidade}</td>
                    <td class="text-secondary">${itemMovimento.dataMovimento ? _moment(itemMovimento.dataMovimento).format('DD/MM/YYYY') : '' }</td>
                </tr>`);
            }

            gridMedicamentos += (`
                <tr">
                    <td colspan="2"> Total de documentos: ${medicamentos.totalDocumentos}</td>
                    <td colspan="5" style="text-align: right;"> Qtd. total: ${medicamentos.totalQuantidade}</td>
                </tr>`); 
        }   

         

        gridMedicamentos += (medicamentos.lista.length > 0 ? `</tbody></table><br/>` : `</table><br/>`);

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
                            Movimentação de materiais
                        </div>           
                    </div>
                    <hr size = 7>                    
                    <div class="row"> 
                        &nbsp;&nbsp;&nbsp;&nbsp;<b>CRITÉRIOS DE PESQUISA</b>
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Período: ${criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : ''} à ${criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : ''}
                        </div>   
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidade: ${criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : "Todas as unidades"}
                        </div>   
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tipo de movimento:  ${criteriosPesquisa.nomeOperacao ? criteriosPesquisa.nomeOperacao + " - " + criteriosPesquisa.nomeTipoMovimento : "Todos os movimentos"}
                        </div>   
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medicamento: ${criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : "Todos os medicamentos"}
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
            
        this.print(tela, "", "Relatório-Medicamento-Movimentacao", target);
        });
    }

    exportar(object: any, nomeEstabelecimento: string, criteriosPesquisa: any){        
        var data = [];

        this.medicamentoMovimentoService.carregaMedicamentoMovimentacao(object.idTipoMovimento, object.params)
        .subscribe((medicamentos) => { 
            
            data.push({ coluna1: 'Unidade: ' + nomeEstabelecimento, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            data.push({ coluna1: 'Movimentação de materiais', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            
            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            
            data.push({ coluna1: 'CRITÉRIOS DE PESQUISA', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            data.push({ coluna1: 'Período: ' + (criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : '') + " à " + (criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : '') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            data.push({ coluna1: 'Unidade: ' + (criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : "Todas as unidades") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            data.push({ coluna1: 'Tipo de movimento: ' + (criteriosPesquisa.nomeOperacao ? criteriosPesquisa.nomeOperacao + " - " + criteriosPesquisa.nomeTipoMovimento : "Todos os movimentos") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            data.push({ coluna1: 'Medicamento: ' + (criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : "Todos os medicamentos") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});
            
            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});

            data.push({ coluna1: 'Tipo de movimento', 
                            coluna2: 'Documento',
                            coluna3: 'Medicamento',
                            coluna4: 'Lote', 
                            coluna5: 'Fabricante',
                            coluna6: 'Validade',
                            coluna7: 'Quantidade',
                            coluna8: 'Data'});

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});

            for (const medicamento of medicamentos.lista) {  

                for (const itemMovimento of medicamento.itensUnidade) {  

                data.push({ coluna1: itemMovimento.nomeTipoMovimento , 
                    coluna2: itemMovimento.documento,
                    coluna3: itemMovimento.codigoMaterial + ' - ' + itemMovimento.nomeMaterial,
                    coluna4: itemMovimento.lote,                                        
                    coluna5: itemMovimento.nomeFabricanteMaterial,
                    coluna6: (itemMovimento.validade ? _moment(itemMovimento.validade).format('DD/MM/YYYY') : ''),
                    coluna7: itemMovimento.quantidade,
                    coluna8: (itemMovimento.dataMovimento ? _moment(itemMovimento.dataMovimento).format('DD/MM/YYYY') : '')});
                }  
                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: ''});

                data.push({ coluna1: 'Total de documentos: ' + medicamento.totalDocumentos, 
                coluna2: '',
                coluna3: '',
                coluna4: '',
                coluna5: '',
                coluna6: '', 
                coluna7: 'Qtd. total: ' + medicamento.totalQuantidade,
                coluna8: ''});  
            }  

            this.exportCsv(data,"Relatório-Medicamento-Movimentacao" );
        });
    }
}