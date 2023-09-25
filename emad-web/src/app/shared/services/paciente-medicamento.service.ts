import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import { RelatorioMedicamentoService } from './relatorio-medicamento.service';
import { PacienteMedicamentoService } from '../../farmacia/relatorios/paciente-medicamento/paciente-medicamento.service';

@Injectable()
export class PacienteMedicamentoImpressaoService extends RelatorioMedicamentoService {
    constructor(private pacienteMedicamentoService: PacienteMedicamentoService) {
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
        }</style>`;
    }

    imprimir(object: any, nomeEstabelecimento: string, criteriosPesquisa: any, target: string = '_blank') {

        this.pacienteMedicamentoService.carregaPacientePorMedicamento(object.params)
        .subscribe((medicamentos) => {
        let gridMedicamentos = '';
        let rodapeTotalizador = '';

        rodapeTotalizador +=
        `<table class="table table-striped">
            <tbody>
                <td style="width:41%"> Total de receitas: ${medicamentos.totalGeralReceitas}</td>
                <td style="width:59%; text-align: right;">Total geral de retiradas: ${medicamentos.totalGeralRetiradas}</td>
            </tbody>
        </table>`;

        for (const medicamentoCarregado of medicamentos.listaMateriais) {

            gridMedicamentos += (`<div class="col s12" style="text-align: left;">
                                      <span style="font-weight:bold"> Medicamento: </span><span>${medicamentoCarregado.codigoMaterial + ' - ' + medicamentoCarregado.nomeMaterial}</span>
                                   </div>
                                   <table class="table table-striped">
                                   <thead>
                                       <tr style="text-align: center;">
                                           <th style="width:8%">Paciente</th>
                                           <th style="width:22%">Endereço</th>
                                           <th style="width:8%">Telefone</th>
                                           <th style="width:8%">Lote</th>
                                           <th style="width:22%">Fornecedor/Fabricante</th>
                                           <th style="width:8%">Validade</th>
                                           <th style="width:8%">Data de retirada</th>
                                           <th style="width:8%">Qtd. de retirada</th>
                                           <th style="width:8%">Nome estabelecimento</th>
                                       </tr>
                                   </thead>
                                 `);

            gridMedicamentos += (medicamentoCarregado.pacientesMaterial.length > 0 ? `<tbody>` : ``);

            for (const itemMedicamento of medicamentoCarregado.pacientesMaterial) {
                gridMedicamentos += (`
                <tr class="text-left">
                    <td class="text-secondary">${itemMedicamento.nomePaciente}</td>
                    <td class="text-secondary">${itemMedicamento.enderecoPaciente}</td>
                    <td class="text-secondary">${itemMedicamento.telefonePaciente}</td>
                    <td class="text-secondary">${itemMedicamento.lote}</td>
                    <td class="text-secondary">${itemMedicamento.nomeFabricanteMaterial}</td>
                    <td class="text-secondary">${itemMedicamento.validade ? _moment(itemMedicamento.validade).format('DD/MM/YYYY') : '' }</td>
                    <td class="text-secondary">${itemMedicamento.dataMovimento ? _moment(itemMedicamento.dataMovimento).format('DD/MM/YYYY') : '' }</td>
                    <td class="text-secondary">${itemMedicamento.quantidade}</td>
                    <td class="text-secondary">${itemMedicamento.nomeEstabelecimento}</td>

                </tr>`);
            }
            gridMedicamentos += (`
                <tr">
                    <td colspan="2"> Medicamentos dispensados por lote por paciente: ${medicamentoCarregado.medicamentosPorUnidade}</td>
                    <td colspan="6" style="text-align: right;">Total qtd. retirada: ${medicamentoCarregado.qtdRetirada}</td>
                </tr>`);

            gridMedicamentos += (medicamentoCarregado.length > 0 ? `</tbody></table><br/>` : `</table><br/>`);
        }

        const tela = `
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
                            Pacientes por medicamento
                        </div>
                    </div>
                    <hr size = 7>
                    <div class="row">
                        &nbsp;&nbsp;&nbsp;&nbsp;<b>CRITÉRIOS DE PESQUISA</b>
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Período: ${criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : ''} à ${criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : ''}
                        </div>
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidade: ${criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : 'Todas as unidades'}
                        </div>
                        <div class="col s4">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medicamento: ${criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : 'Todos os medicamentos'}
                        </div>
                        <div class="col s4">
                        Lote: ${criteriosPesquisa.lote ? criteriosPesquisa.lote : 'Todos os lotes'}
                        </div>
                        <div class="col s4">
                        Fabricante: ${criteriosPesquisa.nomeFabricanteMaterial ? criteriosPesquisa.nomeFabricanteMaterial : 'Todos os fabricantes'}
                        </div>
                    </div>
                    <hr size = 7>
                    <br/>
                    <div class="row">
                        ${gridMedicamentos}
                    </div>
                    <br/>
                    <div class="row">
                        ${rodapeTotalizador}
                    </div>
                </form>
            </div>
        </div>`;

        this.print(tela, '', 'Relatorio-Paciente-Medicamento', target);
        });
    }

    exportar(object: any, nomeEstabelecimento: string, criteriosPesquisa: any) {
        const data = [];

        this.pacienteMedicamentoService.carregaPacientePorMedicamento(object.params)
        .subscribe((medicamentos) => {

            data.push({ coluna1: 'Unidade: ' + nomeEstabelecimento, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});
            data.push({ coluna1: 'Pacientes por medicamento', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

            data.push({ coluna1: 'CRITÉRIOS DE PESQUISA', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});
            data.push({ coluna1: 'Período: ' + (criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : '') + ' à ' + (criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : '') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});
            data.push({ coluna1: 'Unidade: ' + (criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : 'Todas as unidades') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});
            data.push({ coluna1: 'Medicamento: ' + (criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : 'Todos os medicamentos') ,
                        coluna2: 'Lote: ' + (criteriosPesquisa.lote ? criteriosPesquisa.lote : 'Todos os lotes') ,
                        coluna3: 'Fabricante: ' + (criteriosPesquisa.nomeFabricanteMaterial ? criteriosPesquisa.nomeFabricanteMaterial : 'Todos os fabricantes') ,
                        coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

            for (const medicamentoCarregado of medicamentos.listaMateriais) {

                data.push({ coluna1: 'Medicamento: ' + medicamentoCarregado.codigoMaterial + ' - ' + medicamentoCarregado.nomeMaterial, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '' , coluna8: '', coluna9: ''});

                data.push({ coluna1: 'Paciente',
                            coluna2: 'Endereço',
                            coluna3: 'Telefone',
                            coluna4: 'Lote',
                            coluna5: 'Fornecedor/Fabricante',
                            coluna6: 'Validade',
                            coluna7: 'Data de retirada',
                            coluna8: 'Qtd. de retirada' ,
                            coluna9: 'Estabelecimento' });

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

                for (const itemMedicamento of medicamentoCarregado.pacientesMaterial) {

                    data.push({ coluna1: itemMedicamento.nomePaciente,
                            coluna2: itemMedicamento.enderecoPaciente,
                            coluna3: itemMedicamento.telefonePaciente,
                            coluna4: itemMedicamento.lote,
                            coluna5: itemMedicamento.nomeFabricanteMaterial,
                            coluna6: (itemMedicamento.validade ? _moment(itemMedicamento.validade).format('DD/MM/YYYY') : '' ),
                            coluna7: (itemMedicamento.dataMovimento ? _moment(itemMedicamento.dataMovimento).format('DD/MM/YYYY') : '' ),
                            coluna8: itemMedicamento.quantidade,
                            coluna9: itemMedicamento.nomeEstabelecimento});
                }

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});

                data.push({ coluna1: 'Medicamentos dispensados por lote por paciente: ' + medicamentoCarregado.medicamentosPorUnidade,
                            coluna2: '',
                            coluna3: '',
                            coluna4: '',
                            coluna5: '',
                            coluna6: '',
                            coluna7: '',
                            coluna8: 'Total qtd. retirada: ' + medicamentoCarregado.qtdRetirada,
                            coluna9: '', });

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: '', coluna7: '', coluna8: '', coluna9: ''});
            }

            data.push({ coluna1: 'Total de medicamentos dispensados por lote: ' + medicamentos.totalGeralReceitas,
            coluna2: '',
            coluna3: '',
            coluna4: '',
            coluna5: '',
            coluna6: '',
            coluna7: '',
            coluna8: 'Total geral de retiradas: ' + medicamentos.totalGeralRetiradas,
            coluna9: '', });

            this.exportCsv(data, 'Relatorio-Paciente-Medicamento');
        });
    }
}
