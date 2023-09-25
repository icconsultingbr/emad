import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { PedidoCompraComponent } from './pedido-compra.component';
import { PedidoCompraFormComponent } from './pedido-compra-form.component';
import { PedidoCompraService } from './pedido-compra.service';
import { pedidoCompraRoutes } from './pedido-compra.routing';
import { PesquisaMedicamentoModule } from '../../../components/pesquisa-medicamentos/pesquisa-medicamento.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(pedidoCompraRoutes),
        PesquisaMedicamentoModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule
    ],
    declarations: [
        PedidoCompraComponent,
        PedidoCompraFormComponent,
    ],
    providers: [
        PedidoCompraService
    ]
})
export class PedidoCompraModule {
}
