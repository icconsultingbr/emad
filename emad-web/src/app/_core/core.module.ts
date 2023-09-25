import { NgModule } from '@angular/core';
import { AuthGuard } from './_guards';
import { SocketService } from './_services/socket.service';
import { NotificacaoSistemaService } from './_services/notificacao-sistema.service';
import { AppNavbarService } from './_components/app-navbar/app-navbar.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EmadHttpInterceptor } from './interceptors/emad-http.interceptor';
import { LoaderService } from './loaders/services/loader.service';
import { LoaderComponent } from './loaders/components/loader/loader.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AuthService } from './auth/auth.service';
import { RouterModule } from '@angular/router';
import { UserInfoService } from './_services/user-info.service';

@NgModule({
    imports: [
        HttpClientModule,
        RouterModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.none,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '4px',
            primaryColour: '#FDBA31',
            secondaryColour: '#FDBA31',
            tertiaryColour: '#ffffff'
        }),
        NgxMaskModule.forRoot({ dropSpecialCharacters: false }),
        CurrencyMaskModule,
    ],
    declarations: [
        LoaderComponent
    ],
    providers: [
        AuthGuard,
        AuthService,
        SocketService,
        NotificacaoSistemaService,
        AppNavbarService,
        UserInfoService,
        LoaderService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: EmadHttpInterceptor,
            multi: true,
        }
    ],
    entryComponents: [
        LoaderComponent
    ],
    exports: [CurrencyMaskModule, NgxMaskModule, LoaderComponent]
})
export class CoreModule {
}
