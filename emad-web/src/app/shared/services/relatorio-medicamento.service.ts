import { ExportToCsv } from "export-to-csv";

export abstract class RelatorioMedicamentoService {

    protected style = '';
    protected script = '';

    print(content: string, nomeEstabelecimento: string, target: string = '_blank'){
        var popupWin = window.open(null, target);

        popupWin.document.open();
        popupWin.document.write(`<html>
            <head>
                <meta name="viewport" content="width = device-width, initial-scale = 1">                
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">
                <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>                
                ${this.style}
                ${this.script}
            </head>
            <body>
                ${ content }
            </body>
        </html>`);
        popupWin.document.title = "Medicamento-"  + (nomeEstabelecimento == "" ? "Medicamento" : nomeEstabelecimento);
        popupWin.document.close();
    }

    exportCsv(data){
        const options = { 
            fieldSeparator: ';',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true, 
            showTitle: false,            
            filename: 'Relatório-Medicamento-Paciente',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: false,
            // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
          };
         
        const csvExporter = new ExportToCsv(options);
         
        csvExporter.generateCsv(data);
    }
}