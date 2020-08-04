import { Routes } from "@angular/router";
import { PedidoCompraFormComponent } from "./pedido-compra-form.component";
import { PedidoCompraComponent } from "./pedido-compra.component";

export const pedidoCompraRoutes: Routes = [
    {
        path: '',
        component: PedidoCompraComponent,        
    },
    {
        path: 'cadastro',
        component: PedidoCompraFormComponent,        
    },
    {
        path: 'cadastro/:id',
        component: PedidoCompraFormComponent,        
    }
];