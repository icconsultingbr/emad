import { Injectable } from '@angular/core';
import { RelatorioService } from './relatorio.service';
import * as _moment from 'moment';
import { ReceitaService } from './receita.service';

@Injectable()
export class ReciboReceitaImpressaoService extends RelatorioService {
    constructor(private receitaService: ReceitaService) {
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
    </style>`;

        this.script = `<script>
            $(document).ready(function(){
            $('.date').mask('00/00/0000');
            $('.cpf').mask('000.000.000-00');
            $('.cnpj').mask('00.000.000/0000-00');
            });
        </script>`;
    }

    imprimir(ano: number, idEstabelecimento: number, numero: number, farmacia: boolean, target: string = '_blank') {
        this.receitaService.obterRelatorio(ano, idEstabelecimento, numero)
        .subscribe((result) => {
        let cabecalhoMedicamento = '';
        const dadosEstoque = '';
        let dadosAssinatura = '';

        for (const itemReceita of result.itensReceita) {
            cabecalhoMedicamento += (`<div class="col s6" style="text-align: left;">
                                      <span style="font-weight:bold"> Material/Medicamento: </span><span>${itemReceita.codigoMaterial} - ${itemReceita.nomeMaterial}</span>
                                   </div>
                                   <div class="col s2" style="text-align: left;">
                                      <span style="font-weight:bold"> Qtde. prescrita: </span><span>${itemReceita.qtdPrescrita}</span>
                                   </div>
                                   <div class="col s2" style="text-align: left;">
                                      <span style="font-weight:bold"> Qtde. dispensada: </span><span>${itemReceita.qtdDispAnterior}</span>
                                   </div>
                                   <div class="col s12" style="text-align: left;">
                                      <span style="font-weight:bold"> Posologia: </span><span>${itemReceita.observacao}</span>
                                   </div>
                                   <table class="table table-striped">
                                   <thead>
                                   <tr>
                                     <th style="width:20%">Lote</th>
                                     <th style="width:35%">Fabricante</th>
                                     <th style="width:10%">Validade</th>
                                     <th style="width:10%">Qtde. dispensada</th>
                                     <th style="width:15%">Dispensado por</th>
                                     <th style="width:10%">Data da dispensação</th>
                                   </tr>
                                 </thead>
                                 `);

                cabecalhoMedicamento += (itemReceita.itensEstoque.length > 0 ? `<tbody>` : ``);

            for (const itemEstoque of itemReceita.itensEstoque) {

                cabecalhoMedicamento += (`
                <tr class="text-left">
                    <td class="text-secondary">${itemEstoque.lote}</td>
                    <td class="text-secondary">${itemEstoque.nome}</td>
                    <td class="text-secondary">${itemEstoque.validade ? _moment(itemEstoque.validade).format('DD/MM/YYYY') : '' }</td>
                    <td class="text-secondary">${itemEstoque.quantidade}</td>
                    <td class="text-secondary">${itemEstoque.nomeUsuario}</td>
                    <td class="text-secondary">${itemEstoque.dataUltDis ? _moment(itemEstoque.dataUltDis).format('DD/MM/YYYY HH:mm') : '' }</td>
                </tr>`);
            }

            cabecalhoMedicamento += (itemReceita.itensEstoque.length > 0 ? `</tbody></table>` : `</table>`);
        }

        if (farmacia) {
            dadosAssinatura = `<br/>
                               <br/>
                               <div class="row">
                                    <div class="col s6" style="text-align:right;">
                                        <span>Recebi e conferi os medicamentos listados acima e suas quantidades, em ${_moment(new Date()).format('DD/MM/YYYY')} </span>
                                    </div>
                                    <div class="col s6">
                                        <span>__________________________________________________________</span>
                                    </div>
                               </div>`;
        }

        let tela = `
        <div class="page">
            <div class="content">
                <form class="container" id="form" style="font-size: 12px;">
                    <div class="row hidden-button" style="margin-bottom: 10px !important;">
                        <a class="waves-effect waves-light btn" style="float:right; margin-right:1%" onclick="window.print()">Imprimir</a>
                    </div>
                    <div class="row">
                        <div class="col s2" style="margin-top:20px;">
                            <img style="width:50%; float:left;" src="${window.location.origin}${window.location.pathname}/assets/imgs/logotipo-e-atende.png">
                        </div>
                        <div class="col s8" style="margin-top:40px;text-align: center; color: #7d0000; font-weight:bold">
                            ${result.titulo ? result.titulo : ''} </br>
                            ${result.subtitulo ? result.subtitulo : ''}</br>
                            ${result.descricao ? result.descricao : ''}
                        </div>
                        <div class="col s2" style="margin-top:40px;text-align: right; color: #7d0000; font-weight:bold">
                            Unidade: ${result.nomeEstabelecimento}
                        </div>
                        <div class="col s2" style="text-align: right; color: #7d0000; font-weight:bold">
                            Recibo da receita
                        </div>
                    </div>
                    <hr size = 7>
                    <div class="row">
                        <div class="col" style="text-align: center;width: 100%;">
                            <span style="font-family: Arial; font-size: 18px; font-weight:bold"> Número da receita: ${result.ano}-${result.idEstabelecimento}-${result.numero}</span>
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col s3">
                            <span> Paciente: ${result.nomePaciente}</span>
                        </div>
                        <div class="col s3">
                            <span> Cartão SUS: ${result.cartaoSusPaciente}</span>
                        </div>
                        <div class="col s3">
                            <span> Data de nascimento: ${result.dataNascimento ? _moment(result.dataNascimento).format('DD/MM/YYYY') : ' ' } (${result.pacienteIdade} anos)</span>
                        </div>
                        <div class="col s3">
                            <span> Id SAP: ${result.idSap}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s3">
                            <span> Prescritor: ${result.nomeProfissional ? result.nomeProfissional : result.nomeProfissionalExterno}</span>
                        </div>
                        <div class="col s3">
                            <span> Data da prescrição: ${result.dataEmissao ? _moment(result.dataEmissao).format('DD/MM/YYYY') : ' ' }</span>
                        </div>
                    </div>
                    <hr size = 7>
                    <div class="row">
                        ${cabecalhoMedicamento}
                    </div>
                    <div class="row">
                        ${dadosEstoque}
                    </div>
                    ${dadosAssinatura}
                </form>
            </div>
        </div>`;

    if (farmacia) {
        tela += `
        <div class="page">
            <div class="content">
                <form class="container" id="form" style="font-size: 12px;">
                <div class="row">
                        <div class="col s2" style="margin-top:20px;">
                            <img style="width:50%; float:left;" src="${window.location.origin}${window.location.pathname}/assets/imgs/logotipo-e-atende.png">
                        </div>
                        <div class="col s8" style="margin-top:40px;text-align: center; color: #7d0000; font-weight:bold">
                            ${result.titulo ? result.titulo : ''} </br>
                            ${result.subtitulo ? result.subtitulo : ''}</br>
                            ${result.descricao ? result.descricao : ''}
                        </div>
                        <div class="col s2" style="margin-top:40px;text-align: right; color: #7d0000; font-weight:bold">
                            Unidade: ${result.nomeEstabelecimento}
                        </div>
                        <div class="col s2" style="text-align: right; color: #7d0000; font-weight:bold">
                            Recibo da receita
                        </div>
                    </div>
                <hr size = 7>
                <div class="row">
                    <div class="col" style="text-align: center;width: 100%;">
                        <span style="font-family: Arial; font-size: 18px; font-weight:bold"> Número da receita: ${result.ano}-${result.idEstabelecimento}-${result.numero}</span>
                    </div>
                </div>
                <br/>
                <div class="row">
                    <div class="col s3">
                        <span> Paciente: ${result.nomePaciente}</span>
                    </div>
                    <div class="col s3">
                        <span> Cartão SUS: ${result.cartaoSusPaciente}</span>
                    </div>
                    <div class="col s3">
                        <span> Data de nascimento: ${result.dataNascimento ? _moment(result.dataNascimento).format('DD/MM/YYYY') : ' ' } (${result.pacienteIdade} anos)</span>
                    </div>
                    <div class="col s3">
                        <span> Id SAP: ${result.idSap}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col s3">
                        <span> Prescritor: ${result.nomeProfissional ? result.nomeProfissional : result.nomeProfissionalExterno}</span>
                    </div>
                    <div class="col s3">
                        <span> Data da prescrição: ${result.dataEmissao ? _moment(result.dataEmissao).format('DD/MM/YYYY') : ' ' }</span>
                    </div>
                </div>
                <hr size = 7>
                <div class="row">
                    ${cabecalhoMedicamento}
                </div>
                <div class="row">
                    ${dadosEstoque}
                </div>
                ${dadosAssinatura}
            </form>
        </div>
    </div>`;
    }

        this.print(tela, target, ano, idEstabelecimento, numero);
        });
    }
}
