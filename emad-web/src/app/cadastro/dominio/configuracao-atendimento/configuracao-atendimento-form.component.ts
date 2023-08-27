import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracaoAtendimentoService } from './configuracao-atendimento.service';
import { ConfiguracaoAtendimento } from '../../../_core/_models/ConfiguracaoAtendimento';
import { Util } from '../../../_core/_util/Util';

@Component({
  selector: 'app-configuracao-atendimento-form',
  templateUrl: './configuracao-atendimento-form.component.html',
  styleUrls: ['./configuracao-atendimento-form.component.css'],
  providers: [ConfiguracaoAtendimentoService]
})

export class ConfiguracaoAtendimentoFormComponent implements OnInit {

  object: ConfiguracaoAtendimento = new ConfiguracaoAtendimento();
  method: string = "configuracao-atendimento";
  fields: any[] = [];
  label: string = "Configuração do formulario de atendimento";
  id: number = null;
  domains: any[] = [];
  form: FormGroup;
  message: string = "";
  errors: any[] = [];
  loading: Boolean = false;

  constructor(
    public fb: FormBuilder,
    private service: ConfiguracaoAtendimentoService,
    private route: ActivatedRoute,
    private router: Router) {
    this.fields = service.formFields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.createGroup();
      if (this.id) {
        this.loading = true;
        this.service.buscaPorId(this.id).subscribe(
          res => {
            this.object = res;
            this.atualizarPerguntasFormArray(res.perguntas);
            this.loading = false;
          }, erro => {
            this.loading = false;
            let json = erro;
          }
        );
      }
    });
    this.loading = true;
    this.loadDomains();
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idEspecialidade: [''],
      idEstabelecimento: ['', ''],
      idTipoFicha: [''],
      perguntas: this.fb.array([])
    });
  }

  loadDomains() {
    this.service.listDomains('especialidade').subscribe(especialidades => {
      this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
        this.service.listDomains('tipo-ficha').subscribe(tipoFicha => {
          this.service.listDomains('configuracao-atendimento/configuracao').subscribe(perguntas => {
            this.domains.push({
              idEspecialidade: especialidades,
              idEstabelecimento: estabelecimentos,
              tipoFichas: tipoFicha,
              perguntas: perguntas
            });

            if (!this.id) {
              this.atualizarPerguntasFormArray(perguntas);
            }

            setTimeout(() => {
              this.loading = false;
            }, 300);
          })
        })
      })
    });
  }

  private atualizarPerguntasFormArray(perguntas: any) {
    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i];

      let formControl: FormControl = new FormControl('');
      let pergunta: FormControl = new FormControl('');
      let visivel: FormControl = new FormControl('');
      let obrigatorio: FormControl = new FormControl('');

      formControl.setValue(p.formControl);
      pergunta.setValue(p.pergunta);
      visivel.setValue(p.visivel);
      obrigatorio.setValue(p.obrigatorio);

      this.getFormArray().push(new FormGroup({
        formControl: formControl,
        pergunta: pergunta,
        visivel: visivel,
        obrigatorio: obrigatorio
      }));
    }
  }

  getFormArray(): FormArray {
    return this.form.get('perguntas') as FormArray;
  }

  marcarCampoVisivel(obj: any, e: any) {
    obj.visivel = !obj.visivel
  }

  marcarCampoObrigatorio(obj: any, e: any) {
    obj.obrigatorio = !obj.obrigatorio
  }

  sendForm(event) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();

    if(this.id) {
      this.form.controls['id'].patchValue(this.id);
    }

    this.service
      .save(this.form.getRawValue(), this.method)
      .subscribe((res: any) => {
        this.loading = false;
        this.object.id = res.id;
        if (this.form.value.id)
          this.message = "Alteração efetuada com sucesso!";
        else
          this.message = "Cadastro efetuado com sucesso!";

        this.back();
        return;
      }, erro => {
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  back() {
    const route = "configuracao-atendimentos";
    this.router.navigate([route]);
  }
}