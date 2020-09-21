import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AtendimentoService extends GenericsService {
    constructor(public http: HttpClient) {
        super(http);
    }
    fields: any[] = [
        {
            field: "corIconeGrid",
            type: "icone",
            label: "",
            icon: "fa-square",            
            grid: true,
            colunaDescricao: "tooltipIconeGrid",
            form: false,
            required: false,
            validator: ['', '']
        },         
        {
            field: "id",
            type: "hidden",
            label: "Código",
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
            label: "Número Sap",
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
            field: "tipoFichaNome",
            type: "text",
            label: "Tipo de atendimento",
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
            translate: { 
                         "0": "Sala de espera",         
                         "C": "Em aberto", 
                         "2": "Concluído",
                         "A": "Alta",                          
                         "E": "Evasão", 
                         "5": "Transferência hospitalar/ambulatório",
                         "6": "Transferência unidade prisional",
                         "7": "Desinternação",
                         "8": "Álvara de soltura",
                         "O": "Óbito", 
                         "X": "Cancelado" },
            required: true,
            validator: ['', ''],
            filter: {
                type: "select",
                grid: true
            }
        }
    ];

    findByIdPaciente(id: any, idEstabelecimento: Number, method: string): Observable<any> {
        return this.http.get(method + "/paciente/" + id + "/" + idEstabelecimento);
    }

    findHipoteseByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-hipotese/atendimento/" + id);
    }

    printDocument(url: string): Observable<any> {
        let object: any = {};
        object.url = url;
        return this.http.post("atendimento/print-document", JSON.stringify(object));

    }

    openDocument(url: string): Observable<any> {
        let object: any = {};
        object.url = url;
        return this.http.post("atendimento/open-document", JSON.stringify(object));
    }

    findEncaminhamentoByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-encaminhamento/atendimento/" + id);
    }

    findMedicamentoByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-medicamento/atendimento/" + id);
    }

    findHistoricoByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-historico/" + id);
    }

    findByHistoricoId(id: any): Observable<any> {
        return this.http.get("atendimento/historico/" + id);
    }    

    saveHipotese(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-hipotese', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-hipotese', JSON.stringify(obj));
        }
    }

    stopProcess(obj: any) {
        return this.http
            .put('atendimento/parar-atendimento', JSON.stringify(obj));
    }

    saveEncaminhamento(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-encaminhamento', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-encaminhamento', JSON.stringify(obj));
        }
    }

    saveMedicamento(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-medicamento', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-medicamento', JSON.stringify(obj));
        }
    }

    removeHipotese(params: any) {
        return this.http.delete('atendimento-hipotese/' + params);
    }

    removeEncaminhamento(params: any) {
        return this.http.delete('atendimento-encaminhamento/' + params);
    }

    removeMedicamento(params: any) {
        return this.http.delete('atendimento-medicamento/' + params);
    }

    enviaFicha(obj: any) {
        return this.http.put('atendimento/envia-ficha/', JSON.stringify(obj));
    }

    atribuirAtendimento(obj: any) {
        return this.http.put('atendimento/atribuir-atendimento/', JSON.stringify(obj));
    }
    
    carregaEntidadeCampoPorEspecialidade(): Observable<any> {
        return this.http.get("especialidade-entidade-campo/especialidade");
    }

    findHipoteseByPaciente(id: any): Observable<any> {
        return this.http.get("atendimento-hipotese/paciente/" + id);
      }
}