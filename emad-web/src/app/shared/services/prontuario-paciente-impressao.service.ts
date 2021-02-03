import { Injectable } from "@angular/core";
import { PacienteService } from "../../cadastro/paciente/paciente.service";
import * as _moment from 'moment';
import { environment } from "../../../environments/environment";
import { RelatorioProntuarioPacienteService } from "./prontuario-paciente.service";

@Injectable()
export class ProntuarioPacienteImpressaoService extends RelatorioProntuarioPacienteService {

    pathFiles = `${environment.apiUrl}/fotos/`;

    constructor(private pacienteService: PacienteService) {
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

            .row {
                margin-top: 2%;
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

        .avatar-container{
            height: unset !important;
            width: unset !important;
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

    imprimir(idPaciente: number, target: string = '_blank') {
        this.pacienteService.obterProntuarioPacienteRelatorio(idPaciente)
            .subscribe((result) => {
                let sinaisVitais = '';
                let atendimentos = '';
                let receitas = '';
                let fichasAtendimento = '';
                let exames = '';
                let hipoteseDiagnostica = '';
                let vacinas = '';
                let procedimentos = '';

                if (result.sinaisVitais) {
                    sinaisVitais += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:16%">Pressão arterial</th>
                                                <th style="width:16%">Pulso</th>
                                                <th style="width:16%">Saturação</th>
                                                <th style="width:16%">Temperatura</th>
                                                <th style="width:16%">Peso</th>
                                                <th style="width:17%">Data</th>   
                                                </tr>
                                            </thead>`

                    sinaisVitais += (result.sinaisVitais.length > 0 ? `<tbody>` : ``);

                    result.sinaisVitais.forEach(sinais => {

                        sinaisVitais += `<tr class="text-left">
                                        <td class="text-secondary">${sinais.pressaoArterial ? sinais.pressaoArterial : ''}</td>
                                        <td class="text-secondary">${sinais.pulso ? sinais.pulso : ''}</td>
                                        <td class="text-secondary">${sinais.saturacao ? sinais.saturacao : ''}</td>
                                        <td class="text-secondary">${sinais.temperatura ? sinais.temperatura : ''}</td>
                                        <td class="text-secondary">${sinais.peso ? sinais.peso : ''}</td>
                                        <td class="text-secondary">${sinais.label ? sinais.label : ''}</td>
                                    </tr>`


                    });

                    sinaisVitais += (result.sinaisVitais.length > 0 ? `</tbody></table></div>` : `</table></div>`);
                }

                if (result.atendimentos) {
                    result.atendimentos.forEach(atendimento => {
                        let atividadesAtendimento = ""

                        atividadesAtendimento += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:50%">Data</th>
                                                <th style="width:50%">Atividade</th>   
                                                </tr>
                                            </thead>`

                        atividadesAtendimento += (atendimento.historicos.length > 0 ? `<tbody>` : ``);

                        atendimento.historicos.forEach(atividade => {
                            atividadesAtendimento += `<tr class="text-left">
                                                        <td class="text-secondary">${atividade.dataHistorico}</td>
                                                        <td class="text-secondary"> Profissional: ${atividade.nomeProfissional} executou ${atividade.nomeTipoHistorico}</td>
                                                      </tr>`
                        });

                        atividadesAtendimento += (atendimento.historicos.length > 0 ? `</tbody></table></div>` : `</table></div>`);

                        atendimentos += `<div class="col s12">
                                            <span> <b>ID do Atendimento</b>: ${atendimento.id}</span>
                                            <span> <b>Unidade</b>: ${atendimento.estabelecimentoNome}</span>
                                            <span> <b>Tipo de atendimento</b>: ${atendimento.fichaNome}</span>
                                            <span> <b>Situação atual</b>: ${atendimento.situacaoNome}</span>
                                            <span> <b>Motivo da queixa</b>: ${atendimento.motivoQueixa}</span>
                                            ${atividadesAtendimento}
                                        </div>`
                    });
                }

                if (result.receitas) {

                    result.receitas.forEach(receita => {
                        let itensReceita = "";

                        itensReceita += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:13%">Código do material</th>
                                                <th style="width:21%">Descrição do material</th>
                                                <th style="width:12%">Qtd. prescrita</th>
                                                <th style="width:12%">Tempo tratamento</th> 
                                                <th style="width:12%">Qtd. dispensada</th>
                                                <th style="width:14%">Data últ. dispensação</th> 
                                                <th style="width:14%">Observação</th>    
                                                </tr>
                                            </thead>`

                        itensReceita += (receita.itensReceita.length > 0 ? `<tbody>` : ``);


                        receita.itensReceita.forEach(itens => {
                            itensReceita += `<tr class="text-left">
                                                <td class="text-secondary">${itens.codigoMaterial}</td>
                                                <td class="text-secondary">${itens.nomeMaterial}</td>
                                                <td class="text-secondary">${itens.qtdPrescrita}</td>
                                                <td class="text-secondary">${itens.tempoTratamento}</td>
                                                <td class="text-secondary">${itens.qtdDispAnterior}</td>
                                                <td class="text-secondary">${itens.dataUltDisp ? _moment(itens.dataUltDisp).format('DD/MM/YYYY HH:mm') : ''}</td>
                                                <td class="text-secondary">${itens.observacao ? itens.observacao : ''}</td>
                                            </tr>`
                        });

                        itensReceita += (receita.itensReceita.length > 0 ? `</tbody></table></div>` : `</table></div>`);

                        receitas += `<div class="col s12">
                                        <span> <b>Estabelecimento</b>: ${receita.nomeEstabelecimento}</span>
                                        <span> <b>Profissional</b>: ${receita.nomeProfissional}</span>
                                        <span> <b>Ano</b>: ${receita.ano}</span>
                                        <span> <b>Número</b>: ${receita.numero}</span>
                                        <span> <b>Situação</b>: ${receita.situacaoNome}</span>
                                        <span> <b>Data emissão</b>: ${receita.dataEmissao ? _moment(receita.dataEmissao).format('DD/MM/YYYY HH:mm') : ''}</span>
                                        ${itensReceita}
                                </div>`
                    });

                }

                if (result.fichasAtendimento) {
                    fichasAtendimento += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:14%">Atendimento</th>
                                                <th style="width:14%">Tipo de atendimento</th>
                                                <th style="width:14%">Classificação de risco</th>
                                                <th style="width:14%">Queixa</th>
                                                <th style="width:14%">Situação</th>
                                                <th style="width:14%">Data</th>
                                                <th style="width:14%">Estabelecimento</th>   
                                                </tr>
                                            </thead>`

                    fichasAtendimento += (result.fichasAtendimento.length > 0 ? `<tbody>` : ``);

                    result.fichasAtendimento.forEach(ficha => {
                        fichasAtendimento += `<tr class="text-left">
                                                <td class="text-secondary">${ficha.id}</td>
                                                <td class="text-secondary">${ficha.fichaNome}</td>
                                                <td class="text-secondary">${ficha.classificacaoNome}</td>
                                                <td class="text-secondary">${ficha.motivoQueixa}</td>
                                                <td class="text-secondary">${ficha.situacaoNome}</td>
                                                <td class="text-secondary">${ficha.dataCriacao ? _moment(ficha.dataCriacao).format('DD/MM/YYYY HH:mm') : ''}</td>
                                                <td class="text-secondary">${ficha.estabelecimentoNome}</td>
                                            </tr>`
                    });

                    fichasAtendimento += (result.fichasAtendimento.length > 0 ? `</tbody></table></div>` : `</table></div>`);
                }

                if (result.exames) {
                    exames += `<div class="col s12">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                    <th style="width:5%">Exame</th>
                                    <th style="width:15%">Tipo de exame</th>
                                    <th style="width:16%">Profissional</th>
                                    <th style="width:16%">Situação</th>
                                    <th style="width:16%">Resultado</th>
                                    <th style="width:16%">Data</th>
                                    <th style="width:16%">Estabelecimento</th>   
                                    </tr>
                                </thead>`

                    exames += (result.exames.length > 0 ? `<tbody>` : ``);

                    result.exames.forEach(exame => {
                        exames += `<tr class="text-left">
                                        <td class="text-secondary">${exame.id}</td>
                                        <td class="text-secondary">${exame.nomeTipoExame}</td>
                                        <td class="text-secondary">${exame.nomeProfissional}</td>
                                        <td class="text-secondary">${exame.situacaoNome}</td>
                                        <td class="text-secondary">${exame.resultadoNome}</td>
                                        <td class="text-secondary">${exame.dataCriacao ? _moment(exame.dataCriacao).format('DD/MM/YYYY HH:mm') : ''}</td>
                                        <td class="text-secondary">${exame.estabelecimentoNome}</td>
                                    </tr>`
                    });

                    exames += (result.exames.length > 0 ? `</tbody></table></div>` : `</table></div>`);
                }

                if (result.hipoteseDiagnostica) {
                    hipoteseDiagnostica += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:25%">Código</th>
                                                <th style="width:25%">Diagnóstico</th>
                                                <th style="width:25%">CID 10</th>
                                                <th style="width:25%">Data</th>   
                                                </tr>
                                            </thead>`

                    hipoteseDiagnostica += (result.hipoteseDiagnostica.length > 0 ? `<tbody>` : ``);

                    result.hipoteseDiagnostica.forEach(hipotese => {
                        hipoteseDiagnostica += `<tr class="text-left">
                                                    <td class="text-secondary">${hipotese.codigo}</td>
                                                    <td class="text-secondary">${hipotese.nome}</td>
                                                    <td class="text-secondary">${hipotese.cid_10}</td>
                                                    <td class="text-secondary">${hipotese.dataCriacao ? _moment(hipotese.dataCriacao).format('DD/MM/YYYY HH:mm') : ''}</td>
                                                </tr>`
                    });

                    hipoteseDiagnostica += (result.hipoteseDiagnostica.length > 0 ? `</tbody></table></div>` : `</table></div>`);
                }

                if (result.vacinas) {
                    vacinas += `<div class="col s12">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                    <th style="width:20%">Estabelecimento</th>
                                    <th style="width:15%">Profissional</th>
                                    <th style="width:10%">Código material</th>
                                    <th style="width:25%">Descrição do material</th>
                                    <th style="width:8%">Qtd. prescrita</th>   
                                    <th style="width:8%">Qtd. dispensada</th>   
                                    <th style="width:35%">Data últ. dispensação</th>   
                                    </tr>
                                </thead>`

                    vacinas += (result.vacinas.length > 0 ? `<tbody>` : ``);

                    result.vacinas.forEach(vacina => {
                        vacinas += `<tr class="text-left">
                                        <td class="text-secondary">${vacina.nomeEstabelecimento}</td>
                                        <td class="text-secondary">${vacina.nomeProfissional}</td>
                                        <td class="text-secondary">${vacina.codigo}</td>
                                        <td class="text-secondary">${vacina.descricao}</td>
                                        <td class="text-secondary">${vacina.qtdPrescrita}</td>
                                        <td class="text-secondary">${vacina.qtdDispAnterior}</td>
                                        <td class="text-secondary">${vacina.dataUltDisp ? _moment(vacina.dataUltDisp).format('DD/MM/YYYY HH:mm') : ''}</td>
                                    </tr>`
                    });

                    vacinas += (result.vacinas.length > 0 ? `</tbody></table></div>` : `</table></div>`);

                }

                if (result.procedimentos) {
                    procedimentos += `<div class="col s12">
                                            <table class="table table-striped">
                                                <thead>
                                                <tr>
                                                <th style="width:20%">Estabelecimento</th>
                                                <th style="width:20%">Profissional</th>
                                                <th style="width:20%">Código</th>
                                                <th style="width:20%">Nome</th>
                                                <th style="width:20%">Data emissão</th>
                                                </tr>
                                            </thead>`

                    procedimentos += (result.procedimentos.length > 0 ? `<tbody>` : ``);

                    result.procedimentos.forEach(procedimento => {
                        procedimentos += `<tr class="text-left">
                                                <td class="text-secondary">${procedimento.nomeFantasia}</td>
                                                <td class="text-secondary">${procedimento.nome}</td>
                                                <td class="text-secondary">${procedimento.co_procedimento}</td>
                                                <td class="text-secondary">${procedimento.no_procedimento}</td>
                                                <td class="text-secondary">${procedimento.dataCriacao ? _moment(procedimento.dataCriacao).format('DD/MM/YYYY HH:mm') : ''}</td>
                                            </tr>`
                    });

                    procedimentos += (result.procedimentos.length > 0 ? `</tbody></table></div>` : `</table></div>`);
                }

                let conteudo = `
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
                                    Unidade: ${result.estabelecimento.nomeFantasia}               
                                    </div>
                                </div>
                                <hr size = 7>
                                <div class="row">
                                    <div class="col" style="text-align: center;width: 100%;">
                                    <span style="font-family: Arial; font-size: 18px; font-weight:bold"> Prontuário Paciente</span>
                                    </div>
                                </div>
                                <br/>
                                <div class="row">
                                    <div class="col s3">
                                        <span> Cartão SUS: ${result.paciente[0].cartaoSus ? result.paciente[0].cartaoSus : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Id SAP: ${result.paciente[0].idSap ? result.paciente[0].idSap : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Paciente: ${result.paciente[0].nome ? result.paciente[0].nome : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Nome Social: ${result.paciente[0].nomeSocial ? result.paciente[0].nomeSocial : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Apelido: ${result.paciente[0].apelido ? result.paciente[0].apelido : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Nome da mãe: ${result.paciente[0].nomeMae ? result.paciente[0].nomeMae : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Nome do pai: ${result.paciente[0].nomePai ? result.paciente[0].nomePai : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Data de nascimento: ${result.paciente[0].dataNascimento ? result.paciente[0].dataNascimento : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Sexo: ${result.paciente[0].sexo == 1 ? 'Masculino' : 'Feminino'}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Nacionalidade: ${result.paciente[0].nacionalidadeNome ? result.paciente[0].nacionalidadeNome : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Naturalidade: ${result.paciente[0].naturalidadeNome ? result.paciente[0].naturalidadeNome : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> CPF: ${result.paciente[0].cpf ? result.paciente[0].cpf : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Ocupação: ${result.paciente[0].ocupacao ? result.paciente[0].ocupacao : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Escolaridade: ${result.paciente[0].escolaridadeNome ? result.paciente[0].escolaridadeNome : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Estabelecimento: ${result.estabelecimento.nomeFantasia ? result.estabelecimento.nomeFantasia : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Observações: ${result.paciente[0].observacao ? result.paciente[0].observacao : ''}</span>
                                    </div>
                                    <div class="col s3">
                                        <span> Falecido: ${result.paciente[0].falecido == 0 ? 'Não' : 'Sim'}</span>
                                    </div>
                                    <div class="col s4">
                                        <span> Situação: ${result.paciente[0].situacao == 1 ? 'Ativo' : 'Inativo'}</span>
                                    </div>
                                </div>
                                <hr size = 7>
                                <div class="row">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">História progressa/familiar</span>
                                    </div>
                                    <div class="col s12">
                                        <span> História progressa/familiar: ${result.paciente[0].historiaProgressaFamiliar ? result.paciente[0].historiaProgressaFamiliar : 'Nada consta'}</span>
                                    </div>
                                </div>
                                <hr size = 7>
                                <div class="row">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Sinais Vitais</span>
                                    </div>
                                    ${sinaisVitais}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Atendimentos</span>
                                    </div>
                                    ${atendimentos}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Procedimentos</span>
                                    </div>
                                    ${procedimentos}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Medicamentos</span>
                                    </div>
                                    ${receitas}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Fichas de atendimento</span>
                                    </div>
                                    ${fichasAtendimento}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Exames</span>
                                    </div>
                                    ${exames}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Hipótese diagnosticada</span>
                                    </div>
                                    ${hipoteseDiagnostica}
                                </div>
                                <hr size = 7>
                                <div class="row" style="break-inside: avoid;">
                                    <div class="col" style="text-align: left;width: 100%;">
                                        <span style="font-family: Arial; font-size: 18px; font-weight:bold">Vacinas</span>
                                    </div>
                                    ${vacinas}
                                </div>
                            </form>
                        </div>
                    </div>`

                //trecho para renderizar
                // <div class="col s2">
                //<div class="avatar-container">
                //<img width="180" height="180" style="max-width: 100%; border-radius: 50%;" src="${this.pathFiles + result.paciente[0].foto}">
                //</div>
                //</div>

                this.print(conteudo, target, result.paciente[0].nome);
            });
    }
}
