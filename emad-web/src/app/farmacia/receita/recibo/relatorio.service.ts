export class RelatorioService {

    protected style = '';
    protected script = '';

    print(content){
        var popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");

        popupWin.document.open();
        popupWin.document.write(`<html>
            <head>
                <meta name="viewport" content="width = device-width, initial-scale = 1">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">
                <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-maskmoney/3.0.2/jquery.maskMoney.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
                ${this.style}
                ${this.script}
            </head>
            <body>
                ${ content }
            </body>
        </html>`);

        popupWin.document.close();
    }
}