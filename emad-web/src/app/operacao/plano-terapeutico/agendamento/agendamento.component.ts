// import { Component, OnInit } from '@angular/core';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';

// @Component({
//   selector: 'app-agendamento',
//   templateUrl: './agendamento.component.html',
//   styleUrls: ['./agendamento.component.css'],
// })
// export class AgendamentoComponent implements OnInit {
//   public dataAtual: Date = new Date();
//   public diasCalendario: Date[] = [];
//   public modalRef: NgbModalRef = null;
//   public nome: string = '';
//   public agendamento: AgendamentosModel
//   public form: FormGroup
//   // agendamentos: Map<string, string> = new Map<string, string>();

//   constructor(private modalService: NgbModal, private fb: FormBuilder) {
//     this.formulario()
//   }

//   ngOnInit() {
//    this.construirCalendario('value');
//   }

//   formulario(){
//     this.form = this.fb.group({
//     nomePaciente: ['', ''],
//     idPAciente: ['', ''],
//     tipoAtendimento: ['', ''],
//     profissional: ['', ''],
//     equipe: ['', ''],
//     dataAtendimento: ['', ''],
//     horarioAtendimento: ['', ''],
//     teleMedicina: ['', ''],
//     urlTelemedicina: ['', ''],
//     descricao: ['', ''],
//     });
//   }

//   open(content: any) {
//     this.modalRef = this.modalService.open(content, {
//       backdrop: 'static',
//       keyboard: false,
//       centered: true,
//       size: 'lg',
//     });
//   }

//   consultaAgendamentos(dataIncial: Date, dataFinal: Date){
//     const dtIni = moment(dataIncial).format('dd/mm/yyyy');
//     const dtFim = moment(dataFinal).format('dd/mm/yyyy');

//   }

//   construirCalendario(value: any) {
//     this.agendamento = new AgendamentosModel(
//       value.nomePaciente,
//       value.idPaciente,
//       value.tipoAtendimento,
//       value.dataAtendimento,
//       value.horarioAtendimento,
//       value.teleMedicina,
//       value.urlTelemedicina,
//       value.descricao
//       );

//     const ano = this.dataAtual.getFullYear();
//     const mes = this.dataAtual.getMonth();
//     const primeiroDiaDaSemana = 0;
//     const ultimoDiaDaSemana = 6;
//     const dataInicial = new Date(ano, mes, 1);

//     this.diasCalendario = [];

//     while (dataInicial.getDay() !== primeiroDiaDaSemana) {
//       dataInicial.setDate(dataInicial.getDate() - 1);
//     }

//     const dataFinal = new Date(ano, mes + 1, 0);
//     while (dataFinal.getDay() !== ultimoDiaDaSemana) {
//       dataFinal.setDate(dataFinal.getDate() + 1);
//     }

//     for (
//       let data = new Date(dataInicial.getTime());
//       data <= dataFinal;
//       data.setDate(data.getDate() + 1)
//     ) {
//       this.diasCalendario.push(new Date(data.getTime()));
//     }
//   }

//   // verificaAgendamento(data: Date){

//   // }

//   alterarMes(offsetMes: number) {
//     this.dataAtual.setMonth(this.dataAtual.getMonth() + offsetMes);
//     this.dataAtual = new Date(this.dataAtual.getTime());
//     this.construirCalendario(this.agendamento);
//   }

//   abrirModal(content: any, dia: Date) {
//     console.log('Dia clicado:', dia);
//     this.modalRef = this.modalService.open(content, {
//       backdrop: 'static',
//       keyboard: false,
//       centered: true,
//       size: 'lg',
//     });
//   }

//   salvar() {
//     const dadosAgendamento = this.form.getRawValue();
//     console.log(dadosAgendamento);
//     this.construirCalendario(dadosAgendamento);
//     this.modalRef.close();
//   }

//   atualizar(){}

//   excluir(){}
// }