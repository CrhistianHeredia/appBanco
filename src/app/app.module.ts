import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApirequestService } from './apirequest.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule
  ],
  providers: [
    ApirequestService,
    { provide: LOCALE_ID, useValue: 'en_US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
