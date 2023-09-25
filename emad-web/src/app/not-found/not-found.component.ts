import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../_core/_components/app-navbar/app-navbar.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(public nav: AppNavbarService) {}

  ngOnInit() {
    this.nav.show();
  }

}
