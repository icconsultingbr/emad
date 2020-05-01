import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AtribuicaoCanetaService } from './atribuicao-caneta.service';
import { AtribuicaoCaneta } from '../../_core/_models/AtribuicaoCaneta';

@Component({
  selector: 'app-atribuicao-caneta',
  templateUrl: './atribuicao-caneta.component.html',
  styleUrls: ['./atribuicao-caneta.component.css'],
  providers: [AtribuicaoCanetaService]
})
export class AtribuicaoCanetaComponent implements OnInit {

  method: String = "atribuicao-caneta";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: AtribuicaoCaneta = new AtribuicaoCaneta();

  constructor(
    public nav: AppNavbarService,
    private service: AtribuicaoCanetaService) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
    this.loadDomains();
  }

  ngOnInit() {
    this.nav.show();
  }

  loadDomains() {
    this.service.listDomains('profissional').subscribe(profissionais => {
      this.service.listDomains('caneta').subscribe(canetas => {
        this.domains.push({
          idProfissional: profissionais,
          idCaneta: canetas
        })
      });
    });
  }

  buscaProfissionais() {


    this.loading = true;
       this.service.list('profissional/estabelecimento/' + this.object.idEstabelecimento).subscribe(result => {
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


        this.loading = true;
        this.service.list('caneta/estabelecimento/' + this.object.idEstabelecimento + '/' +  dateInicialFormatada  + '/' + dateFinalFormatada).subscribe(result => {
        this.domains[0].idCaneta = result;
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

  consultaAgenda() {

    this.agendas = [];
    this.domingo.schedulers = [];
    this.segunda.schedulers = [];
    this.terca.schedulers = [];
    this.quarta.schedulers = [];
    this.quinta.schedulers = [];
    this.sexta.schedulers = [];
    this.sabado.schedulers = [];

    if (!Util.isEmpty(this.object.idPaciente)) {
      this.loading = true;
      this.service.list('agenda?idPaciente=' + this.object.idPaciente + "&idEquipe=" + this.object.idEquipe + "&idProfissional=" + this.object.idProfissional).subscribe(result => {

        this.agendas = result;
        this.loading = false;

        this.loadSchedule(new Date());

      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
    }
  }

  loadSchedule(day: Date = null) {


    let hoje = ((day == null) ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0) : day);
    let weekDay = hoje.getDay();


    this.domingo.label = Util.cCalendar(hoje, weekDay, 0);
    this.domingo.data = Util.cdCalendar(hoje, weekDay, 0);
    this.segunda.label = Util.cCalendar(hoje, weekDay, 1);
    this.segunda.data = Util.cdCalendar(hoje, weekDay, 1);
    this.terca.label = Util.cCalendar(hoje, weekDay, 2);
    this.terca.data = Util.cdCalendar(hoje, weekDay, 2);
    this.quarta.label = Util.cCalendar(hoje, weekDay, 3);
    this.quarta.data = Util.cdCalendar(hoje, weekDay, 3);
    this.quinta.label = Util.cCalendar(hoje, weekDay, 4);
    this.quinta.data = Util.cdCalendar(hoje, weekDay, 4);
    this.sexta.label = Util.cCalendar(hoje, weekDay, 5);
    this.sexta.data = Util.cdCalendar(hoje, weekDay, 5);
    this.sabado.label = Util.cCalendar(hoje, weekDay, 6);
    this.sabado.data = Util.cdCalendar(hoje, weekDay, 6);

    //outraData.setDate(time.getDate() + 3); 


    /* console.log(hoje.getDay());
     console.log(hoje.getDate());
     console.log(hoje.getMonth());
     console.log(hoje.getFullYear());*/

    if (this.agendas != null) {

      this.domingo.schedulers = [];
      this.segunda.schedulers = [];
      this.terca.schedulers = [];
      this.quarta.schedulers = [];
      this.quinta.schedulers = [];
      this.sexta.schedulers = [];
      this.sabado.schedulers = [];

      this.agendas.forEach(agenda => {
        

        let inicio = new Date(agenda.dataInicio);

        inicio.setHours(inicio.getHours() + (environment.utc));
        
        let fim = new Date(agenda.dataFim);
        fim.setHours(fim.getHours() + (environment.utc));
    
        let dataVigencia = new Date(agenda.dataVigencia);
        dataVigencia.setHours(dataVigencia.getHours() + (environment.utc));

        let tipo = agenda.idTipoAgenda;

        let inicioTime = inicio.getTime();
        let fimTime = fim.getTime();
        let zeroHour = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0).getTime();

        let de = Util.pad(inicio.getHours(), 2) + ":" + Util.pad(inicio.getMinutes(), 2);
        let ate = Util.pad(fim.getHours(), 2) + ":" + Util.pad(fim.getMinutes(), 2);
        let mag = (((((inicioTime - zeroHour) / 1000) / 60) / 60) * 40);

        let duration = (((((fimTime - inicioTime) / 1000) / 60) / 60) * 40);

        agenda.duration = duration;
        agenda.deAte = de + " - " + ate;
        agenda.margin = mag;

        if (!Util.isEmpty(agenda.daysFlag) && tipo == "S") {
          let days = agenda.daysFlag.split("_");

          let vigTime = new Date(dataVigencia.getFullYear(), dataVigencia.getMonth(), dataVigencia.getDate(), 0, 0, 0).getTime();
          let iniTime = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime();

          if (days.includes("0")) {
            let domTime = new Date(new Date(this.domingo.data).getFullYear(), new Date(this.domingo.data).getMonth(), new Date(this.domingo.data).getDate(), 0, 0, 0).getTime();
            if (domTime <= vigTime && domTime >= iniTime) {
              this.domingo.schedulers.push(agenda);
            }
          }


          if (days.includes("1")) {
            let segTime = new Date(new Date(this.segunda.data).getFullYear(), new Date(this.segunda.data).getMonth(), new Date(this.segunda.data).getDate(), 0, 0, 0).getTime();
            if (segTime <= vigTime && segTime >= iniTime) {
              this.segunda.schedulers.push(agenda);
            }
          }

          if (days.includes("2")) {
            let terTime = new Date(new Date(this.terca.data).getFullYear(), new Date(this.terca.data).getMonth(), new Date(this.terca.data).getDate(), 0, 0, 0).getTime();
            if (terTime <= vigTime && terTime >= iniTime) {
              this.terca.schedulers.push(agenda);
            }
          }

          if (days.includes("3")) {
            let quaTime = new Date(new Date(this.quarta.data).getFullYear(), new Date(this.quarta.data).getMonth(), new Date(this.quarta.data).getDate(), 0, 0, 0).getTime();
            if (quaTime <= vigTime && quaTime >= iniTime) {
              this.quarta.schedulers.push(agenda);
            }
          }

          if (days.includes("4")) {
            let quiTime = new Date(new Date(this.quinta.data).getFullYear(), new Date(this.quinta.data).getMonth(), new Date(this.quinta.data).getDate(), 0, 0, 0).getTime();
            if (quiTime <= vigTime && quiTime >= iniTime) {
              this.quinta.schedulers.push(agenda);
            }
          }

          if (days.includes("5")) {
            let sexTime = new Date(new Date(this.sexta.data).getFullYear(), new Date(this.sexta.data).getMonth(), new Date(this.sexta.data).getDate(), 0, 0, 0).getTime();
            if (sexTime <= vigTime && sexTime >= iniTime) {
              this.sexta.schedulers.push(agenda);
            }
          }

          if (days.includes("6")) {
            let sabTime = new Date(new Date(this.sabado.data).getFullYear(), new Date(this.sabado.data).getMonth(), new Date(this.sabado.data).getDate(), 0, 0, 0).getTime();
            if (sabTime <= vigTime && sabTime >= iniTime) {
              this.sabado.schedulers.push(agenda);
            }
          }
        }


        else if (tipo == "U") {

          if (new Date(new Date(this.domingo.data).getFullYear(), new Date(this.domingo.data).getMonth(), new Date(this.domingo.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.domingo.schedulers.push(agenda);
          }

          if (new Date(new Date(this.segunda.data).getFullYear(), new Date(this.segunda.data).getMonth(), new Date(this.segunda.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.segunda.schedulers.push(agenda);
          }

          if (new Date(new Date(this.terca.data).getFullYear(), new Date(this.terca.data).getMonth(), new Date(this.terca.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.terca.schedulers.push(agenda);
          }

          if (new Date(new Date(this.quarta.data).getFullYear(), new Date(this.quarta.data).getMonth(), new Date(this.quarta.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.quarta.schedulers.push(agenda);
          }

          if (new Date(new Date(this.quinta.data).getFullYear(), new Date(this.quinta.data).getMonth(), new Date(this.quinta.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.quinta.schedulers.push(agenda);
          }

          if (new Date(new Date(this.sexta.data).getFullYear(), new Date(this.sexta.data).getMonth(), new Date(this.sexta.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.sexta.schedulers.push(agenda);
          }

          if (new Date(new Date(this.sabado.data).getFullYear(), new Date(this.sabado.data).getMonth(), new Date(this.sabado.data).getDate(), 0, 0, 0).getTime() ==
            new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), 0, 0, 0).getTime()) {
            this.sabado.schedulers.push(agenda);
          }
        }
      });
    }
  }

  voltaAgenda(data: Date) {
    let dt1 = new Date(data);
    let dt = new Date(data);

    dt.setDate((dt1.getDate() - 6));
    dt.setHours(dt.getHours() + (environment.utc));
    this.loadSchedule(dt);
  }

  avancaAgenda(data: Date) {
    let dt1 = new Date(data);
    let dt = new Date(data);

    dt.setDate((dt1.getDate() + 1));
    dt.setHours(dt.getHours() + (environment.utc));
    this.loadSchedule(dt);
  }

  hoje() {
    this.loadSchedule(null);
  }

  tipoAgenda($event) {
    let value = $event.target.value;
    if (value == 'U') {
      this.object.dataVigencia = null;
      this.object.dom = false;
      this.object.seg = false;
      this.object.ter = false;
      this.object.qua = false;
      this.object.qui = false;
      this.object.sex = false;
      this.object.sab = false;
    }
  }

  saveSchedule() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.save(this.object, this.method).subscribe(result => {
      this.message = "Agenda inserida com sucesso!";
      this.modalRef.close();
      this.consultaAgenda();
      this.loading = false;
    }, error => {
      this.errors = Util.customHTTPResponse(error);
      this.loading = false;
    });
  }

  isValid() {

    let bool: Boolean = false;

    if (this.object.idTipoAgenda == 'S') {
      if ((
        Util.isEmpty(this.object.pacienteNome) ||
        Util.isEmpty(this.object.idPaciente) ||
        Util.isEmpty(this.object.idEquipe) ||
        Util.isEmpty(this.object.dataVigencia) ||
        Util.isEmpty(this.object.idProfissional) ||
        Util.isEmpty(this.object.idTipoAgenda) ||
        Util.isEmpty(this.object.dataInicio) ||
        Util.isEmpty(this.object.horaInicio) ||
        Util.isEmpty(this.object.horaFim) ||
        Util.isEmpty(this.object.observacoes) ||
        (this.object.dom == false && this.object.seg == false && this.object.ter == false && this.object.qua == false && this.object.qui == false && this.object.sex == false && this.object.sab == false))
      ) {
        bool = true;
      }
    } else if (this.object.idTipoAgenda == 'U') {
      if (
        Util.isEmpty(this.object.pacienteNome) ||
        Util.isEmpty(this.object.idPaciente) ||
        Util.isEmpty(this.object.idEquipe) ||
        Util.isEmpty(this.object.idProfissional) ||
        Util.isEmpty(this.object.idTipoAgenda) ||
        Util.isEmpty(this.object.dataInicio) ||
        Util.isEmpty(this.object.horaInicio) ||
        Util.isEmpty(this.object.horaFim) ||
        Util.isEmpty(this.object.observacoes)
      ) {
        bool = true;
      }
    } else {
      bool = true;
    }

    return bool;
  }

  canCreate() {
    if (
      !Util.isEmpty(this.object.idPaciente) &&
      !Util.isEmpty(this.object.pacienteNome) &&
      !Util.isEmpty(this.object.equipe) &&
      !Util.isEmpty(this.object.idEquipe) &&
      !Util.isEmpty(this.object.idProfissional)
    ) {
      return true;
    } else {
      return false;
    }
  }

  editSchedule(item) {

    this.selectedSchedule = item;

    this.loading = true;

    this.object.dom = false;
    this.object.seg = false;
    this.object.ter = false;
    this.object.qua = false;
    this.object.qui = false;
    this.object.sex = false;
    this.object.sab = false;

    this.service.findById(item.id, this.method).subscribe(result => {

      let dataInicial = new Date(result.dataInicio);
      dataInicial.setHours(dataInicial.getHours() + (environment.utc));

      let dataFinal = new Date(result.dataFim);
      dataFinal.setHours(dataFinal.getHours() + (environment.utc));

      let dataVigencial = new Date(result.dataVigencia);
      dataVigencial.setHours(dataVigencial.getHours() + (environment.utc));

      let newVigencia = null;
      if (!Util.isEmpty(result.dataVigencia)) {
        dataVigencial = new Date(result.dataVigencia);
        newVigencia = dataVigencial.getFullYear() + "-" + Util.pad(dataVigencial.getMonth() + 1, 2) + "-" + Util.pad(dataVigencial.getDate(), 2) + " " + Util.pad(dataVigencial.getHours(), 2) + ":" + Util.pad(dataVigencial.getMinutes(), 2);

      }

      let newDataInicio = dataInicial.getFullYear() + "-" + Util.pad(dataInicial.getMonth() + 1, 2) + "-" + Util.pad(dataInicial.getDate(), 2) + " " + Util.pad(dataInicial.getHours(), 2) + ":" + Util.pad(dataInicial.getMinutes(), 2);
      this.object.id = result.id;
      this.object.idPaciente = result.idPaciente;
      this.object.idEquipe = result.idEquipe;
      this.object.equipeNome = result.equipeNome;
      this.object.nome = result.nome;
      this.object.dataVigencia = !Util.isEmpty(result.dataVigencia) ? Util.dateFormat(newVigencia, "dd/MM/yyyy") : null;
      this.object.idProfissional = result.idProfissional;
      this.object.idTipoAgenda = result.idTipoAgenda;
      this.object.dataInicio = Util.dateFormat(newDataInicio, "dd/MM/yyyy");
      this.object.horaInicio = newDataInicio.substring(11, 16);
      this.object.horaFim = Util.pad(dataFinal.getHours(), 2) + ":" + Util.pad(dataFinal.getMinutes(), 2);
      this.object.observacoes = result.observacoes;

      if (!Util.isEmpty(result.daysFlag)) {
        let split = result.daysFlag.split("_");

        split.forEach(dia => {

          if (dia == 0) {
            this.object.dom = true;
          }
          if (dia == 1) {
            this.object.seg = true;
          }
          if (dia == 2) {
            this.object.ter = true;
          }
          if (dia == 3) {
            this.object.qua = true;
          }
          if (dia == 4) {
            this.object.qui = true;
          }
          if (dia == 5) {
            this.object.sex = true;
          }
          if (dia == 6) {
            this.object.sab = true;
          }
        });
      }

      this.loading = false;
      this.openSchedule(this.contentScheduler, this.object.id);
    });
  }

  removeSchedule(){
    this.message = "";
    this.errors = [];
    this.service.remove(this.selectedSchedule.id, this.method).subscribe(result =>{
      this.selectedSchedule = null;
      this.message = "Agenda removida com sucesso!";
      this.modalRemoveRef.close();
      this.modalRef.close();
      this.consultaAgenda();
     
    }, error =>{
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);

    });
  }

  ver(agenda){
    let data = new Date(agenda.dataInicio);
    data.setHours(data.getHours() + (environment.utc));
    this.loadSchedule(data);
  }

  convertTodate(date){
    if(!Util.isEmpty(date)){
      let data = new Date(date);
      return data.setHours(data.getHours() + (environment.utc));
    }

    return null;
  }

  getInitials(nome : String){
    return Util.getInitialsOfName(nome)[0] + "" + Util.getInitialsOfName(nome)[Util.getInitialsOfName(nome).length-1];
  }

  sendForm($event: any){
    
  }

}