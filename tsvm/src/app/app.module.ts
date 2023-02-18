import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { TerminalComponent } from './terminal/terminal.component';
import { IdeComponent } from './ide/ide.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    IdeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
