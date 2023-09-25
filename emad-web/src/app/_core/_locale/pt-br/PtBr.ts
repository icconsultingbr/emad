import { Http } from '@angular/http';

export class PtBr {

  static translate(term) {

    const obj = {
      'SERVICE_UNAVAILABLE': 'Serviço indisponível',
      'GET' : 'Visualizou',
      'POST' : 'Inseriu o registro',
      'PUT' : 'Alterou o registro',
      'DELETE' : 'Deletou',
      '/menu/tipo-usuario' : 'Consultou o menu por tipo de usuário',
      '/log' : 'Consultou a lista de logs',
      '/estabelecimento' : 'Funcionalidade estabelecimentos',
      '/usuario/redefinir-senha' : 'Funcionalidade redefinir senha',
      '/profissional' : 'Funcionalidade profissionais',
      '/tipo-usuario' : 'Funcionalidade grupo de usuário',
      '/usuario' : 'Funcionalidade usuário',
      '/especialidade' : 'Funcionalidade especialidade',
      '/medicamento' : 'Funcionalidade medicamento',
      '/hipotese-diagnostica' : 'Funcionalidade hipótese diagnostica',
      '/modalidade' : 'Funcionalidade modalidade',
      '/tipo-unidade' : 'Funcionalidade tipo de unidade',
      '/atendimento' : 'Funcionalidade atendimento',
      '/login' : 'Tela de login',
      '/atendimento/open-document' : 'Visualizou a ficha do atendimento',
      '/atendimento/print-document' : 'Solicitou a ficha do atendimento para impressão'

    };

    if (obj.hasOwnProperty(term)) {
      return obj[term];
    } else {
      return term;
    }
  }
}
