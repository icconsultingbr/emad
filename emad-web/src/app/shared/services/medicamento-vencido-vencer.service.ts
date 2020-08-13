import { Injectable } from "@angular/core";
import * as _moment from 'moment';
import { RelatorioMedicamentoService } from "./relatorio-medicamento.service";
import { MedicamentoVencidoVencerService } from "../../farmacia/relatorios/medicamento-vencido-vencer/medicamento-vencido-vencer.service";

@Injectable()
export class MedicamentoVencidoVencerImpressaoService extends RelatorioMedicamentoService{
    constructor(private medicamentoVencidoVencerService: MedicamentoVencidoVencerService){
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
        
        this.medicamentoVencidoVencerService.carregaMedicamentoVencidoVencer(object.idProfissional, object.params)
        .subscribe((medicamentos) => { 
        let gridMedicamentos = ''; 
      
        gridMedicamentos += (`
                                   <table class="table table-striped">
                                   <thead>
                                       <tr style="text-align: center;">                                           
                                           <th style="width:8%">Código</th>    
                                           <th style="width:33%">Medicamento</th>
                                           <th style="width:8%">Validade</th>
                                           <th style="width:8%">Lote</th>   
                                           <th style="width:23%">Fabricante</th>
                                           <th style="width:5%">Estoque</th>
                                           <th style="width:15%">Unidade</th>                                             
                                       </tr>
                                   </thead>
                                 `); 

        gridMedicamentos += (medicamentos.length > 0 ? `<tbody>` : ``);                                 

        for (const medicamento of medicamentos) { 
            gridMedicamentos += (`
            <tr class="text-left">
                <td class="text-secondary">${medicamento.codigoMaterial}</td>
                <td class="text-secondary">${medicamento.nomeMaterial}</td>
                <td class="text-secondary">${medicamento.validade ? _moment(medicamento.validade).format('DD/MM/YYYY') : '' }</td>
                <td class="text-secondary">${medicamento.lote}</td>                
                <td class="text-secondary">${medicamento.nomeFabricanteMaterial}</td>
                <td class="text-secondary">${medicamento.estoque}</td>
                <td class="text-secondary">${medicamento.unidade}</td>
            </tr>`);
        }   

        gridMedicamentos += (medicamentos.length > 0 ? `</tbody></table><br/>` : `</table><br/>`);

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
                            Medicamentos vencidos ou à vencer
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
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fabricante:  ${criteriosPesquisa.nomeFabricanteMaterial ? criteriosPesquisa.nomeFabricanteMaterial : "Todos os fabricantes"}
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
            
        this.print(tela, "", "Relatório-Medicamento-Vencido-Vencer", target);
        });
    }

    exportar(object: any, nomeEstabelecimento: string, criteriosPesquisa: any){        
        var data = [];

        this.medicamentoVencidoVencerService.carregaMedicamentoVencidoVencer(object.idProfissional, object.params)
        .subscribe((medicamentos) => { 
            
            data.push({ coluna1: 'Unidade: ' + nomeEstabelecimento, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            data.push({ coluna1: 'Medicamentos vencidos ou à vencer', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            
            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            
            data.push({ coluna1: 'CRITÉRIOS DE PESQUISA', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            data.push({ coluna1: 'Período: ' + (criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : '') + " à " + (criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : '') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            data.push({ coluna1: 'Unidade: ' + (criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : "Todas as unidades") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            data.push({ coluna1: 'Fabricante: ' + (criteriosPesquisa.nomeFabricanteMaterial ? criteriosPesquisa.nomeFabricanteMaterial : "Todos os fabricantes") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            data.push({ coluna1: 'Medicamento: ' + (criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : "Todos os medicamentos") , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});
            
            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});

            data.push({ coluna1: 'Código', 
                            coluna2: 'Medicamento',
                            coluna3: 'Validade',
                            coluna4: 'Lote', 
                            coluna5: 'Fabricante',
                            coluna6: 'Estoque',
                            coluna7: 'Unidade' });

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: ''});

            for (const medicamento of medicamentos) {  
                data.push({ coluna1: medicamento.codigoMaterial , 
                    coluna2: medicamento.nomeMaterial,
                    coluna3: (medicamento.validade ? _moment(medicamento.validade).format('DD/MM/YYYY') : ''),
                    coluna4: medicamento.lote,                                        
                    coluna5: medicamento.nomeFabricanteMaterial,
                    coluna6: medicamento.estoque,
                    coluna7: medicamento.unidade});
                }                    

            this.exportCsv(data,"Relatório-Medicamento-Vencido-Vencer" );
        });
    }
}