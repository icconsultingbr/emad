import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbCalendarIslamicUmalqura } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../../_core/_util/Util';
import { Router, ActivatedRoute } from '@angular/router';
import { EscalaProfissionalService } from './escala-profissional.service';
import { EscalaProfissional, EscalaProfissionalAnoMes } from '../../_core/_models/EscalaProfissional';
import { AusenciaProfissional } from '../../_core/_models/AusenciaProfissional';

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
  ausenciaProfissional: AusenciaProfissional = new AusenciaProfissional();
  fields: any[] = [];
  object: EscalaProfissional = new EscalaProfissional();
  mes: EscalaProfissionalAnoMes = new EscalaProfissionalAnoMes();
  domains: any[] = [];
  allItemsAusencia: any[] = [];
  idProfissional: Number;

  constructor(
    private fb: FormBuilder,
    private service: EscalaProfissionalService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idProfissional = params['id'];

      this.loadDomains();
      this.buscaProfissionais(); 
      this.createGroup();      

      if (!Util.isEmpty(this.idProfissional)) {
        this.object.idProfissional = this.idProfissional;
        this.carregaAusenciaPorProfissional();
      }
    });
  }


  clear() {
    this.clearEscala();
    this.clearAusencia();
  }

  clearEscala() {         
    this.mes.idMesEscala = 0;
    this.object.domingoHorarioInicial = "";
    this.object.domingoHorarioFinal = "";
    this.object.segundaHorarioInicial = "";
    this.object.segundaHorarioFinal = "";
    this.object.tercaHorarioInicial = "";
    this.object.tercaHorarioFinal = "";
    this.object.quartaHorarioInicial = "";
    this.object.quartaHorarioFinal = "";
    this.object.quintaHorarioInicial = "";
    this.object.quintaHorarioFinal = "";
    this.object.sextaHorarioInicial = "";
    this.object.sextaHorarioFinal = "";
    this.object.sabadoHorarioInicial = "";
    this.object.sabadoHorarioFinal = "";
  }

  clearAusencia() {    
     this.ausenciaProfissional = new AusenciaProfissional();        
     this.allItemsAusencia = [];
   }

  loadDomains() {
    this.domains.push({
      idMesEscala: [
        { id: 1, nome: "JANEIRO" },
        { id: 2, nome: "FEVEREIRO" },
        { id: 3, nome: "MARÇO" },
        { id: 4, nome: "ABRIL" },
        { id: 5, nome: "MAIO" },
        { id: 6, nome: "JUNHO" },
        { id: 7, nome: "JULHO" },
        { id: 8, nome: "AGOSTO" },
        { id: 9, nome: "SETEMBRO" },
        { id: 10, nome: "OUTUBRO" },
        { id: 11, nome: "NOVEMBRO" },
        { id: 12, nome: "DEZEMBRO" },
      ],  
      idTipoAusencia: [
        { id: 1, nome: "Férias" },
        { id: 2, nome: "Falta" }
      ],
      idEquipe: [],
      idCaneta: []
    });  
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      periodoInicial: ['', ''],
      periodoFinal: ['', ''],
      domingoHorarioInicial: ['', ''],
      domingoHorarioFinal: ['', ''],
      segundaHorarioInicial: ['', ''],
      segundaHorarioFinal: ['', ''],
      tercaHorarioInicial: ['', ''],
      tercaHorarioFinal: ['', ''],
      quartaHorarioInicial: ['', ''],
      quartaHorarioFinal: ['', ''],
      quintaHorarioInicial: ['', ''],
      quintaHorarioFinal: ['', ''],
      sextaHorarioInicial: ['', ''],
      sextaHorarioFinal: ['', ''],
      sabadoHorarioInicial: ['', ''],
      sabadoHorarioFinal: ['', ''],
      idProfissional: ['', ''],
      idMesEscala: ['', ''],
      anoEscala: ['2020', ''],      
      idTipoAusencia: ['', ''],
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


  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  back() {
    this.router.navigate([this.method]);
  }

  salvaAusencia() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    var dateInicialFormatada;
    var dateFinalFormatada;
    
    if (Util.isEmpty(this.ausenciaProfissional.periodoInicial) || Util.isEmpty(this.ausenciaProfissional.periodoFinal) || Util.isEmpty(this.ausenciaProfissional.idTipoAusencia))
    {
      this.errors = [{message:"O tipo da ausência, período inicial e período final são campos obrigatórios"}];
      this.loading = false;
      return;
    }

    if (this.ausenciaProfissional.periodoFinal < this.ausenciaProfissional.periodoInicial)
    {
      this.errors = [{message:"O período informado é inválido"}];
      this.loading = false;
      return;
    }
    
    dateInicialFormatada = this.ausenciaProfissional.periodoInicial.getFullYear() + "-" + this.twoDigits(1 + this.ausenciaProfissional.periodoInicial.getMonth()) + "-" +
    this.twoDigits(this.ausenciaProfissional.periodoInicial.getDate()) + " " + 
    this.twoDigits(this.ausenciaProfissional.periodoInicial.getHours()) + ":" + 
    this.twoDigits(this.ausenciaProfissional.periodoInicial.getMinutes()) + ":" + 
    this.twoDigits(this.ausenciaProfissional.periodoInicial.getSeconds());

    dateFinalFormatada = this.ausenciaProfissional.periodoFinal.getFullYear() + "-" + this.twoDigits(1 + this.ausenciaProfissional.periodoFinal.getMonth()) + "-" + 
    this.twoDigits(this.ausenciaProfissional.periodoFinal.getDate()) + " " + 
    this.twoDigits(this.ausenciaProfissional.periodoFinal.getHours()) + ":" + 
    this.twoDigits(this.ausenciaProfissional.periodoFinal.getMinutes()) + ":" + 
    this.twoDigits(this.ausenciaProfissional.periodoFinal.getSeconds());

    this.ausenciaProfissional.periodoInicial = dateInicialFormatada;
    this.ausenciaProfissional.periodoFinal = dateFinalFormatada;
    this.ausenciaProfissional.idProfissional = this.object.idProfissional;
    
    this.service.salvaAusencia(this.ausenciaProfissional).subscribe(result => {
      this.message = "Ausência/Férias inserida com sucesso!"
      this.loading = false;
      this.carregaAusenciaPorProfissional();      
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });    
    this.ausenciaProfissional.periodoInicial = null;
    this.ausenciaProfissional.periodoFinal = null;
    this.ausenciaProfissional.idTipoAusencia = 0;
  }

  carregaDadosDoProfissional()
  {
    this.clear();
    this.carregaAusenciaPorProfissional();
  }
  
  carregaAusenciaPorProfissional() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.carregaAusenciaPorProfissional(this.object.idProfissional).subscribe(result => {
      this.allItemsAusencia = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  removeAusencia(item) {
    this.service.removeAusencia(item.id).subscribe(result => {
      this.message = "Ausência/Férias removida com sucesso!"
      this.loading = false;
      this.carregaAusenciaPorProfissional();
    });
  }

  findEscalaPorProfissionalAnoMes() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.carregaAusenciaPorProfissional(this.object.idProfissional).subscribe(result => {
      this.allItemsAusencia = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  carregaEscalaPorProfissionalAnoMes() {    
    this.errors = [];
    this.message = "";
    this.loading = true;
    var anoMes = this.form.value.anoEscala + this.form.value.idMesEscala.padStart(2,'0');

    this.service.carregaEscalaProfissionalAnoMes(this.object.idProfissional, anoMes).subscribe(result => {      
      this.object.id = result[0] ? result[0].id : null;
      this.object.domingoHorarioInicial = result[0] ? result[0].domingoHorarioInicial : "";
      this.object.domingoHorarioFinal = result[0] ? result[0].domingoHorarioFinal : "";
      this.object.segundaHorarioInicial = result[0] ? result[0].segundaHorarioInicial : "";
      this.object.segundaHorarioFinal = result[0] ? result[0].segundaHorarioFinal : "";
      this.object.tercaHorarioInicial = result[0] ? result[0].tercaHorarioInicial : "";
      this.object.tercaHorarioFinal = result[0] ? result[0].tercaHorarioFinal : "";
      this.object.quartaHorarioInicial = result[0] ? result[0].quartaHorarioInicial : "";
      this.object.quartaHorarioFinal = result[0] ? result[0].quartaHorarioFinal : "";
      this.object.quintaHorarioInicial = result[0] ? result[0].quintaHorarioInicial : "";
      this.object.quintaHorarioFinal = result[0] ? result[0].quintaHorarioFinal : "";
      this.object.sextaHorarioInicial = result[0] ? result[0].sextaHorarioInicial : "";
      this.object.sextaHorarioFinal = result[0] ? result[0].sextaHorarioFinal : "";
      this.object.sabadoHorarioInicial = result[0] ? result[0].sabadoHorarioInicial : "";
      this.object.sabadoHorarioFinal = result[0] ? result[0].sabadoHorarioFinal : "";
      this.loading = false;

    }, error => {
      this.object = new EscalaProfissional();
      this.loading = false;
      this.errors.push({
        message: "Escala não encontrada"
      });
    });
  }

  salvaEscalaProfissional() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.object.anoMes = this.form.value.anoEscala + this.form.value.idMesEscala.padStart(2,'0');

    this.service.salvaEscalaProfissional(this.object).subscribe(result => {
      this.loading = false; 
      this.carregaEscalaPorProfissionalAnoMes();
      this.message = "Escala atualizada com sucesso!"
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });    
  }

}