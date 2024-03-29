import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { NgbModalRef, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoTerapeuticoService } from './plano-terapeutico.service';
import { Paciente } from '../../_core/_models/Paciente';
import { PagerService } from '../../_core/_services';
import { Util } from '../../_core/_util/Util';
import { Router } from '@angular/router';
import { AgendaProfissional } from '../../_core/_models/AgendaProfissional';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { EventColor } from 'calendar-utils';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { isSameMonth } from 'date-fns';
import { isSameDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { startOfDay } from 'date-fns';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  profissional: {
    primary: '#1e90ff',
    secondary: '#00929c',
  },
  equipe: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-plano-terapeutico',
  templateUrl: './plano-terapeutico.component.html',
  styleUrls: ['./plano-terapeutico.component.css'],
  providers: [PlanoTerapeuticoService, DatePipe]
})
export class PlanoTerapeuticoComponent implements OnInit {
  @ViewChild('modalInfoAgendamento') modalInfoAgendamento: TemplateRef<any>;
  @ViewChild('modalAdicionarAgendamento') modalAdicionarAgendamento: TemplateRef<any>;
  @Input() public readonly: Boolean = false;
  loading: Boolean = false;
  view: string = 'month';
  selectedSchedule: any = null;
  dataAtual: string;
  selectedDate: Date;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>();
  modalRef: NgbModalRef = null;
  modalRefLocalizarPaciente: NgbModalRef = null;
  modalConsultaAgendamento: NgbModalRef = null;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  form: FormGroup;
  dadosAgendamento: any;
  paciente: Paciente = new Paciente();
  pacienteSelecionado: any = null;
  dataSelecionada: any;
  agendamentoSelecionado: any
  pageLimit = 10;
  idEstabelecimento: number
  allItems: any[];
  errors: any[] = [];
  pager: any = {};
  pagedItems: any[];
  fields: any[] = [];
  listaEquipe: any[] = []
  listaEspecialidade: any[] = []
  tipoAtendimento = [];
  formaAtendimento = [];
  object: AgendaProfissional = new AgendaProfissional();
  events: CalendarEvent[] = [];

  listaProfissional = [];

  //Mensagens
  mensagem = '';
  mensagemErro: string;
  msgAlert: any = [];

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      onClick: async ({ event }: { event: CalendarEvent }): Promise<void> => {
        this.editar(Number(event.id));
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.excluir(Number(event.id))
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private service: PlanoTerapeuticoService,
    private modalService: NgbModal,
    private pagerService: PagerService,
    private router: Router,
    private calendar: NgbCalendar) {
    this.selectedDate = new Date();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    for (const field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }

  }

  ngOnInit() {
    this.consultaAgendamentos();
    this.consultaEspecialidade();
    this.carregarFormaAtendimento();
    this.carregarTipoAtendimento();
    this.fomularioAgendamento()
    this.dataAtual = moment().format('YYYY-MM-DDTHH:mm')

    this.form.get('tipoAtendimento').valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      if (value == 1) {
        this.listaProfissionalDisponivel();
        this.form.get('idEquipe').clearValidators()
        this.form.get('idEquipe').updateValueAndValidity()
        this.form.patchValue({
          idEquipe: null
        })
      }
      if (value == 2) {
        this.listaEquipeDisponivel();
        this.form.patchValue({
          idProfissional: null
        })
        this.form.get('idProfissional').clearValidators()
        this.form.get('idProfissional').updateValueAndValidity()
      }
    });
    this.form.get('dataFinal').valueChanges.subscribe((result) => {
      const dtIn = this.form.get('dataInicial').value
      this.dataSelecionada = moment(dtIn).format('YYYY-MM-DDTHH:mm');
      const dtFim = result
      this.consultaAgendaPaciente(moment(dtIn), moment(dtFim));
      this.form.patchValue({ formaAtendimento: 1 })
    });

  }

  focoCampoData(value: string) {
    if (value == 'dataInicial') {
      const dtSelecionada = this.form.get('dataInicial').value;
      const dtAtual = moment(new Date).format('YYYY-MM-DDTHH:mm');
      if (dtSelecionada < dtAtual) {
        this.alerta('error', 'A data selecionada não pode ser menor que a data atual.', 5000)
        this.form.get('dataInicial').reset()
      }
    }
    if (value == 'dataFinal') {
      const dtSelecionada = this.form.get('dataFinal').value;
      const dataInicial = this.form.get('dataInicial').value;
      if (dtSelecionada < dataInicial) {
        this.alerta('error', 'A data selecionada não pode ser menor que a data Inicial.', 5000)
        this.form.get('dataFinal').reset()
      }
    }
  }



  alerta(tipo: string, msg: string, timeout: number): void {
    let type = '';
    if (tipo == 'error') {
      type = 'danger'
    }
    if (tipo == 'sucesso') {
      type = 'success'
    }
    if (tipo == 'informacao') {
      type = 'info'
    }

    this.msgAlert.push({
      type: type,
      msg: msg,
      timeout: 5000
    });
  }

  fomularioAgendamento() {
    this.form = this.fb.group({
      id: [''],
      nomePaciente: [''],
      idPaciente: ['', [Validators.required]],
      idEquipe: ['', [Validators.required]],
      idProfissional: ['', [Validators.required]],
      formaAtendimento: ['', [Validators.required]],
      tipoAtendimento: ['', [Validators.required,]],
      dataInicial: ['', [Validators.required,]],
      dataFinal: ['', [Validators.required,]],
      especialidade: ['', Validators.required],
      observacao: [''],
    });
  }




  limparFormulario() {
    this.form.reset();
  }

  salvar() {
    this.service.save(this.form.getRawValue(), 'agendamento').subscribe((result) => {
      this.mensagem = 'Agendamento salvo com sucesso'
      this.closeModal();
      this.consultaAgendamentos();
      this.limparFormulario();
      this.paciente = new Paciente
      this.allItems = []
    });
  }

  editar(value: number) {
    const id = value ? value : this.dadosAgendamento.idAgendamento;
    this.service.list(`agendamento/${id}`).subscribe((result) => {
      this.dadosAgendamento = result
      this.form.patchValue({
        id: this.dadosAgendamento.idAgendamento,
        idPaciente: this.dadosAgendamento.idPaciente,
        idEquipe: this.dadosAgendamento.idEquipe,
        idProfissional: this.dadosAgendamento.idProfissional,
        nomePaciente: this.dadosAgendamento.pacienteNome,
        formaAtendimento: this.dadosAgendamento.formaAtendimento,
        tipoAtendimento: this.dadosAgendamento.tipoAtendimento,
        dataInicial: moment(this.dadosAgendamento.dataInicial).format('YYYY-MM-DDTHH:mm'),
        dataFinal: moment(this.dadosAgendamento.dataFinal).format('YYYY-MM-DDTHH:mm'),
        observacao: this.dadosAgendamento.observacao
      });
      this.consultaPaciente(this.dadosAgendamento.idPaciente)
      this.openModalAgendamento()
    });
    this.modalConsultaAgendamento.dismiss()

  }

  excluir(value: number) {
    const idAgendamento = value ? value : this.dadosAgendamento.idAgendamento
    this.service.remove(Number(idAgendamento), 'agendamento').subscribe((result) => {
      this.consultaAgendamentos();
      this.closeModal()
    })
  }

  buscaPaciente() {
    let params = '';
    if (!Util.isEmpty(this.paciente)) {
      if (Object.keys(this.paciente).length) {
        for (const key of Object.keys(this.paciente)) {
          if (!Util.isEmpty(this.paciente[key])) {
            params += key + '=' + this.paciente[key] + '&';
          }
        }
        if (params != '') {
          params = '?' + params;
        }
      }
    }

    this.service.list('paciente' + params).subscribe(result => {
      this.allItems = result.items;
      this.setPage(1);
    }, erro => {
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  consultaEspecialidade() {
    this.service.list('especialidade').subscribe((result) => {
      this.listaEspecialidade = result;
    })
  }

  listaProfissionalDisponivel() {
    this.listaProfissional = []
    const dataInicial = moment(this.form.get('dataInicial').value).format("YYYY-MM-DD HH:mm:ss");
    const dataFinal = moment(this.form.get('dataFinal').value).format("YYYY-MM-DD HH:mm:ss");
    const idEspecialidade = this.form.get('especialidade').value;
    this.service.list(`profissional/agendamento/especialidade/${idEspecialidade}/${dataInicial}/${dataFinal}`).subscribe((result) => {
      if (result.length > 0) {
        this.listaProfissional = result;
      } else {
        this.alerta('error', 'Não há profissional disponível para a especialidade desejada na data selecionada.', 5000)
        this.form.get('tipoAtendimento').reset();
      }
    })
  }

  listaEquipeDisponivel() {
    this.listaEquipe = []
    const dataInicial = moment(this.form.get('dataInicial').value).format("YYYY-MM-DD HH:mm:ss");
    const dataFinal = moment(this.form.get('dataFinal').value).format("YYYY-MM-DD HH:mm:ss");
    const idEspecialidade = this.form.get('especialidade').value;
    const idEstabelecimento = this.pacienteSelecionado.idEstabelecimento;
    this.service.list(`equipe/agendamento/especialidade/${idEspecialidade}/${dataInicial}/${dataFinal}/${idEstabelecimento}`).subscribe((result) => {
      if (result.length > 0) {
        this.listaEquipe = result;
      } else {
        this.alerta('error', 'Não há equipe disponível para a especialidade desejada na data selecionada.', 5000);
        this.form.get('tipoAtendimento').reset();
      }
    })
  }

  // consultaProfissionalPorEquipe(value: number) {
  //   const idEquipe = value
  //   this.service.list(`profissional/equipe/${idEquipe}`).subscribe((result) => {
  //     this.listaProfissional = result;
  //   })
  // }

  // consultaProfissional() {
  //   this.listaProfissional = []
  //   const idEspecialidade = Number(this.form.get('especialidade').value);
  //   const novaDataInicial = moment(this.form.get('dataInicial').value);
  //   const novaDataFinal = moment(this.form.get('dataFinal').value);
  //   if (this.pacienteSelecionado) {
  //     this.idEstabelecimento = Number(this.pacienteSelecionado.idEstabelecimento);
  //   }
  //   //Cosnulta por estabelecimento e especialidade
  //   if (idEspecialidade) {
  //     this.service.list(`profissional/especialidade/${this.idEstabelecimento}/${idEspecialidade}`).subscribe((result) => {
  //       const listaProfissionais = result;
  //       listaProfissionais.forEach(item => {
  //         const idProfissional = item.id;
  //         this.service.list(`agendamento/profissional/${idProfissional}`).subscribe((result) => {
  //           const agendamentoProfissional = result;

  //           const conflitos = agendamentoProfissional.filter(agendamento =>
  //             (novaDataInicial >= moment(agendamento.dataInicial) && novaDataInicial < moment(agendamento.dataFinal)) ||
  //             (novaDataFinal > moment(agendamento.dataInicial) && novaDataFinal <= moment(agendamento.dataFinal)) ||
  //             (novaDataInicial <= moment(agendamento.dataInicial) && novaDataFinal >= moment(agendamento.dataFinal))
  //           );

  //           if (conflitos.length == 0) {
  //             this.listaProfissional.push(item);
  //           }
  //           console.log(this.listaProfissional)
  //         });
  //       });
  //     });
  //     return
  //   }

  //   //Consulta somente por estabelecimento
  //   this.service.list(`profissional/estabelecimento/${this.idEstabelecimento}`).subscribe((result) => {
  //     const listaProfissionais = result;
  //     //Logica para verificar o conflito de agenda dos profissionais
  //     listaProfissionais.forEach(item => {
  //       const idProfissional = item.id;
  //       this.service.list(`agendamento/profissional/${idProfissional}`).subscribe((result) => {
  //         const agendamentoProfissional = result;
  //         const conflitos = agendamentoProfissional.filter(agendamento =>
  //           (novaDataInicial >= moment(agendamento.dataInicial) && novaDataInicial < moment(agendamento.dataFinal)) ||
  //           (novaDataFinal > moment(agendamento.dataInicial) && novaDataFinal <= moment(agendamento.dataFinal)) ||
  //           (novaDataInicial <= moment(agendamento.dataInicial) && novaDataFinal >= moment(agendamento.dataFinal))
  //         );

  //         if (conflitos.length == 0) {
  //           this.listaProfissional.push(item);
  //         }
  //       });
  //     });
  //   });
  // }

  consultaAgendaPaciente(dataInicial: any, dataFinal: any) {
    this.mensagemErro = '';
    const idPaciente = Number(this.form.get('idPaciente').value);
    const novaDataInicial = moment(dataInicial);
    const novaDataFinal = moment(dataFinal);

    //verifica disponibilidade do agendamento do paciente para o dia informado.
    this.service.list(`agendamento/paciente/${idPaciente}`).subscribe((result) => {
      const AgendamentoPaciente = result;
      const conflitos = AgendamentoPaciente.filter(agendamento =>
        (novaDataInicial >= moment(agendamento.dataInicial) && novaDataInicial < moment(agendamento.dataFinal)) ||
        (novaDataFinal > moment(agendamento.dataInicial) && novaDataFinal <= moment(agendamento.dataFinal)) ||
        (novaDataInicial <= moment(agendamento.dataInicial) && novaDataFinal >= moment(agendamento.dataFinal))
      );

      if (conflitos.length > 0) {
        this.mensagemErro = 'Paciente possui agendamento para a data e hora informada.'
      }
    });
  };

  selecionaPaciente(item) {
    this.pacienteSelecionado = item;
  }

  confirmaPaciente() {
    this.form.patchValue({
      nomePaciente: this.pacienteSelecionado.nome,
      idPaciente: this.pacienteSelecionado.id
    });
    this.modalRefLocalizarPaciente.close();
    // this.buscaEquipe(this.pacienteSelecionado.idEstabelecimento);
  }

  // buscaEquipe(value: number) {
  //   const idEstabelecimento = value;
  //   this.service.list(`equipe/estabelecimento/${idEstabelecimento}`).subscribe((result) => {
  //     this.listaEquipe = result;
  //   })
  // }

  carregarFormaAtendimento() {
    this.service.list('agendamento/forma-atendimento/agendamento').subscribe((result) => {
      this.formaAtendimento = result;
    });
  }

  carregarTipoAtendimento() {
    this.service.list('agendamento/tipo-atendimento/agendamento').subscribe((result) => {
      this.tipoAtendimento = result
    });
  }

  consultaAgendamentos() {
    this.service.list('agendamento').subscribe((result) => {
      console.log(result)
      const eventosDoServico: CalendarEvent[] = result.map((evento) => {
        let color;
        if (evento.idEquipe) {
          color = { ...colors.equipe };
        }
        if (evento.idProfissional) {
          color = { ...colors.profissional };
        }
        return {
          id: evento.idAgendamento,
          title: evento.pacienteNome,
          start: new Date(evento.dataInicial),
          end: new Date(evento.dataFinal),
          color: color,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          actions: this.actions, // permite deletar e editar
        };
      });

      this.events = [...eventosDoServico];
      console.log(this.events)
    });
  }

  consultaAgendamentoId(id: number) {
    this.service.list(`agendamento/${id}`).subscribe((result) => {
      this.dadosAgendamento = result
      console.log(result)
    });
  }

  consultaPaciente(id: number) {
    this.service.list(`paciente/${id}`).subscribe((result) => {
      this.idEstabelecimento = result.idEstabelecimentoCadastro
      // this.consultaProfissional()
    })
  }

  formatarDataHora(dataString) {
    const data = new Date(dataString);
    const dataFormatada = data.toLocaleDateString();
    const horaFormatada = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { data: dataFormatada, hora: horaFormatada };
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.agendamentoSelecionado = event;
    console.log(this.agendamentoSelecionado)
    const idAgendamento = parseInt(this.agendamentoSelecionado.id)
    this.modalData = { event, action };
    this.openModalConsultaAgendamento(this.modalInfoAgendamento)
    this.consultaAgendamentoId(idAgendamento)
  }

  openModalConsultaAgendamento(content: any) {
    this.modalConsultaAgendamento = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  openModalAgendamento(): void {
    this.openModal(this.modalAdicionarAgendamento)
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  openModalLocalizarPaciente(content: any) {
    this.modalRefLocalizarPaciente = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  closeModalLocalizarPaciente() {
    this.modalRefLocalizarPaciente.dismiss()
    this.paciente = new Paciente
    this.allItems = []
  }

  closeModal() {
    this.modalRef.dismiss()
    this.limparFormulario()
  }

  setView(view: string) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  //Paginacao consulta paciente
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  loadQuantityPerPage(event) {
    const id = parseInt(event.target.value);
    this.pageLimit = id;
    this.setPage(1);
  }

  togglePaciente() {
    return Util.isEmpty(this.paciente.cartaoSus) && Util.isEmpty(this.paciente.nome);
  }
}
