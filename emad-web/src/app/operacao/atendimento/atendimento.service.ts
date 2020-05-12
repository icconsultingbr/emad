import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

@Injectable()
export class AtendimentoService extends GenericsService {
    fields: any[] = [
        {
            field: "id",
            type: "hidden",
            label: "ID",
            grid: true,
            form: false,
            required: false,
            validator: ['', '']
        },
        {
            field: "cartaoSus",
            type: "text",
            label: "Cartão SUS",
            grid: true,
            form: false,
            mask: "9999",
            required: true,
            validator: ['', ''],
            filter: {
                type: "text",
                grid: true
            }
        },
        {
            field: "idSap",
            type: "text",
            label: "ID SAP",
            grid: true,
            form: false,
            required: true,
            validator: ['', ''],
            autoFocus: true,
            filter: {
                type: "text",
                grid: true
            }
        },
        {
            field: "cpf",
            type: "text",
            label: "CPF",
            mask: '999.999.999-99',
            placeHolder: '999.999.999-99',
            grid: false,
            form: false,
            required: true,
            validator: ['', ''],
            filter: {
                type: 'text',
                placeHolder: '999.999.999-99',
                mask: '999.999.999-99',
                grid: true
            }
        },
        {
            field: "nomePaciente",
            type: "text",
            label: "Nome do paciente",
            grid: true,
            form: false,
            required: true,
            validator: ['', ''],
            filter: {
                type: 'text',
                grid: true
            }
        },
        {
            field: "dataCriacao",
            type: "text",
            label: "Data do atendimento",
            grid: true,
            form: false,
            required: true,
            isDateTime: true,
            validator: ['', ''],
            filter: {
                type: 'date',
                placeHolder: '99/99/9999',
                grid: true
            }
        },
        {
            field: "idEstabelecimento",
            type: "text",
            label: "Id do estabelecimento",
            grid: false,
            form: false,
            required: true,
            validator: ['', ''],
            filter: {
                type: "select"
            }
        },
        {
            field: "nomeFantasia",
            type: "text",
            label: "Nome do estabelecimento",
            grid: true,
            form: false,
            required: true,
            validator: ['', ''],
            autoFocus: true
        },
        {
            field: "idUsuario",
            type: "text",
            label: "ID do profissional",
            grid: false,
            form: false,
            required: true,
            validator: ['', '']
        },
        {
            field: "nome",
            type: "text",
            label: "Nome do profissional",
            grid: true,
            form: false,
            required: true,
            validator: ['', '']
        },
        {
            field: "situacao",
            type: "text",
            label: "Situação",
            grid: true,
            form: false,
            translate: { "A": "Alta", "C": "Continuidade" },
            required: true,
            validator: ['', ''],
            filter : {
                type: "select",
                grid: true
              }
        },
        {
            field: "situacaoAtendimento",
            type: "text",
            label: "Atendimento",
            grid: true,
            form: false,
            required: true,
            validator: ['', ''],
            filter : {
                type: "select",
                grid: true
              }
        },


    ];

    findByIdPaciente(id: any, idEstabelecimento: Number, method: String): Observable<any> {
        return this.http.get(this.url + method + "/paciente/" + id + "/" + idEstabelecimento, { headers: this.headers }).map(res => res.json());
    }

    findHipoteseByAtendimento(id: any): Observable<any> {
        return this.http.get(this.url + "atendimento-hipotese/atendimento/" + id, { headers: this.headers }).map(res => res.json());
    }

    printDocument(url): Observable<any> {
        let object: any = {};
        object.url = url;
        return this.http.post(this.url + "atendimento/print-document", JSON.stringify(object),  { headers: this.headers }).map(res => res.json());

    }

    openDocument(url): Observable<any> {
        let object: any = {};
        object.url = url;
        return this.http.post(this.url + "atendimento/open-document", JSON.stringify(object), { headers: this.headers }).map(res => res.json());
    }

    findEncaminhamentoByAtendimento(id: any): Observable<any> {
        return this.http.get(this.url + "atendimento-encaminhamento/atendimento/" + id, { headers: this.headers }).map(res => res.json());
    }

    findMedicamentoByAtendimento(id: any): Observable<any> {
        return this.http.get(this.url + "atendimento-medicamento/atendimento/" + id, { headers: this.headers }).map(res => res.json());
    }

    saveHipotese(obj: any) {
        if (obj.id) {
            return this.http
                .put(this.url + 'atendimento-hipotese', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
        else {
            return this.http
                .post(this.url + 'atendimento-hipotese', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
    }

    stopProcess(obj: any) {

        return this.http
            .put(this.url + 'atendimento/parar-atendimento', JSON.stringify(obj), { headers: this.headers })
            .map((res) => res.json());
    }

    saveEncaminhamento(obj: any) {
        if (obj.id) {
            return this.http
                .put(this.url + 'atendimento-encaminhamento', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
        else {
            return this.http
                .post(this.url + 'atendimento-encaminhamento', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
    }

    saveMedicamento(obj: any) {
        if (obj.id) {
            return this.http
                .put(this.url + 'atendimento-medicamento', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
        else {
            return this.http
                .post(this.url + 'atendimento-medicamento', JSON.stringify(obj), { headers: this.headers })
                .map((res) => res.json());
        }
    }

    removeHipotese(params: any) {
        return this.http.delete(this.url + 'atendimento-hipotese/' + params, { headers: this.headers }).map(res => res.json());
    }

    removeEncaminhamento(params: any) {
        return this.http.delete(this.url + 'atendimento-encaminhamento/' + params, { headers: this.headers }).map(res => res.json());
    }

    removeMedicamento(params: any) {
        return this.http.delete(this.url + 'atendimento-medicamento/' + params, { headers: this.headers }).map(res => res.json());
    }
}
