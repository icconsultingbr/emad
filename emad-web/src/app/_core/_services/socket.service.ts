import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { AuthGuard } from '../_guards';

@Injectable()
export class SocketService {

  private socket;
  private usuarioID: number;
  private idEmpresa: number;
  token = '';
  private isConnected = false;

  constructor(auth: AuthGuard) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.usuarioID = JSON.parse(user).id;
      this.idEmpresa = JSON.parse(user).idEmpresa;
      this.token = auth.getToken();
    }

  }

  public connect(): Rx.Subject<MessageEvent> {

    if (this.usuarioID && !this.isConnected) {

      this.socket = io(environment.socketUrl, {
        query: { token: this.token },
        transports: ['websocket'],
        path: environment.socketPath + '/socket.io'
      });

      this.socket.on('disconnect', function() {
        this.isConnected = false;
      });

      this.socket.on('connect', function () {
        console.log('connected!');
        this.isConnected = true;
      });


      const observable = new Observable(observer => {
        this.socket.on('notification' + this.usuarioID, (data) => {
          console.log('Received notification from Websocket Server');
          observer.next(data);
        });

        this.socket.on('extrato' + this.idEmpresa, (data) => {
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      });

      const observer = {
        next: (data: Object) => {
          this.socket.emit('message', JSON.stringify(data));
        },
      };

      return Rx.Subject.create(observer, observable);
    }

  }

}
