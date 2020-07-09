import { Injectable } from "@angular/core";
import { RelatorioService } from "./relatorio.service";
import * as _moment from 'moment';
import { ReceitaService } from "../receita.service";

@Injectable()
export class ReciboReceitaImpressaoService extends RelatorioService{
    constructor(private receitaService: ReceitaService){
        super();

        this.style = `<style type="text/css">

        @page { size: auto;  margin: 5mm; }

        .hidden-button{
            display: block;
        }

        @media print {
            .hidden-button{
                display: none;
            }
        }

        .margin-collapse {
            margin: 20 !important;
        }

        .collapsible-header {
            background-color: #00929c;
            font-size: 16px;
            border-radius: 10px;
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
        
        input[type=text]{
            height: 2.5rem;
            color:rgba(0, 0, 0, 1) !important;
            font-size: 13px !important;
        }
        
        .input-field label{
            font-size: 0.7rem;
        }

        .cor_topo {            
            color: #000000;
        }

        .collapsible-body p{
            padding: 0.2rem;
            font-size: 13px !important;
        }

    </style>`
        
        this.script = `<script>
            $(document).ready(function(){
            $('.money').maskMoney({
                prefix:'R$ ', 
                allowNegative: true, 
                thousands:'.', 
                decimal:',', 
                affixesStay: true
            });

            $('.percentage').maskMoney({
                suffix:'%', 
                allowNegative: true, 
                thousands:'.', 
                decimal:',', 
                affixesStay: true
            });
            $('.date').mask('00/00/0000');
            $('.cpf').mask('000.000.000-00');
            $('.cnpj').mask('00.000.000/0000-00');

            $('.percentage').each(function(){ // function to apply mask on load!
                 let val = $(this).val();

                 if(val.indexOf('.')< 0){
                     val = val + '.00';
                 }

                 console.log(val);

                 $(this).maskMoney('mask', val);
                
                 if(val.indexOf('null') >= 0){
                    $(this).val('0,00' + '%');
                    return;
                 }

                 if(val.indexOf('.00') >= 0){
                     val =  val.replace('.', ',') + '%';
                    $(this).val(val);
                    return;
                 }
                 if( val.split('.')[val.split('.').length-1].length <2){
                     console.log(val.split('.')[val.split('.').length-1]);
                     val = val.replace('.',',') + '0' + '%';
                    $(this).val(val);
                 }
             });


             $('.money').each(function(){ // function to apply mask on load!
                let val = $(this).val();

                if(val.indexOf('.')< 0){
                    val = val + '.00';
                }

                console.log(val);

                $(this).maskMoney('mask', val);
               
                if(val.indexOf('null') >= 0){
                   $(this).val('R$ '+ '0,00');
                   return;
                }

                if(val.indexOf('.00') >= 0){
                    val = 'R$ '+ val.replace('.', ',');
                   $(this).val(val);
                   return;
                }
                if( val.split('.')[val.split('.').length-1].length <2){
                    console.log(val.split('.')[val.split('.').length-1]);
                    val = 'R$ '+ val.replace('.',',') + '0';
                   $(this).val(val);
                }
            });

            $("#form :input").prop("disabled", true);

            });
        </script>`
    }

    imprimir(ano: number, idEstabelecimento: number, numero: number){
        this.receitaService.obterRelatorio(ano, idEstabelecimento, numero)
        .subscribe((result) => { 
        let cabecalhoMedicamento = '';        
        let dadosEstoque = '';
        
        
        for (const itemReceita of result.itensReceita) {      
            cabecalhoMedicamento += (`<div class="col s6" style="text-align: left;">
                                      <span style="font-weight:bold"> Material/Medicamento: </span><span>${itemReceita.codigoMaterial} - ${itemReceita.nomeMaterial}</span>
                                   </div>
                                   <div class="col s2" style="text-align: left;">
                                      <span style="font-weight:bold"> Qtde. prescrita: </span><span>${itemReceita.qtdPrescrita}</span>
                                   </div>
                                   <div class="col s2" style="text-align: left;">
                                      <span style="font-weight:bold"> Qtde. disp anterior: </span><span>${itemReceita.qtdDispAnterior}</span>
                                   </div>
                                   <div class="col s2" style="text-align: left;">
                                      <span style="font-weight:bold"> Qtde. dispensada: </span><span>${itemReceita.qtdDispMes}</span>
                                   </div> 
                                   
                                   <table class="table table-striped">
                                   <thead>
                                   <tr>
                                     <th>Lote</th>
                                     <th>Fabricante</th>
                                     <th>Validade</th>
                                     <th>Qtde. dispensada</th>
                                     <th>Dispensado por</th>   
                                     <th>Data da dispensação</th>   
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

        let tela = `<form class="container" id="form" style="font-size: 12px;">
        <div class="row hidden-button" style="margin-bottom: 10px !important;">
            <a class="waves-effect waves-light btn" style="float:right; margin-right:1%" onclick="window.print()">Imprimir</a>
        </div>
        <div class="row">
            <div class="col s4" style="margin-top:20px;">
                <img style="width:60%; float:left; margin-left:10px;" src="${window.location.origin}${window.location.pathname}/assets/imgs/logo_relatorio.png">
            </div>                    
            <div class="col s8" style="margin-top:40px;text-align: right; color: #7d0000; font-weight:bold">
                Unidade: ${result.nomeEstabelecimento}               
            </div>           
            <div class="col s8" style="text-align: right; color: #7d0000; font-weight:bold">                
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
                <span> Prescritor: ${result.nomeProfissional}</span>
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
    </form>`

        this.print(tela);
        });
    }
}