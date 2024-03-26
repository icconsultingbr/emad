import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import { ExameService } from './exame.service';
import { RelatorioReciboExameService } from './relatorio-recibo-exame.service';

@Injectable()
export class ReciboExameImpressaoService extends RelatorioReciboExameService {

    resultadoFinal = [
        { id: 1, nome: 'Amostra não reagente' },
        { id: 2, nome: 'Amostra reagente' },
        { id: 3, nome: 'Não realizado' }
    ];

    constructor(private exameService: ExameService) {
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
        #signaturetitle {
            text-align: center;
            font-weight: bold;
            font-size: 100%;
          }

          #signature {
            text-align: center;
            height: 30px;
            word-spacing: 1px;
            padding-top: 3%;
          }
                      </style>`;

        this.script = `<script>
            $(document).ready(function(){
            $('.date').mask('00/00/0000');
            $('.cpf').mask('000.000.000-00');
            $('.cnpj').mask('00.000.000/0000-00');
            });
                       </script>`;
    }

    imprimir(exameId: number, target: string = '_blank') {
        this.exameService.obterRelatorioExame(exameId)
            .subscribe((result) => {
                let dadosAssinatura = '';
                let tela = '';
                let exame = '';
                const ano = new Date(result.dataCriacao).getFullYear();
                const resultado = this.resultadoFinal.find(x => x.id == result.resultado);
                if (result.itensExame.length == 0) {
                    exame += (`
                    <div class="row" style="text-align: left;width: 100%;">
                        <div class="col s3">
                            <span style="font-family: Arial; font-size: 18px; font-weight:bold">Solicitação de exame:</span>
                        </div>
                        <div class"col s9">
                            <span style="font-family: Arial; font-size: 18px; font-weight:bold"> ${result.tipoExame.nome}</span>
                        </div>               
                    </div>
                    <br>
                    <div class="row" style="text-align: left; width: 100%;">
                        <div class="col s3">
                            <span style="font-family: Arial; font-size: 18px; font-weight: bold;">Descrição da Solicitação:</span>
                        </div>
                        <div class="col s9" style="font-family: Arial; font-size: 18px; word-wrap: break-word;">
                            ${result.descricaoSolicitacaoExame}
                        </div>               
                    </div>
                    <br>
                    <div class="row" style="text-align: left; width: 100%;">
                        <div class="col s3">
                            <span style="font-family: Arial; font-size: 18px; font-weight: bold;">Local:</span>
                        </div>
                        <div class="col s9" style="font-family: Arial; font-size: 18px; word-wrap: break-word;">
                            ${result.local}
                        </div>               
                    </div>
                    <br>
                    <div class="row" style="text-align: left; width: 100%;">
                        <div class="col s3">
                            <span style="font-family: Arial; font-size: 18px; font-weight: bold;">Data do agendamento:</span>
                        </div>
                        <div class="col s9" style="font-family: Arial; font-size: 18px; word-wrap: break-word;">
                            ${result.dataAgendamento ? _moment(result.dataAgendamento).format('DD/MM/YYYY') : ' ' }
                        </div>               
                    </div>
                    `)
                }
                if (result.itensExame.length > 0) {
                    exame += (`<div class="col" style="text-align: left;width: 100%;">
                                   <span style="font-family: Arial; font-size: 18px; font-weight:bold">Exame para ${result.tipoExame.nome}</span>
                                </div>
                                <div class="col s12">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th style="width:35%">Nome do produto</th>
                                        <th style="width:30%">Método</th>
                                        <th style="width:35%">Resultado do teste</th>
                                    </tr>
                                    </thead>
                                         `);

                    exame += (result.itensExame.length > 0 ? `<tbody>` : ``);

                    result.itensExame.forEach(item => {
                        exame += (`
                        <tr class="text-left">
                            <td class="text-secondary">${item.nomeProdutoExame}</td>
                            <td class="text-secondary">${item.nomeMetodoExame}</td>
                            <td class="text-secondary">${item.nomeResultado}</td>
                        </tr>`);
                    });

                    exame += (result.itensExame.length > 0 ? `</tbody></table></div>` : `</table></div>`);

                    exame += `<div class="col s12" style="text-align: left;width: 100%; padding-top: 1%;">
                                        <span style="font-family: Arial; font-size: 14px; font-weight:bold">INTERPRETAÇÃO DO RESULTADO: ${resultado.nome}</span>
                                </div>`;
                }

                dadosAssinatura = `<br/>
                                    <br/>
                                    <div class="row">
                                        <div id="signaturetitle">
                                            ASSINATURA/CARIMBO RESPONSÁVEL TÉCNICO, EM ${_moment(new Date()).format('DD/MM/YYYY')}
                                        </div>

                                        <div id="signature">
                                                _________________________________________________________________________
                                        </div>
                                    </div>`;

                tela += `<div class="page">
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
                                                Unidade: ${result.estabelecimento.nomeFantasia}
                                            </div>
                                            <div class="col s8" style="text-align: right; color: #7d0000; font-weight:bold">
                                                Exame
                                            </div>
                                        </div>
                                        <hr size = 7>
                                        <div class="row">
                                            <div class="col" style="text-align: center;width: 100%;">
                                                <span style="font-family: Arial; font-size: 18px; font-weight:bold"> Número do exame: ${result.id}</span>
                                            </div>
                                        </div>
                                        <br/>
                                        <div class="row">
                                            <div class="col s3">
                                                <span> Paciente: ${result.nomePaciente}</span>
                                            </div>
                                            <div class="col s3">
                                                <span> Cartão SUS: ${result.paciente.cartaoSus}</span>
                                            </div>
                                            <div class="col s3">
                                                <span> Data de nascimento: ${result.paciente.dataNascimento ? result.paciente.dataNascimento : ' '} (${result.paciente.pacienteIdade} anos)</span>
                                            </div>
                                            <div class="col s3">
                                                <span> Id SAP: ${result.paciente.idSap}</span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col s3">
                                                <span> Prescritor: ${result.profissional.nome}</span>
                                            </div>
                                            <div class="col s3">
                                                <span> Data da prescrição: ${result.dataCriacao ? _moment(result.dataCriacao).format('DD/MM/YYYY') : ' '}</span>
                                            </div>
                                        </div>
                                        <hr size = 7>
                                        <div class="row">
                                            ${exame}
                                        </div>
                                        ${dadosAssinatura}
                                    </form>
                                </div>
                            </div>`;

                this.print(tela, result.id);
            });
    }
}
