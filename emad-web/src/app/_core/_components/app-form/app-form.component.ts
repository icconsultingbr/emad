/// <reference types="@types/googlemaps" />
import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppFormService } from './app-form.service';
import { Util } from '../../_util/Util';
import { Subject } from 'rxjs';
import { Translation } from '../../_locale/Translation';
import { debounceTime } from 'rxjs/operators';
import PlaceResult = google.maps.places.PlaceResult;
import PlaceGeometry = google.maps.places.PlaceGeometry;
import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;


@Component({
  selector: 'app-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.css']
})
export class AppFormComponent implements OnInit, AfterViewInit {


  @Input() fields = [];
  @Input() method: String;
  @Input() object: any;
  @Input() domains: any[];
  @Input() redirectAfterInsert: string;

  service: AppFormService;
  form: FormGroup;
  groupForm: any = {};
  type: String;
  route: ActivatedRoute;
  router: Router;
  message: string = '';
  warning: String = '';
  situacao: Number = 0;
  saveLabel: String = "Salvar";
  debounce: Subject<string> = new Subject<string>();
  id: any;
  errors: any[] = [];

  @Output() onTyping = new EventEmitter<string>();
  @Input() value: string = '';

  @ViewChild('focus') focusElement: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;
  @Output() emitFilterMultiSelectMethod = new EventEmitter();

  @Input() loading: Boolean = true;

  @ViewChild('addresstext') addresstext: ElementRef;
  @Output() emitGeocodeAddress: EventEmitter<any> = new EventEmitter();

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    router: Router,
    service: AppFormService,
    route: ActivatedRoute,
  ) {

    this.router = router;
    this.service = service;
    this.route = route;
  }

  ngAfterViewInit() {
    if (this.domains) {
      this.checkDomains();
    } else {
      this.loadContent();
    }
    if (this.fields.filter((field) => field.type == 'geocode' && field.form).length > 0) {
      this.getPlaceAutocomplete();
    }
  }

  checkDomains() {
    if (this.domains.length) {
      this.loadContent();

    }
    else {
      setTimeout(() => {
        this.checkDomains();
      }, 1000);
    }
  }

  loadContent() {
    this.route.params.subscribe(params => {
      this.id = params['id'];

      if (this.id) {
        this.service.buscaPorId(this.id, this.method)
          .subscribe(result => {

            this.object = result;

            for (let field of this.fields) {
              if (field.filter && field.filter.changeTarget) {

                if (typeof field.filter.changeTarget === 'object') {

                  for (let i = 0; i < field.filter.changeTarget.length; i++) {
                    this.listDomain(field.filter.changeMethod, this.object[field.field], field.filter.changeTarget[i][i].toString());
                  }
                }
                else if (typeof field.filter.changeTarget === 'string') {
                  if (field.filter && field.filter.changeTarget) {
                    this.listDomain(
                      field.filter.changeMethod, this.object[field.field], field.filter.changeTarget);
                  }
                }
              }
            }
            setTimeout(() => {
              this.loading = false;
              this.loadConfigs();
            }, 300);
          }, (erro) => {
            setTimeout(() => this.loading = false, 300);
            this.warning = Translation.t("SERVICE_UNAVAILABLE");
          });
      } else {
        setTimeout(() => this.loading = false, 300);
      }

    },
      (erro) => {
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });

    if (this.focusElement) {
      this.focusElement.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      searchPlaceholderText: 'Procurar',
      noDataAvailablePlaceholderText: 'Sem dados disponíveis',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    this.createGroup();

  }

  loadConfigs() {
    for (let field of this.fields) {

      let id = this.object[field.field];

      this.fieldValidator(field, id);

    }
  }

  fieldValidator(field, id) {

    if (field.toggleFields) {

      if (field.toggleFields.length == 1) {
        field.toggleFields.forEach(e => {

          if (id == e.value) {
            if (e.hide && e.hide.length) {
              e.hide.forEach(h => {
                //this.form.controls[h].disable();
                this.form.controls[h].setValidators(null);
                this.form.controls[h].updateValueAndValidity();
                this.object[h] = undefined;
                $("#fg-" + h).hide();
              });
            }
            if (e.show && e.show.length) {
              e.show.forEach(s => {
                //this.form.controls[s].enable();
                $("#fg-" + s).show();

                this.fields.forEach(ff => {
                  if (ff.field == s) {
                    if (ff.required) {
                      this.form.controls[s].setValidators([Validators.required]);
                      this.form.controls[s].updateValueAndValidity();
                    }
                  }
                });

              });
            }
          } else {
            if (e.hide && e.hide.length) {
              e.hide.forEach(h => {
                //this.form.controls[h].enable();
                $("#fg-" + h).show();

                this.fields.forEach(ff => {
                  if (ff.field == h) {
                    if (ff.required) {
                      this.form.controls[h].setValidators([Validators.required]);
                      this.form.controls[h].updateValueAndValidity();
                    }
                  }
                });
              });
            }

            if (e.show && e.show.length) {
              e.show.forEach(h => {
                $("#fg-" + h).hide();
                //this.form.controls[h].disable();
                this.object[h] = undefined;
                this.form.controls[h].setValidators(null);
                this.form.controls[h].updateValueAndValidity();
              });
            }
          }
        });
      } else {

        field.toggleFields.forEach(e => {

          if (id == '0: undefined') {
            id = undefined;
          }

          if (id == e.value) {

            if (e.hide && e.hide.length) {
              e.hide.forEach(h => {
                //this.form.controls[h].disable();
                this.object[h] = undefined;
                this.form.controls[h].setValidators(null);
                this.form.controls[h].updateValueAndValidity();

                setTimeout(() => {
                  $("#fg-" + h).hide();

                }, 100);

              });
            }
            if (e.show && e.show.length) {
              e.show.forEach(s => {
                //this.form.controls[s].enable();
                $("#fg-" + s).show();

                this.fields.forEach(ff => {
                  if (ff.field == s) {
                    if (ff.required) {
                      this.form.controls[s].setValidators([Validators.required]);
                      this.form.controls[s].updateValueAndValidity();
                      //this.object[s] = undefined;
                    }
                  }
                });
              });
            }
          }
        });

      }
    }

    // console.log(this.form.controls);
  }

  onItemSelect(item: any) {

  }
  onSelectAll(items: any) {

  }

  ngOnDestroy(): void {
    this.debounce.unsubscribe();
  }

  createGroup() {
    this.route.params.subscribe(params => {

      this.id = params['id'];

      for (let field of this.fields) {
        if (field.form) {
          if (this.id) {
            if (!field.onlyCreate) {
              this.groupForm[field.field] = field.validator;
            }
          }
          else {
            this.groupForm[field.field] = field.validator;
          }
        }
      }
      this.form = this.fb.group(this.groupForm);

      this.debounce
        .pipe(debounceTime(300))
        .subscribe(filter => {
          this.loading = true;
          let parts = filter.split("||");

          this.form.patchValue(JSON.parse(`{"${parts[2]}":""}`));

          this.service.findByName(parts[1], parts[0]).subscribe(res => {
            for (let field of this.fields) {
              if (field.field == parts[2]) {
                this.form.patchValue(JSON.parse(`{"${parts[2]}":"${res[Object.keys(res)[0]]}"}`));
                setTimeout(() => this.loading = false, 1000);
              }
            }
          }, erro => {
            this.form.patchValue(JSON.parse(`{"${parts[2]}":""}`));
            setTimeout(() => this.loading = false, 1000);
          });
        });
    });
  }

  sendForm(event) {
    this.errors = [];
    this.loading = true;
    event.preventDefault();

    this.service
      .inserir(this.form.value, this.method)
      .subscribe(res => {
        if (this.form.value.id) {
          this.message = "Alteração efetuada com sucesso!";
        }
        this.message = this.message ? this.message : "Cadastro efetuado com sucesso!";
        this.warning = "";

        this.form.reset();


        setTimeout(() => {
          this.loading = false;
          this.router.navigate([this.method])
        }, 1000);

      }, erro => {

        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  back() {
    this.router.navigate([this.method]);
  }

  loadDomain(field: any, $event) {
    let id = $event.target.value;

    if (field.filter) {
      if (field.filter.changeMethod) {
        let route = field.filter.changeMethod;
        let object = field.filter.changeTarget;
        this.listDomain(route, id, object);
      }
    }

    if (field.toggleFields) {

      this.fieldValidator(field, id);
    }
  }

  listDomain(route, id, object) {
    if (id != null) {
      this.loading = true;
      this.service.list(route + "/" + id).subscribe(result => {
        this.loading = false;
        for (let field of this.fields) {
          if (field.field == object) {

            if (result[field.returnedObject]) {
              this.domains[0][object] = result[field.returnedObject];
            }
            else {
              this.domains[0][object] = result;
            }

            /*this.object[object].forEach(r =>{
              this.domains[0][object].forEach(d =>{
                if()
              })
            })*/


            //this.object[object] = undefined;
          }
        }
      });
    }
  }

  blurMethod(value, field) {
    this.errors = [];

    if (value !== 'undefined' && value != "") {

      this.loading = true;

      this.service.buscaPorId(value, field.onBlur.url).subscribe(result => {

        if (field.onBlur.targets) {
          field.onBlur.targets.forEach(item => {
            this.object[item['field']] = result[item['field']];

            for (let f of this.fields) {
              if (f.field == item['field']) {
                if (f.filter) {
                  if (f.filter['changeMethod']) {
                    setTimeout(() => {
                      this.listDomain(f.filter['changeMethod'], this.object[item['field']], f.filter['changeTarget']);
                    }, 300);
                  }
                }
              }
            }
          });

        } else {
          this.object = result;
        }

        this.loading = false;

      }, error => {

        this.errors = Util.customHTTPResponse(error);

        if (field.onBlur.targets) {
          field.onBlur.targets.forEach(item => {
            this.object[item['field']] = null;
          });
        }

        this.loading = false;
      });
    } else {
      if (field.onBlur.targets) {
        field.onBlur.targets.forEach(item => {
          this.object[item['field']] = null;
        });
      }
    }
  }

  filterMultiSelectMethod(field, value) {
    if (typeof field !== "undefined" && typeof value !== "undefined" && field !== null && value !== null) {
      this.emitFilterMultiSelectMethod.emit({ field: field, value: value });
    }
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'BR' },
        types: ['geocode']  // 'establishment' / 'address' / 'geocode'
      }
    );

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      let place: PlaceResult = autocomplete.getPlace();
      let geometry: PlaceGeometry = place.geometry;

      let rua: string = "";
      let numero: string = "";
      let bairro: string = "";
      let municipio: string = "";
      let estado: string = "";
      let latitude: number = 0;
      let longitude: number = 0;
      let cep: string = "";

      place.address_components.forEach((address_component: GeocoderAddressComponent) => {
        if (address_component.types[0] === "route") {
          rua = address_component.long_name;
        }
        if (address_component.types[0] === "street_number") {
          numero = address_component.long_name;
        }
        if (address_component.types[0] === "sublocality_level_1") {
          bairro = address_component.long_name;
        }
        if (address_component.types[0] === "administrative_area_level_2") {
          municipio = address_component.long_name;
        }
        if (address_component.types[0] === "administrative_area_level_1") {
          estado = address_component.long_name;
        }
        if (address_component.types[0] === "postal_code") {
          cep = address_component.long_name;
        }
      });

      if (geometry) {
        latitude = geometry.location.lat();
        longitude = geometry.location.lng();
      }

      let address: any = {
        rua: rua,
        numero: numero,
        bairro: bairro,
        municipio: municipio,
        estado: estado,
        latitude: latitude,
        longitude: longitude,
        cep: cep
      };

      this.emitGeocodeAddress.emit({address: address, object: this.object});
    });
  }

}