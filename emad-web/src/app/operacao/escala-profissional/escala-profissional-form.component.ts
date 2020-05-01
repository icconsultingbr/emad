import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../../_core/_util/Util';
import { Router } from '@angular/router';
import { EscalaProfissionalService } from './escala-profissional.service';
import { EscalaProfissional } from '../../_core/_models/EscalaProfissional';

@Component({
  selector: 'app-escala-profissional-form',
  templateUrl: './escala-profissional-form.component.html',
  styleUrls: ['./escala-profissional-form.component.css'],
  providers: [EscalaProfissionalService]
})
export class EscalaProfissionalFormComponent implements OnInit {

  //MESSAGES
  loading: Boolean = false;
  message: String = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method: String = "escala-profissional";
  fields: any[] = [];
  historicoAtribuicoes: any[] = [];
  object: EscalaProfissional = new EscalaProfissional();
  domains: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: EscalaProfissionalService,
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

  removeAtribuicao(item) {
    this.service.removeAtribuicao(item.id).subscribe(result => {
      this.message = "Atribuição removida com sucesso!"
      this.loading = false;
      this.clearAtribuicao();
    });
  }

  saveAtribuicao() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveAtribuicao(this.object).subscribe(result => {
      this.message = "Atribuição inserida com sucesso!"
      this.loading = false;
      this.clearAtribuicao();           
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
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

  carregarCanetasDisponiveis() {
    if (!Util.isEmpty(this.form.value.horarioInicial) && !Util.isEmpty(this.form.value.horarioFinal) && !Util.isEmpty(this.form.value.dataAtribuicao))
    {     
        var periodoinicial = new Date(this.form.value.dataAtribuicao.getFullYear(),
                               this.form.value.dataAtribuicao.getMonth(),                                
                               this.form.value.dataAtribuicao.getDate(),                               
                               this.form.value.horarioInicial.substring(2,0),
                               this.form.value.horarioInicial.substring(3),
                               0);

        var periodofinal = new Date(this.form.value.dataAtribuicao.getFullYear(),
                               this.form.value.dataAtribuicao.getMonth(),                                
                               this.form.value.dataAtribuicao.getDate(),                               
                               this.form.value.horarioFinal.substring(2,0),
                               this.form.value.horarioFinal.substring(3),
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

        this.loading = true;
        this.service.list('caneta/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id + '/' +  this.form.value.dataAtribuicao  + '/' + this.form.value.horarioInicial + '/' + this.form.value.dataAtribuicao + '/' + this.form.value.horarioFinal).subscribe(result => {
        this.domains[0].idCaneta = result;
        
        this.findHistoricoAtribuicoesPorProfissional(this.form.value.dataAtribuicao, this.form.value.horarioInicial, this.form.value.dataAtribuicao, this.form.value.horarioFinal);

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });

    }
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  back() {
    this.router.navigate([this.method]);
  }
}