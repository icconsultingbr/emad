import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { AppModalComponent } from "./app-modal.component";


@NgModule({
    imports: [CommonModule, RouterModule],
    declarations : [AppModalComponent],
    exports : [AppModalComponent]
})

export class AppModalModule{}


