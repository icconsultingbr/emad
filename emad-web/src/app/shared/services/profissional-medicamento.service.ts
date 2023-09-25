import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import { RelatorioMedicamentoService } from './relatorio-medicamento.service';
import { ProfissionalMedicamentoService } from '../../farmacia/relatorios/profissional-medicamento/profissional-medicamento.service';

@Injectable()
export class ProfissionalMedicamentoImpressaoService extends RelatorioMedicamentoService {
    constructor(private profissionalMedicamentoService: ProfissionalMedicamentoService) {
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

        this.profissionalMedicamentoService.carregaProfissionalPorMedicamento(object.params)
        .subscribe((medicamentos) => {
        let gridMedicamentos = '';
        const rodapeTotalizador = '';

        for (const medicamentoCarregado of medicamentos.listaMateriais) {

            gridMedicamentos += (`<div class="col s12" style="text-align: left;">
                                      <span style="font-weight:bold"> Medicamento: </span><span>${medicamentoCarregado.codigoMaterial + ' - ' + medicamentoCarregado.nomeMaterial}</span>
                                   </div>
                                   <table class="table table-striped">
                                   <thead>
                                       <tr style="text-align: center;">
                                           <th style="width:10%">Inscrição</th>
                                           <th style="width:35%">Nome</th>
                                           <th style="width:20%">Especialidade profissional</th>
                                           <th style="width:10%">Qtd. prescrita</th>
                                           <th style="width:10%">Qtd. dispensada</th>
                                           <th style="width:15%">Nome estabelecimento</th>
                                       </tr>
                                   </thead>
                                 `);

            gridMedicamentos += (medicamentoCarregado.profissionaisMaterial.length > 0 ? `<tbody>` : ``);

            for (const itemMedicamento of medicamentoCarregado.profissionaisMaterial) {
                gridMedicamentos += (`
                <tr class="text-left">
                    <td class="text-secondary">${itemMedicamento.inscricaoProfissional}</td>
                    <td class="text-secondary">${itemMedicamento.nomeProfissional}</td>
                    <td class="text-secondary">${itemMedicamento.nomeEspecialidade}</td>
                    <td class="text-secondary">${itemMedicamento.qtdPrescrita}</td>
                    <td class="text-secondary">${itemMedicamento.qtdDispensada}</td>
                    <td class="text-secondary">${itemMedicamento.nomeFantasia}</td>
                </tr>`);
            }
            gridMedicamentos += (`
                <tr">
                    <td colspan="4" style="text-align: right;"> Total prescrito: ${medicamentoCarregado.totalQtdPrescrita}</td>
                    <td colspan="2" style="text-align: left;"> Total dispensado: ${medicamentoCarregado.totalQtdDispensada}</td>
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
                            Profissionais por medicamento
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
                        <div class="col s12">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Medicamento: ${criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : 'Todos os medicamentos'}
                        </div>
                    </div>
                    <hr size = 7>
                    <br/>
                    <div class="row">
                        ${gridMedicamentos}
                    </div>
                </form>
            </div>
        </div>`;

        this.print(tela, '', 'Relatorio-Profissional-Medicamento', target);
        });
    }

    exportar(object: any, nomeEstabelecimento: string, criteriosPesquisa: any) {
        const data = [];

        this.profissionalMedicamentoService.carregaProfissionalPorMedicamento(object.params)
        .subscribe((medicamentos) => {

            data.push({ coluna1: 'Unidade: ' + nomeEstabelecimento, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});
            data.push({ coluna1: 'Profissionais por medicamento', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

            data.push({ coluna1: 'CRITÉRIOS DE PESQUISA', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});
            data.push({ coluna1: 'Período: ' + (criteriosPesquisa.dataInicial ? _moment(criteriosPesquisa.dataInicial).format('DD/MM/YYYY') : '') + ' à ' + (criteriosPesquisa.dataFinal ? _moment(criteriosPesquisa.dataFinal).format('DD/MM/YYYY') : '') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});
            data.push({ coluna1: 'Unidade: ' + (criteriosPesquisa.nomeEstabelecimento ? criteriosPesquisa.nomeEstabelecimento : 'Todas as unidades') , coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});
            data.push({ coluna1: 'Medicamento: ' + (criteriosPesquisa.nomeMaterial ? criteriosPesquisa.nomeMaterial : 'Todos os medicamentos') ,
                        coluna2: '',
                        coluna3: '',
                        coluna4: '', coluna5: '', coluna6: ''});

            data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

            for (const medicamentoCarregado of medicamentos.listaMateriais) {

                data.push({ coluna1: 'Medicamento: ' + medicamentoCarregado.codigoMaterial + ' - ' + medicamentoCarregado.nomeMaterial, coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

                data.push({ coluna1: 'Inscrição',
                            coluna2: 'Nome',
                            coluna3: 'Especialidade',
                            coluna4: 'Qtd. prescrita',
                            coluna5: 'Qtd, dispensada',
                            coluna6: 'Estabelecimento' });

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

                for (const itemMedicamento of medicamentoCarregado.profissionaisMaterial) {

                    data.push({ coluna1: itemMedicamento.inscricaoProfissional,
                            coluna2: itemMedicamento.nomeProfissional,
                            coluna3: itemMedicamento.nomeEspecialidade,
                            coluna4: itemMedicamento.qtdPrescrita,
                            coluna5: itemMedicamento.qtdDispensada,
                            coluna6: itemMedicamento.nomeFantasia});
                }

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});

                data.push({ coluna1: '',
                            coluna2: '',
                            coluna3: '',
                            coluna4: 'Total prescrito: ' + medicamentoCarregado.totalQtdPrescrita,
                            coluna5: 'Total dispensado: ' + medicamentoCarregado.totalQtdDispensada,
                            coluna6: '', });

                data.push({ coluna1 : '', coluna2: '', coluna3: '', coluna4: '', coluna5: '', coluna6: ''});
            }

            this.exportCsv(data, 'Relatorio-Profissional-Medicamento');
        });
    }
}
