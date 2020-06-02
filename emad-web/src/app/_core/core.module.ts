import { NgModule } from "@angular/core";
import { AuthGuard } from "./_guards";
import { SocketService } from "./_services/socket.service";
import { NotificacaoSistemaService } from "./_services/notificacao-sistema.service";
import { AppNavbarService } from "./_components/app-navbar/app-navbar.service";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxMaskModule } from "ngx-mask";

@NgModule({
    imports: [
        NgxMaskModule.forRoot({ dropSpecialCharacters: false }),
        CurrencyMaskModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.none,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '4px',
            primaryColour: '#FDBA31',
            secondaryColour: '#FDBA31',
            tertiaryColour: '#ffffff'
        }),
    ],
    providers: [
        AuthGuard,
        SocketService,
        NotificacaoSistemaService,
        AppNavbarService
    ],
    exports: [NgxLoadingModule, CurrencyMaskModule, NgxMaskModule]
})
export class CoreModule {
}