import { NgModule } from "@angular/core";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoaderService } from "./services/loader.service";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        // CommonModule,
        // NgxLoadingModule.forRoot({
        //     animationType: ngxLoadingAnimationTypes.none,
        //     backdropBackgroundColour: 'rgba(0,0,0,0.1)',
        //     backdropBorderRadius: '4px',
        //     primaryColour: '#FDBA31',
        //     secondaryColour: '#FDBA31',
        //     tertiaryColour: '#ffffff'
        // })
    ],
    declarations: [
        //LoaderComponent,
    ],
    providers: [
        //LoaderService
    ],
    exports: [
        //LoaderComponent
    ]
})
export class LoaderModule {
}