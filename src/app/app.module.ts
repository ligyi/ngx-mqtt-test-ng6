import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MqttModule } from 'ngx-mqtt';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MqttModule.forRoot({ hostname: 'localhost', port: 1884, connectOnCreate: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
