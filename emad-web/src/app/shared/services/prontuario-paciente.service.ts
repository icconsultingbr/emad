export abstract class RelatorioProntuarioPacienteService {

    protected style = '';
    protected script = '';

    print(content: string, target: string = '_blank', nomePaciente: string) {
        const popupWin = window.open(null, target);

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
        popupWin.document.title = 'ProntuarioPaciente-'  + nomePaciente;
        popupWin.document.close();
    }
}
