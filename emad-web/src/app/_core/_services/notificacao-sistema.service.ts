import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { SocketService } from './socket.service';

@Injectable()
export class NotificacaoSistemaService {

  messages: Subject<any>;

  constructor(private socketService:SocketService) { 
    if (localStorage.getItem('currentUser')) {
    this.messages = <Subject<any>>this.socketService.connect()
      .map((response: any): any => {
        console.log('SOCKET >> response:',response);
        return response;
      }) 
    }
  }

}
