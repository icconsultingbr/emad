import { Routes } from "@angular/router";
import { ConfiguracaoAtendimentoFormComponent } from "./configuracao-atendimento-form.component";
import { ConfiguracaoAtendimentoComponent } from "./configuracao-atendimento.component";

export const configuracaoAtendimentoRoutes: Routes = [
    {
        path: '',
        component: ConfiguracaoAtendimentoComponent,
    },
    {
        path: 'cadastro',
        component: ConfiguracaoAtendimentoFormComponent,
    },
    {
        path: 'cadastro/:id',
        component: ConfiguracaoAtendimentoFormComponent,
    }
];