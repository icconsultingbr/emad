import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { LivroComponent } from './livro.component';
import { LivroFormComponent } from './livro-form.component';
import { LivroService } from './livro.service';
import { livroRoutes } from './livro.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(livroRoutes)
    ],
    declarations: [
        LivroComponent,
        LivroFormComponent,
    ],
    providers: [
        LivroService
    ]
})
export class LivroModule {
}
