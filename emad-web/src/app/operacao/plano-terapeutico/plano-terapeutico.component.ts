import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { NgbModalRef, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoTerapeuticoService } from './plano-terapeutico.service';
import { Paciente } from '../../_core/_models/Paciente';
import { PagerService } from '../../_core/_services';
import { Util } from '../../_core/_util/Util';
import { Router } from '@angular/router';
import { AgendaProfissional } from '../../_core/_models/AgendaProfissional';
import { environment } from '../../../environments/environment';
import {
  startOfDay,
  subDays,
  addDays,
  endOfDay,
  isSameMonth,
  isSameDay,
} from 'date-fns';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { EventColor, MonthView, getMonthView } from 'calendar-utils';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
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
  @ViewChild('contentScheduler') contentScheduler: TemplateRef<any>;
  @Input() public readonly: Boolean = false;

  view: string = 'month';
  selectedSchedule: any = null;
  currentDate: any;
  selectedDate: Date;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  refresh = new Subject<void>();
  modalRef: NgbModalRef = null;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  form: FormGroup;
  dadosAgendamento: any;
  paciente: Paciente = new Paciente();
  pacienteSelecionado: any = null;
  allItems: any[];
  errors: any[] = [];
  pager: any = {};
  pagedItems: any[];




  tipoAtendimento = [];
  formaAtendimento = [];

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>' + 'DENer',
      onClick: ({ event }: { event: CalendarEvent }): void => {
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
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
    this.fomularioAgendamento()
  }


  ngOnInit() {
    // this.loadDomains();
    // this.loadSchedule(null);
    this.getCurrent();
    this.consultaAgendamentos();
    this.carregarFormaAtendimento();
    this.carregarTipoAtendimento();
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

      this.allItems = result;
      this.setPage(1);

    }, erro => {
      this.errors = Util.customHTTPResponse(erro);
    });
  }
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  carregarFormaAtendimento() {
    this.service.list('agendamento/forma-atendimento/agendamento').subscribe((result) => {
      this.formaAtendimento = result;
      console.log(this.formaAtendimento)
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
      const eventosDoServico: CalendarEvent[] = result.map((evento) => ({
        id: evento.idAgendamento,
        title: evento.pacienteNome,
        start: new Date(evento.dataInicial),
        end: new Date(evento.dataFinal),
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        actions: this.actions, //permite deletar e editar
      }));

      this.events = [...eventosDoServico];

      console.log(this.events);
    });
  }

  formatarDataHora(dataString) {
    const data = new Date(dataString);
    const dataFormatada = data.toLocaleDateString();
    const horaFormatada = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


    return { data: dataFormatada, hora: horaFormatada };
  }

  fomularioAgendamento() {
    this.form = this.fb.group({
      idPaciente: ['', [Validators.required]],
      idEquipe: ['', [Validators.required]],
      idProfissional: ['', [Validators.required]],
      nomePaciente: ['', [Validators.required]],
      formaAtendimento: ['', [Validators.required]],
      tipoAtendimento: ['', [Validators.required,]],
      dataInicial: ['', [Validators.required,]],
      dataFinal: ['', [Validators.required,]],
      observacao: ['']
    });
  }

  salvar() {

  }

  consultaAgendamentoId(id: number) {
    this.service.list(`agendamento/${id}`).subscribe((result) => {
      this.dadosAgendamento = result
      console.log(result)
    })
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dados = event;
    console.log(dados)
    this.modalData = { event, action };
    this.openModal(this.modalInfoAgendamento)
    this.consultaAgendamentoId(Number(dados.id))
  }


  adicionarAgendamento(): void {
    this.openModal(this.contentScheduler)
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
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

  open(content: any) {
    /*this.object.idPaciente = null;
    this.object.pacienteNome = null;*/

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }




  getCurrent() {
    const dtAtual = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.currentDate = dtAtual;
    console.log(this.currentDate)
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

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    }
  ];
}
