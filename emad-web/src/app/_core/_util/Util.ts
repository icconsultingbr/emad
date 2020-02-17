import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";
import { Translation } from "../_locale/Translation";

export class Util {
    static urlapi: String = environment.apiUrl;
    static superAdmin: number = environment.superAdmin;


    static convertTimezone(data, utc) {
        var b = data.split(/\D/);
        let pipe = new DatePipe('en-US'); // Use your own locale
        let now = new Date(b[0], b[1], b[2], Number(b[3]) + Number(utc), b[4], b[5]);
        let myFormattedDate = pipe.transform(now, 'dd/MM/yyyy HH:mm');
        return myFormattedDate;
    }

    static convertDateToString(date: Date, format: string) {
        let pipe = new DatePipe('en-US'); // Use your own locale
        let myFormattedDate = pipe.transform(date, format);
        return myFormattedDate;
    }

    static customHTTPResponse(erro: any) {

        let errors = [];

        if (erro.status == 400) {
            let json = JSON.parse(erro._body);
            for (let error of json) {
                errors.push({ message: error.msg });
            }
        }
        else {
            errors.push({
                field: "",
                message: Translation.t("SERVICE_UNAVAILABLE")
            });
        }

        return errors;
    }

    static dateFormat(val: String, pattern: string) {
        if (val) {
            let parts2;

            if (val.toString().indexOf('/') >= 0) {
                let parts = val.split(" ");
                parts2 = parts[0].split("/");

                if (parts.length > 1) {
                    val = parts2[1] + "/" + parts2[0] + "/" + parts2[2] + " " + parts;
                }
                else {
                    val = parts2[1] + "/" + parts2[0] + "/" + parts2[2];
                }
            }

            let pipe = new DatePipe('en-GB');
            return pipe.transform(val, pattern);
        }
        return null;
    }


    static convertToCurrency(number) {
        if (number != "" && number != null) {
            let nbr = "";
            number = number.replace(",", ".");
            let first = number.substring(0, number.length - 3);
            let last = number.substr(number.length - 2);
            nbr = first + "," + last;

            return nbr;
        } else {
            return null;
        }
    }

    static savePageState(object, page, route, domains, textoProcurado) {
        localStorage.setItem('object', JSON.stringify(object));
        localStorage.setItem('page', JSON.stringify(page));
        localStorage.setItem('route', route);
        localStorage.setItem('domains', JSON.stringify(domains));
        localStorage.setItem('textoProcurado', textoProcurado);
    }

    static resetPageState() {
        localStorage.removeItem('object');
        localStorage.removeItem('page');
        localStorage.removeItem('route');
        localStorage.removeItem('domains');
        localStorage.removeItem('textoProcurado');
    }

    static getPageState(param) {
        if (param == 'object') {
            return localStorage.getItem('object');
        }
        else if (param == 'page') {
            return localStorage.getItem('page');
        }
        else if (param == 'route') {
            return localStorage.getItem('route');
        }
        else if (param == 'domains') {
            return localStorage.getItem('domains');
        }
        else if (param == 'textoProcurado') {
            return localStorage.getItem('textoProcurado');
        }
    }

    static maskDocument(doc, type = null) {
        let size = 0;
        let result = "";

        if (type != null) {
            if (type == 'CPF') {
                size = 11;
            } else if (type == 'CNPJ') {
                size = 14;
            }
            doc = this.pad(doc, size);
        }

        if (doc.length == 11) {
            result = doc.substring(0, 3) + "." + doc.substring(3, 6) + "." + doc.substring(6, 9) + "-" + doc.substring(9, 11);
        } else if (doc.length == 14) {
            result = doc.substring(0, 2) + "." + doc.substring(2, 5) + "." + doc.substring(5, 8) + "/" + doc.substring(8, 12) + "-" + doc.substring(12, 14);
        }

        return result;
    }


    static pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;

    }

    static documentToNumber(cnpjCpf) {
        return cnpjCpf.replace(/[.//-]/g, '');
    }


    public static isValidCNPJ(cnpj) {

        let valid: Boolean = false;

        if (cnpj.length == 18 && cnpj != '00.000.000/0000-00') {

            var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
            var dig1 = 0;
            var dig2 = 0;

            cnpj = cnpj.replace(/[.//-]/g, '').toString();

            var digito = cnpj[12] + "" + cnpj[13];

            for (var i = 0; i < valida.length; i++) {
                dig1 += (i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0);
                dig2 += cnpj.charAt(i) * valida[i];
            }
            dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
            dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));

            if ((dig1 + "" + dig2) != digito) {
                return valid;
            }
            valid = true;
        }
        return valid;
    }


    public static isValidCPF(cpf) {
        let valid: Boolean = false;

        if (cpf.length == 14 && cpf != '000.000.000-00' && cpf != '111.111.111-11' && cpf != '222.222.222-22'
            && cpf != '333.333.333-33' && cpf != '444.444.444-44' && cpf != '555.555.555-55' && cpf != '666.666.666-66'
            && cpf != '777.777.777-77' && cpf != '888.888.888-88' && cpf != '999.999.999-99') {
            var dig1 = 0;
            var dig2 = 0;
            var vlr = 11;

            cpf = cpf.replace(/[.//-]/g, '');
            var digito = cpf[9] + "" + cpf[10];

            for (var i = 0; i < 9; i++) {
                dig1 += (cpf.charAt(i) * (vlr - 1));
                dig2 += (cpf.charAt(i) * vlr);
                vlr--;
            }
            dig1 = (((dig1 * 10) % 11) == 10 ? 0 : ((dig1 * 10) % 11));
            dig2 = (((dig2 + (2 * dig1)) * 10) % 11);

            var digitoVerificado = dig1 + "" + dig2;
            if (digitoVerificado != digito) {
                return valid;
            }
            valid = true;
        }
        return valid;
    }


    public static compareDate(date1: Date, date2: Date): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1); let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
    }

    static setPageState(param, object) {
        localStorage.setItem(param, JSON.stringify(object));
    }

    static isEmpty(q: any) {
        if (q === null) {
            return true;
        } else if (q === undefined) {
            return true;

        } else if (q == null) {
            return true;

        } else if (q == undefined) {
            return true;

        } else if (q == "") {
            return true;
        } else if (q == "null") {
            return true;
        } else if (q == "nundefined") {
            return true;
        } else {
            return false;
        }
    }


    static formatarData(str) {

        var meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ];
        var dias = ["domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

        var partes = str.split('/');
        var data = new Date(parseInt('20' + partes[2]), partes[1] - 1, partes[0]);
        var diaSemana = dias[data.getDay() % 7];
        var mes = meses[data.getMonth()];
        return [data.getDate(), mes.slice(0, 3).toLowerCase(), '(' + diaSemana.slice(0, 3) + ') - ' + data.getFullYear().toString().slice(2, 6)].join(' ');
    }

    static cCalendar(hoje, weekDayIn, weekDayOut) {

        let dt = new Date(hoje);

        if (weekDayIn == weekDayOut) {
            return Util.formatarData(Util.dateFormat(dt.setDate(hoje.getDate()).toString(), "dd/MM/yyyy"));
        } else if (weekDayOut == 0) {
            return Util.formatarData(Util.dateFormat(dt.setDate((hoje.getDate() - weekDayIn)).toString(), "dd/MM/yyyy"));
        } else {
            if (weekDayOut > weekDayIn) {
                return Util.formatarData(Util.dateFormat(dt.setDate((hoje.getDate() + (weekDayOut - weekDayIn))).toString(), "dd/MM/yyyy"));
            } else {
                return Util.formatarData(Util.dateFormat(dt.setDate((hoje.getDate() - (weekDayIn - weekDayOut))).toString(), "dd/MM/yyyy"));
            }
        }
    }

    static cdCalendar(hoje, weekDayIn, weekDayOut) {
        let dt = new Date(hoje);

        if (weekDayIn == weekDayOut) {
            return dt.setDate(hoje.getDate());
        } else if (weekDayOut == 0) {
            return dt.setDate((hoje.getDate() - weekDayIn));
        } else {
            if (weekDayOut > weekDayIn) {
                return dt.setDate((hoje.getDate() + (weekDayOut - weekDayIn)));
            } else {
                return dt.setDate((hoje.getDate() - (weekDayIn - weekDayOut)));
            }
        }
    }

    static getInitialsOfName(str : String) {
        let matches = str.match(/\b(\w)/g); 

        return matches.join('').toUpperCase();
    }
}