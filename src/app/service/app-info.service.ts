import { Injectable } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Injectable({
  providedIn: 'root'
})
export class AppInfoService {
  public isApp = false;
  constructor( private insomnia: Insomnia) {
     this.isApp = document.URL.indexOf('http') !== 0;
    }

keepAwake() {
      if (this.isApp) {
            this.insomnia.keepAwake();
      }
  }

  allowSleepAgain() {
    if (this.isApp) {
          this.insomnia.allowSleepAgain();
    }
}

}
