import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface IMqttSubscription {
  subscription?: Subscription;
  id: number;
  payload: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private counter = 0;

  mqttSubscriptions: IMqttSubscription[] = [];

  constructor(private mqtt: MqttService) { }

  ngOnInit() {
    this.observe();
    setTimeout(() => this.mqtt.unsafePublish('topic', 'unretained message', { retain: false, qos: 0 }), 2000);
    setTimeout(() => this.observe(), 4000);
    setTimeout(() => this.mqtt.unsafePublish('topic', 'retained message', { retain: true, qos: 0 }), 6000);

    // this observes do not receive retained message...
    setTimeout(() => this.observe(), 8000);
    setTimeout(() => this.observe(), 10000);

    // ...until all observations are cleared
    setTimeout(() => {
      this.mqttSubscriptions.forEach(s => { if (s.subscription) { s.subscription.unsubscribe(); } });
      this.mqttSubscriptions = [];
    }, 12000);

    setTimeout(() => this.observe(), 14000);
    setTimeout(() => this.observe(), 16000);
  }

  observe() {
    const s: IMqttSubscription = {
      id: this.counter++,
      payload: null
    };
    s.subscription = this.mqtt
      .observe('topic')
      .pipe(
        map(v => { console.log(v, s.id); return v; }),
        map(v => v.payload),
    )
      .subscribe(msg => { s.payload = msg; });
    this.mqttSubscriptions.push(s);
  }

  unsubscribe(s: IMqttSubscription) {
    s.subscription.unsubscribe();
    this.mqttSubscriptions.splice(this.mqttSubscriptions.indexOf(s), 1);
  }
}
