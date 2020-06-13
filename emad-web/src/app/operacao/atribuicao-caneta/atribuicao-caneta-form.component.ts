import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtribuicaoCanetaService } from './atribuicao-caneta.service';
import { Paciente } from '../../_core/_models/Paciente';
import { PagerService } from '../../_core/_services';
import { Util } from '../../_core/_util/Util';
import { Router } from '@angular/router';
import { AgendaProfissional } from '../../_core/_models/AgendaProfissional';
import { environment } from "../../../environments/environment";
import { AtendimentoService } from '../atendimento/atendimento.service';
import { AtribuicaoCaneta, AtribuicaoCanetaHorario } from '../../_core/_models/AtribuicaoCaneta';
import { EscalaProfissionalService } from '../escala-profissional/escala-profissional.service';

@Component({
  selector: 'app-atribuicao-caneta-form',
  templateUrl: './atribuicao-caneta-form.component.html',
  styleUrls: ['./atribuicao-caneta-form.component.css'],
  providers: [AtribuicaoCanetaService, AtendimentoService, EscalaProfissionalService]
})
export class AtribuicaoCanetaFormComponent implements OnInit {

  //MESSAGES
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method: string = "atribuicao-caneta";
  url: string = "atribuicoes-canetas";
  fields: any[] = [];
  historicoAtribuicoes: any[] = [];
  object: AtribuicaoCaneta = new AtribuicaoCaneta();
  domains: any[] = [];
  horarios: AtribuicaoCanetaHorario = new AtribuicaoCanetaHorario();
  public today = new Date();

  constructor(
    private fb: FormBuilder,
    private service: AtribuicaoCanetaService,
    private serviceEscala: EscalaProfissionalService,
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  ngOnInit() {
    this.loadDomains();
    this.buscaProfissionais();   
    this.createGroup();
  }

  clear() {
    this.historicoAtribuicoes = [];
    this.object.idProfissional = 0;
  }

  clearAtribuicao() {    
    this.object.idCaneta = 0;  
    this.object.periodoInicial = null;
    this.object.periodoFinal = null;
    this.carregarCanetasDisponiveis();
  }

  findHistoricoAtribuicoesPorProfissional(dateInicial, horaInicial, dateFinal, horaFinal) {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHistoricoAtribuicaoByProfissional(this.object.idProfissional, dateInicial, horaInicial, dateFinal, horaFinal).subscribe(result => {
      this.historicoAtribuicoes = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  findHorarioEscalaPorProfissional(anoMes, diaSemana) {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.serviceEscala.carregaEscalaProfissionalAnoMes(this.object.idProfissional, anoMes).subscribe(result => {

      if(result[0])        
      {
        switch(diaSemana) { 
          case 0: {              
              this.horarios.horarioInicial = result[0].domingoHorarioInicial;
              this.horarios.horarioFinal = result[0].domingoHorarioFinal;
            break; 
          } 
          case 1: { 
              this.horarios.horarioInicial = result[0].segundaHorarioInicial;
              this.horarios.horarioFinal = result[0].segundaHorarioFinal;
            break; 
          } 
          case 2: { 
              this.horarios.horarioInicial = result[0].tercaHorarioInicial;
              this.horarios.horarioFinal = result[0].tercaHorarioFinal;
            break; 
          } 
          case 3: { 
              this.horarios.horarioInicial = result[0].quartaHorarioInicial;
              this.horarios.horarioFinal = result[0].quartaHorarioFinal;
            break; 
          } 
          case 4: { 
              this.horarios.horarioInicial = result[0].quintaHorarioInicial;
              this.horarios.horarioFinal = result[0].quintaHorarioFinal;
            break; 
          } 
          case 5: { 
              this.horarios.horarioInicial = result[0].sextaHorarioInicial;
              this.horarios.horarioFinal = result[0].sextaHorarioFinal;
            break; 
          } 
          case 6: { 
              this.horarios.horarioInicial = result[0].sabadoHorarioInicial;
              this.horarios.horarioFinal = result[0].sabadoHorarioFinal;
            break; 
         }
          default: { 
            this.horarios.horarioInicial = "";
            this.horarios.horarioFinal = "";
             break; 
          } 
       }
            
      }
      this.loading = false;
      this.carregarCanetasDisponiveis();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  removeAtribuicao(item) {
    this.service.removeAtribuicao(item.id).subscribe(result => {
      this.message = "Atribuição removida com sucesso!"
      this.loading = false;
      this.object.idCaneta = 0;  
      this.carregarCanetasDisponiveis();
    });
  }

  saveAtribuicao() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    if (Util.isEmpty(this.object.periodoInicial) || Util.isEmpty(this.object.periodoFinal))
    {
      this.errors = [{message:"O período informado é inválido"}];
      this.loading = false;
      return;
    }

    if (this.object.idCaneta <= 0 || this.object.idCaneta.toString() == "null")
    {
      this.errors = [{message:"Obrigatório selecionar a caneta"}];
      this.loading = false;
      return;
    }

    this.serviceEscala.carregaAusenciaPorProfissional(this.object.idProfissional).subscribe(result => {      
      if (result[0])
      {
        result.forEach(element => {
          if(this.object.periodoInicial >= element.periodoInicialCompleto && this.object.periodoInicial <= element.periodoFinalCompleto)
          {
            this.errors = [{message:"Atribuição não foi realizada, pois a data encontra-se dentro do período de ausência da escala do profissional - (" 
              + element.periodoInicial + " - " + element.periodoFinal + ")" + " - Tipo da ausência: "+ element.nomeTipoAusencia  } ];
            this.loading = false;
            return;
          }
        });
        
        if(this.errors.length>0)
            return;
      }      

      this.service.saveAtribuicao(this.object).subscribe(result => {
          this.message = "Atribuição inserida com sucesso!"
          this.loading = false;
          this.clearAtribuicao();           
        }, error => {
          this.loading = false;
          this.errors = Util.customHTTPResponse(error);
        });

    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
      return;
    });   
  }

  loadDomains() {
    this.domains.push({
      equipe: [
        { id: "EMAD", nome: "EMAD" },
        { id: "EMAP", nome: "EMAP" }
      ],
      idEquipe: [],
      idCaneta: []
    });  
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [Validators.required],
      dataAtribuicao: ['', ''],
      horarioInicial: ['', ''],
      horarioFinal: ['', ''],
      idEquipe: ['', ''],
      idCaneta: ['', ''],
      equipe: ['', ''],
      idProfissional: ['', ''],
      historiaProgressa: ['', ''],
      exameFisico: ['', ''],
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      idEstabelecimento: [Validators.required],
      tipoFicha: [Validators.required],
    });
  }

  buscaProfissionais() {
    this.loading = true;
       this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
        this.domains[0].idProfissional = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  carregarHorarios()
  {
    this.horarios.horarioInicial = "";
    this.horarios.horarioFinal = "";

    var teste = this.horarios.dataAtribuicao;

    if(!Util.isEmpty(this.horarios.dataAtribuicao))
    {
      var ano = new Date(this.horarios.dataAtribuicao).getFullYear();
      var mes = (new Date(this.horarios.dataAtribuicao).getMonth() + 1).toString();      
      var anoMes = ano + mes.padStart(2,'0');

      var diaSemana = new Date(this.horarios.dataAtribuicao).getDay();
      
      this.findHorarioEscalaPorProfissional(anoMes, diaSemana);
    }    
  }

  carregarCanetasDisponiveis() {
    this.object.idCaneta = 0;
    this.domains[0].idCaneta = [];
    if (!Util.isEmpty(this.horarios.horarioInicial) && !Util.isEmpty(this.horarios.horarioFinal) && !Util.isEmpty(this.horarios.dataAtribuicao))
    {     
        var periodoinicial = new Date(this.horarios.dataAtribuicao.getFullYear(),
                               this.horarios.dataAtribuicao.getMonth(),                                
                               this.horarios.dataAtribuicao.getDate(),                               
                               parseInt(this.horarios.horarioInicial.substring(2,0)),
                               parseInt(this.horarios.horarioInicial.substring(3)),
                               0);

        var periodofinal = new Date(this.horarios.dataAtribuicao.getFullYear(),
                               this.horarios.dataAtribuicao.getMonth(),                                
                               this.horarios.dataAtribuicao.getDate(),                               
                               parseInt(this.horarios.horarioFinal.substring(2,0)),
                               parseInt(this.horarios.horarioFinal.substring(3)),
                               0);

        var dateInicialFormatada;
        var dateFinalFormatada;

        dateInicialFormatada = periodoinicial.getFullYear() + "-" + this.twoDigits(1 + periodoinicial.getMonth()) + "-" + 
        this.twoDigits(periodoinicial.getDate()) + " " + 
        this.twoDigits(periodoinicial.getHours()) + ":" + 
        this.twoDigits(periodoinicial.getMinutes()) + ":" + 
        this.twoDigits(periodoinicial.getSeconds());
    
          dateFinalFormatada = periodofinal.getFullYear() + "-" + this.twoDigits(1 + periodofinal.getMonth()) + "-" + 
                                                         this.twoDigits(periodofinal.getDate()) + " " + 
                                                         this.twoDigits(periodofinal.getHours()) + ":" + 
                                                         this.twoDigits(periodofinal.getMinutes()) + ":" + 
                                                         this.twoDigits(periodofinal.getSeconds());

        this.object.periodoInicial = dateInicialFormatada;
        this.object.periodoFinal = dateFinalFormatada;

        var dataAtribuicao = periodoinicial.getFullYear() + "-" + this.twoDigits(1 + periodoinicial.getMonth()) + "-" + this.twoDigits(periodoinicial.getDate());

        this.loading = true;
        this.service.list('caneta/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id 
        + '?dataInicial=' +  dataAtribuicao  
        + '&horaInicial=' + this.horarios.horarioInicial 
        + '&dataFinal=' + dataAtribuicao 
        + '&horaFinal=' + this.horarios.horarioFinal).subscribe(result => {
        this.domains[0].idCaneta = result;
        
        this.findHistoricoAtribuicoesPorProfissional(dataAtribuicao, this.horarios.horarioInicial, dataAtribuicao, this.horarios.horarioFinal);
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });

    }
    else if(!Util.isEmpty(this.horarios.dataAtribuicao))
    {
      var dataAtribuicao = this.horarios.dataAtribuicao.getFullYear() + "-" + this.twoDigits(1 + this.horarios.dataAtribuicao.getMonth()) + "-" + this.twoDigits(this.horarios.dataAtribuicao.getDate());
      this.findHistoricoAtribuicoesPorProfissional(dataAtribuicao, "00:00", dataAtribuicao, "23:59");
    }
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  back() {
    this.router.navigate([this.url]);
  }
}