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
            validator: ['', ''],
            sortable: false
        },
        {
            field: "id",
            type: "hidden",
            label: "Código",
            grid: true,
            form: false,
            required: false,
            validator: ['', ''],
            sortable: true
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
            },
            sortable: true
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
            },
            sortable: true
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
            },
            sortable: true
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
            sortable: true
        },
        {
            field: "dataCriacaoInicial",
            type: "text",
            label: "Data do atendimento inicial",
            grid: false,
            form: false,
            required: false,
            isDateTime: true,
            validator: ['', ''],
            filter: {
                type: 'date',
                placeHolder: '99/99/9999',
                grid: true
            },
            sortable: true
        },
        {
            field: "dataCriacaoFinal",
            type: "text",
            label: "Data do atendimento final",
            grid: false,
            form: false,
            required: false,
            isDateTime: true,
            validator: ['', ''],
            filter: {
                type: 'date',
                placeHolder: '99/99/9999',
                grid: true
            },
            sortable: true
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
            autoFocus: true,
            sortable: true
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
            validator: ['', ''],
            sortable: true
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
                "X": "Cancelado"
            },
            required: true,
            validator: ['', ''],
            filter: {
                type: "select",
                grid: true
            },
            sortable: true
        }
    ];

    findByIdPaciente(id: any, idEstabelecimento: Number, method: string): Observable<any> {
        return this.http.get(method + "/paciente/" + id + "/" + idEstabelecimento);
    }

    findHipoteseByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-hipotese/atendimento/" + id);
    }

    findVacinaByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-vacina/atendimento/" + id);
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

    findCondicaoAvaliadaByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-condicao-avaliada/atendimento/" + id);
    }


    findEncaminhamentoByPaciente(id: any): Observable<any> {
        return this.http.get("atendimento-encaminhamento/usuario/" + id);
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

    saveVacina(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-vacina', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-vacina', JSON.stringify(obj));
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

    saveParticipanteAtividadeColetiva(obj: any) {
        if (obj.id) {
            return this.http
                .put('participante-atividade-coletiva', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('participante-atividade-coletiva', JSON.stringify(obj));
        }
    }

    savetiposFornecimOdonto(obj: any) {
        if (obj.id) {
            return this.http
                .put('tipo-odonto-atendimento', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('tipo-odonto-atendimento', JSON.stringify(obj));
        }
    }

    savetiposVigilanciaSaudeBucal(obj: any) {
        if (obj.id) {
            return this.http
                .put('tipo-vigilancia-odonto', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('tipo-vigilancia-odonto', JSON.stringify(obj));
        }
    }

    saveProfissionalAtividadeColetiva(obj: any) {
        if (obj.id) {
            return this.http
                .put('profissional-atividade-coletiva', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('profissional-atividade-coletiva', JSON.stringify(obj));
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

    removeVacina(params: any) {
        return this.http.delete('atendimento-vacina/' + params);
    }

    removeHipotese(params: any) {
        return this.http.delete('atendimento-hipotese/' + params);
    }

    removeEncaminhamento(params: any) {
        return this.http.delete('atendimento-encaminhamento/' + params);
    }

    removeCondicaoAvaliada(params: any) {
        return this.http.delete('atendimento-condicao-avaliada/' + params);
    }

    removeParticipante(params: any) {
        return this.http.delete('participante-atividade-coletiva/' + params);
    }

    removeProfissional(params: any) {
        return this.http.delete('profissional-atividade-coletiva/' + params);
    }

    removetiposVigilanciaOdontoPorAtendimento(params: any) {
        return this.http.delete('tipo-vigilancia-odonto/' + params);
    }

    removetiposFornecimentoOdontoPorAtendimento(params: any) {
        return this.http.delete('tipo-odonto-atendimento/' + params);
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

    saveProcedimento(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-procedimento', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-procedimento', JSON.stringify(obj));
        }
    }

    saveAtendimentoCodicaoAvaliada(obj: any) {
        if (obj.id) {
            return this.http
                .put('atendimento-condicao-avaliada', JSON.stringify(obj));
        }
        else {
            return this.http
                .post('atendimento-condicao-avaliada', JSON.stringify(obj));
        }
    }

    findProcedimentoByAtendimento(id: any): Observable<any> {
        return this.http.get("atendimento-procedimento/atendimento/" + id);
    }

    findTipoFichaEstabelecimento(id: any): Observable<any> {
        return this.http.get("atendimento-procedimento/tipo-ficha/" + id);
    }

    removeProcedimento(params: any) {
        return this.http.delete('atendimento-procedimento/' + params);
    }

    findParticipanteAtividadeColetivaByAtendimento(id: any): Observable<any> {
        return this.http.get("participante-atividade-coletiva/atendimento/" + id);
    }

    findProfissionalAtividadeColetivaByAtendimento(id: any): Observable<any> {
        return this.http.get("profissional-atividade-coletiva/atendimento/" + id);
    }

    findtiposFornecimentoOdontoPorAtendimento(id: any): Observable<any> {
        return this.http.get("tipo-odonto-atendimento/" + id);
    }

    findtiposVigilanciaOdontoPorAtendimento(id: any): Observable<any> {
        return this.http.get("tipo-vigilancia-odonto/" + id);
    }

    carregaTipoAtendimentoPorTipoFicha(id: any): Observable<any> {
        return this.http.get("tipo-atendimento/tipo-ficha/" + id);
      }

    findByEstrategiaPorVacina(codigoVacinaSus: any): Observable<any> {
        return this.http.get("dominios/estrategia-vacinacao/" + codigoVacinaSus);
    }

    findByDosePorEstrategiaVacina(codigoVacinaSus: any, codigoEstrategiaVacinacaoSus: any): Observable<any> {
        return this.http.get("dominios/dose-vacina-sus/" + codigoVacinaSus + "?codigoEstrategiaVacinacaoSus=" + codigoEstrategiaVacinacaoSus);
    }

    reabreAtendimento(obj: any) {
        return this.http.put('atendimento/reabertura', JSON.stringify(obj));
    }
}


