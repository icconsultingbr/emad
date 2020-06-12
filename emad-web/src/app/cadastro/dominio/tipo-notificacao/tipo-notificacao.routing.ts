import { Routes } from "@angular/router";
import { TipoNotificacaoFormComponent } from "./tipo-notificacao-form.component";
import { TipoNotificacaoComponent } from "./tipo-notificacao.component";

export const tipoNotificacaoRoutes: Routes = [
    {
        path: '',
        component: TipoNotificacaoComponent,        
    },
    {
        path: 'cadastro',
        component: TipoNotificacaoFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: TipoNotificacaoFormComponent,        
    }
];