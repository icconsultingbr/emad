/// <reference types="@types/googlemaps" />
import * as MarkerClusterer from '@google/markerclusterer';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../../_core/_services';
import { Paciente } from '../../_core/_models/Paciente';
import { Util } from '../../_core/_util/Util';
import { GeorreferenciamentoService } from './georreferenciamento.service';
import { Estabelecimento } from '../../_core/_models/Estabelecimento';

@Component({
  selector: 'app-georreferenciamento',
  templateUrl: './georreferenciamento.component.html',
  styleUrls: ['./georreferenciamento.component.css'],
  providers: [GeorreferenciamentoService]
})
export class GeorreferenciamentoComponent implements OnInit {

  @ViewChild('mapRef') mapElement: ElementRef;
  @ViewChild('alert') alert: ElementRef;

  //MESSAGES
  loading: Boolean = false;
  message = '';
  errors: any[] = [];

  modalRef: NgbModalRef = null;

  //PAGINATION
  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  pageLimit = 5;
  fields: any[] = [];
  domains: any[] = [];

  //MODELS (OBJECTS)
  object: any;
  paciente: Paciente = new Paciente();
  pacienteSelecionado: Paciente;
  estabelecimento: Estabelecimento = new Estabelecimento();
  estabelecimentoSelecionado: Estabelecimento;

  // MAPS
  map: google.maps.Map;
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;
  markers: google.maps.Marker[] = [];
  circle: google.maps.Circle;
  markerCluster: MarkerClusterer;
  count = 0;
  raio: string;
  showMessage = false;
  legendIconSrc: string;
  legendIconClass: string;

  // FILTERS
  idTipoUnidade: number;
  idModalidade: number;
  sexo = '';
  idadeDe: number;
  idadeAte: number;

  entries: any[] = [
    { id: 1, description: 'Localizar Estabelecimentos próximos a um Paciente' },
    { id: 2, description: 'Localizar Pacientes próximos a um Estabelecimento' },
  ];
  selectedEntry = this.entries[0];

  constructor(
    private pagerService: PagerService,
    private modalService: NgbModal,
    private service: GeorreferenciamentoService) {
  }

  ngOnInit() {
    this.createMap();
    this.loadDomains();
  }

  createMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: -23.6520717, lng: -46.637533},
      zoom: 13,
      gestureHandling: 'greedy'
    });

    this.marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    this.infowindow = new google.maps.InfoWindow();

    const self = this;

    this.marker.addListener('click', () => {
      if (self.object !== null) {
        self.openInfoWindow();
      }
    });

    // Fired when the map becomes idle after panning or zooming.
    google.maps.event.addListener(this.map, 'idle', function() {
      self.showVisibleMarkers();
    });

    this.setUserCurrentPosition();
  }

  showVisibleMarkers() {
    this.count = 0;
    const bounds: google.maps.LatLngBounds = this.map.getBounds();

    this.markers.forEach(marker => {
      if (bounds.contains(marker.getPosition())) {
        this.count++;
      }
    });
  }

  setUserCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      resp => {
        this.updateMarkerPosition(resp.coords.latitude, resp.coords.longitude);
      },
      error => {
        console.log(error);
      }
    );
  }

  loadDomains() {
    this.service.listDomains('tipo-unidade').subscribe(tipos => {
      this.service.listDomains('modalidade').subscribe(modalidades => {
        this.domains.push({
          idTipoUnidade: tipos,
          idModalidade: modalidades,
          sexo: [
            { id: 'F', nome: 'Feminino' },
            { id: 'M', nome: 'Masculino' }
          ]
        });
      });
    });
  }

  openInfoWindow() {
    let content = '';
    if (this.selectedEntry && this.selectedEntry.id === 1 && typeof this.pacienteSelecionado !== 'undefined') {
      content = `
        <div style="text-align: left;">
          <p>
            NOME: <b>${this.pacienteSelecionado.nome}</b><br>
            SEXO: <b>${this.pacienteSelecionado.sexo === 'M' ? 'Masculino' : 'Feminino'}</b><br>
            DATA NASC.: <b>${this.pacienteSelecionado.dataNascimento}</b><br>
            CARTÃO SUS: <b>${this.pacienteSelecionado.cartaoSus}</b><br>
          </p>
          <p>
            ENDEREÇO: <b>${this.pacienteSelecionado.logradouro}, ${this.pacienteSelecionado.numero}</b><br>
            BAIRRO: <b>${this.pacienteSelecionado.bairro}</b><br>
            MUNICÍPIO: <b>${this.pacienteSelecionado.idMunicipio}</b><br>
            ESTADO: <b>${this.pacienteSelecionado.idUf}</b><br>
          </p>
        </div>`;
    }
    if (this.selectedEntry && this.selectedEntry.id === 2 && typeof this.estabelecimentoSelecionado !== 'undefined') {
      content = `
        <div style="text-align: left;">
          <p>
            UNIDADE: <b>${this.estabelecimentoSelecionado.razaoSocial}</b><br>
            TIPO: <b>${this.estabelecimentoSelecionado.idTipoUnidade}</b><br>
            CNES: <b>${this.estabelecimentoSelecionado.cnes}</b><br>
          </p>
          <p>
            ENDEREÇO: <b>${this.estabelecimentoSelecionado.logradouro}, ${this.estabelecimentoSelecionado.numero}</b><br>
            BAIRRO: <b>${this.estabelecimentoSelecionado.bairro}</b><br>
            MUNICÍPIO: <b>${this.estabelecimentoSelecionado.idMunicipio}</b><br>
            ESTADO: <b>${this.estabelecimentoSelecionado.idUf}</b><br>
          </p>
        </div>`;
    }
    if (content !== '') {
      this.infowindow.setContent(content);
      this.infowindow.open(this.map, this.marker);
    }
  }

  updateMarkerPosition(latitude: number, longitude: number) {
    const latLng: google.maps.LatLng = new google.maps.LatLng(latitude, longitude);
    this.map.setCenter(latLng);
    this.map.setZoom(17);
    this.marker.setPosition(latLng);
    this.marker.setTitle(`${latitude}, ${longitude}`);
    if (this.selectedEntry && this.selectedEntry.id === 1 && this.pacienteSelecionado) {
      if (this.pacienteSelecionado.sexo === 'M') {
        this.marker.setIcon('http://maps.google.com/mapfiles/ms/micons/man.png');
      } else {
        this.marker.setIcon('http://maps.google.com/mapfiles/ms/micons/woman.png');
      }
    }
    if (this.selectedEntry && this.selectedEntry.id === 2 && this.estabelecimentoSelecionado) {
      this.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/hospitals.png');
    }
  }

  open(content: any, step: Number) {
    this.clear();

    if (step === 1) {
      this.selectedEntry = this.entries[0];

    } else {
      this.fields = [];

      if (this.selectedEntry.id === 1) {
        for (const field of this.service.fields1) {
          if (field.grid) {
            this.fields.push(field);
          }
        }
      }
      if (this.selectedEntry.id === 2) {
        for (const field of this.service.fields2) {
          if (field.grid) {
            this.fields.push(field);
          }
        }
      }
    }

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  clear() {
    this.paciente = new Paciente();
    this.estabelecimento = new Estabelecimento();
    this.pacienteSelecionado = null;
    this.estabelecimentoSelecionado = null;
    this.object = null;
    this.allItems = [];
    this.pagedItems = [];
    this.idTipoUnidade = null;
    this.idModalidade = null;
    this.sexo = null;
    this.idadeDe = null;
    this.idadeAte = null;
    this.raio = null;
    this.showMessage = false;
    this.message = '';
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }
    this.deleteMarkers();
    this.infowindow.close();
    this.deleteCircle();
    if (this.modalRef) {
      this.close();
      this.modalRef = null;
    }
    this.setUserCurrentPosition();
    this.count = 0;
  }

  toggleSearch() {
    if (this.selectedEntry && this.selectedEntry.id === 1) {
      return Util.isEmpty(this.paciente.cartaoSus) && Util.isEmpty(this.paciente.nome);
    }
    if (this.selectedEntry && this.selectedEntry.id === 2) {
      return Util.isEmpty(this.estabelecimento.cnes) && Util.isEmpty(this.estabelecimento.idTipoUnidade) && Util.isEmpty(this.estabelecimento.razaoSocial);
    }
  }

  close() {
    this.modalRef.close();
  }

  search() {
    this.loading = true;
    let params = '';
    let method = '';
    let object: any = '';

    if (this.selectedEntry.id === 1) {
      method = 'paciente';
      object = this.paciente;
    }

    if (this.selectedEntry.id === 2) {
      method = 'estabelecimento';
      object = this.estabelecimento;
    }

    if (!Util.isEmpty(object)) {
      if (Object.keys(object).length) {
        for (const key of Object.keys(object)) {
          if (!Util.isEmpty(object[key])) {
            params += key + '=' + object[key] + '&';
          }
        }
        if (params != '') {
          params = '?' + params;
        }
      }
    }

    this.service.list(method + params).subscribe(result => {
      this.allItems = result;
      this.setPage(1);
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  loadQuantityPerPage(event) {
    const id = parseInt(event.target.value);
    this.pageLimit = id;
    this.setPage(1);
  }

  seleciona(item) {
    if (this.selectedEntry && this.selectedEntry.id === 1) {
      this.pacienteSelecionado = item;
    }
    if (this.selectedEntry && this.selectedEntry.id === 2) {
      this.estabelecimentoSelecionado = item;
    }
  }

  confirma() {
    if (this.selectedEntry && this.selectedEntry.id === 1) {
      this.object = this.pacienteSelecionado;
    }
    if (this.selectedEntry && this.selectedEntry.id === 2) {
      this.object = this.estabelecimentoSelecionado;
    }
    this.buscaPontos(this.object.id, this.raio);
    this.modalRef.close();
  }

  buscaPontos(id: Number, raio: string) {
    this.loading = true;
    this.message = '';
    let method = '';

    if (this.selectedEntry && this.selectedEntry.id === 1) {
      this.legendIconSrc = 'http://maps.google.com/mapfiles/ms/icons/hospitals.png';
      this.legendIconClass = 'legend-icon-estabelecimento';

      method = `paciente/estabelecimentos/${id}/${raio}/${this.idTipoUnidade}`;
    }

    if (this.selectedEntry && this.selectedEntry.id === 2) {
      this.legendIconSrc = 'http://maps.google.com/mapfiles/ms/icons/toilets.png';
      this.legendIconClass = 'legend-icon-paciente';

      const idadeDe = this.idadeDe ? this.idadeDe : -1;
      const idadeAte = this.idadeAte ? this.idadeAte : -1;

      if (idadeDe > idadeAte) {
        this.message = 'A idade inicial não pode ser superior a idade final.';
      }

      method = `estabelecimento/pacientes/${id}/${raio}/${this.idModalidade}/${this.sexo}/${idadeDe}/${idadeAte}`;
    }

    this.service.list(method).subscribe(result => {
      const objects: any[] = result;
      this.deleteMarkers();
      if (objects.length > 0) {
        objects.forEach(object => {
          const marker: google.maps.Marker = this.addMarker(object.latitude, object.longitude, object);
          this.addInfowindow(marker, this.createInfoWindowContent(object));
        });
      } else {
        this.showMessage = true;
      }
      this.updateMarkerPosition(this.object.latitude, this.object.longitude);
      this.addCircle();
      this.mapFitBounds();
      setTimeout(() => {
        this.markerCluster = new MarkerClusterer(
          this.map,
          this.markers,
          {
            maxZoom: 15,
            gridSize: 50,
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          }
        );
        this.loading = false;
      }, 300);
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  createInfoWindowContent(object: any) {
    let content = '';

    if (this.selectedEntry && this.selectedEntry.id === 1) {
      const estabelecimento: Estabelecimento = object;
      content = `
        <div style="text-align: left;">
          <p>
            UNIDADE: <b>${estabelecimento.razaoSocial}</b><br>
            TIPO: <b>${estabelecimento.idTipoUnidade}</b><br>
            CNES: <b>${estabelecimento.cnes}</b><br>
          </p>
          <p>
            ENDEREÇO: <b>${estabelecimento.logradouro}, ${estabelecimento.numero}</b><br>
            BAIRRO: <b>${estabelecimento.bairro}</b><br>
            MUNICÍPIO: <b>${estabelecimento.idMunicipio}</b><br>
            ESTADO: <b>${estabelecimento.idUf}</b><br>
          </p>
          <p>
            DISTÂNCIA: <b>${estabelecimento.distancia.toLocaleString()} metro(s)</b>
          </p>
        </div>
      `;
    }

    if (this.selectedEntry && this.selectedEntry.id === 2) {
      const paciente: Paciente = object;
      content = `
        <div style="text-align: left;">
          <p>
            NOME: <b>${paciente.nome}</b><br>
            SEXO: <b>${paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}</b><br>
            DATA NASC.: <b>${paciente.dataNascimento}</b><br>
            CARTÃO SUS: <b>${paciente.cartaoSus}</b><br>
          </p>
          <p>
            ENDEREÇO: <b>${paciente.logradouro}, ${paciente.numero}</b><br>
            BAIRRO: <b>${paciente.bairro}</b><br>
            MUNICÍPIO: <b>${paciente.idMunicipio}</b><br>
            ESTADO: <b>${paciente.idUf}</b><br>
          </p>
          <p>
            DISTÂNCIA: <b>${paciente.distancia.toLocaleString()} metro(s)</b>
          </p>
        </div>
      `;
    }

    return content;
  }

  addMarker(latitude: number, longitude: number, object: any) {
    const latLng: google.maps.LatLng = new google.maps.LatLng(latitude, longitude);
    let image = '';

    if (this.selectedEntry && this.selectedEntry.id === 1) {
      image = 'http://maps.google.com/mapfiles/ms/icons/hospitals.png';
    }

    if (this.selectedEntry && this.selectedEntry.id === 2) {
      const paciente: Paciente = object;
      if (paciente.sexo === 'M') {
        image = 'http://maps.google.com/mapfiles/ms/micons/man.png';
      } else {
        image = 'http://maps.google.com/mapfiles/ms/micons/woman.png';
      }
    }

    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: image,
      title: `${latitude}, ${longitude}`
    });
    this.markers.push(marker);
    return marker;
  }

  addInfowindow(marker: google.maps.Marker, content: string) {
    const infowindow = new google.maps.InfoWindow({
      content: content
    });
    const self = this;
    marker.addListener('click', () => {
      infowindow.open(self.map, marker);
    });
  }

  deleteMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
    this.markerCluster = null;
  }

  mapFitBounds() {
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    if (this.marker) {
      bounds.extend(this.marker.getPosition());
    }
    if (this.circle) {
      bounds.extend(this.circle.getBounds().getNorthEast());
      bounds.extend(this.circle.getBounds().getSouthWest());
    }
    this.map.fitBounds(bounds);
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
  }

  addCircle() {
    this.deleteCircle();

    if (this.marker && this.raio) {
      this.circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.20,
        map: this.map,
        center: this.marker.getPosition(),
        radius: parseFloat(this.raio)
      });
    }
  }

  deleteCircle() {
    if (this.circle) {
      this.circle.setMap(null);
    }
    this.circle = null;
  }

  onSelectionChange(entry) {
    this.selectedEntry = entry;
  }

  disableLocalizar() {
    let disable: Boolean = Util.isEmpty(this.raio) || this.raio === '0';
    if (this.selectedEntry && this.selectedEntry === 1) {
      disable = disable || this.pacienteSelecionado === null || this.idTipoUnidade === null || this.idTipoUnidade === 0;
    }
    if (this.selectedEntry && this.selectedEntry === 2) {
      disable = disable || this.estabelecimentoSelecionado === null || this.idModalidade === null || this.sexo === null;
    }
    return disable;
  }

  onChangeCount(event) {
    if (event.currentTarget.checked) {
      this.markerCluster.setMap(this.map);
      this.markerCluster.addMarkers(this.markers);
    } else {
      this.markerCluster.clearMarkers();
    }
  }

}
