import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedServiceModule } from "../../shared/services/shared-service.module";
import { VisualizacaoPowerBIComponent } from "./visualizacao-power-bi.component";
import { visualizacaoPowerBIRoutes } from "./visualizacao-power-bi.routing";
import { VisualizacaoPowerBiService } from "./visualizacao-power-bi.service";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(visualizacaoPowerBIRoutes),        
        SharedServiceModule
    ],
    declarations: [        
        VisualizacaoPowerBIComponent,
    ],
    providers: [
        VisualizacaoPowerBiService
    ]
})
export class VisualizacaoPowerBIModule {
}