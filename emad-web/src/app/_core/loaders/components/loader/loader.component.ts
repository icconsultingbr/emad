import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  private _loading = false;

  public get loading(): boolean {
    return this._loading;
  }

  @Input()
  public set loading(value: boolean) {
    this._loading = value;
  }

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.opened()
    .subscribe(_ => {
      this.loading = true;
    });

    this.loaderService.closed()
    .subscribe(_ => {
      this.loading = false;
    });
  }
}
