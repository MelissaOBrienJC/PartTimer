import { Injectable } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { Subject, Observable, from  } from 'rxjs';
import { Timer } from '../models/timer';

@Injectable({
  providedIn: 'root'
})
export class TimePickerService {

  timeSelected = new Subject<string>();
  durationSecondsSelected = new Subject<number>();
  minSelected = '';
  secSelected = '';
  timerTime: any;
  selectedTimerName = '';
  selectedPartTimerName = '';
  selectedPartTimerObject: Timer;
  constructor(private pickerCtrl: PickerController) { }

  
public async  showTimePicker( ) {
  const opts: PickerOptions = {
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Done'
      },
    ],
    columns: [
      {
        name: 'minutes',
        options: []
      },
      {
        name: 'seconds',
        options: []
      }
    ]
  };

  opts.columns[0].options.push({ text:   'minutes', value: '0' });
  opts.columns[1].options.push({ text:   'seconds', value: '0' });
  for (let i = 0; i < 60; i++) {
    opts.columns[0].options.push({ text:   i.toString(), value: i.toString() });
    opts.columns[1].options.push({ text:   i.toString(), value: i.toString() });
  }

  const picker = await this.pickerCtrl.create(opts);
  picker.present();
  picker.onDidDismiss().then( async data => {
            const colMinutes = await picker.getColumn('minutes');
            this.minSelected = this.padNumber( colMinutes.options[colMinutes.selectedIndex].text);

            const colSeconds = await picker.getColumn('seconds');
            this.secSelected = this.padNumber(colSeconds.options[colSeconds.selectedIndex].text);

            if ((this.minSelected === 'minutes')  &&  (this.secSelected === 'seconds')) { return; }

            if (this.minSelected === 'minutes') {  this.minSelected = '00'; }

            if (this.secSelected === 'seconds') {  this.secSelected = '00'; }

            this.timeSelected.next(this.minSelected + ':' + this.secSelected );

  });
}


public getTimeSelected(): Observable<string> {
  return this.timeSelected.asObservable();
}


public setSelectedTimerName( timerName: string) {
    this.selectedTimerName = timerName;
}
public clearSelectedTimer() {
    this.selectedTimerName = null;
}
public clearSelectedPartTimer() {
     this.selectedPartTimerName = null;
 }

public getSelectedTimerName( ): string {
  return  this.selectedTimerName;
}
public setSelectedPartTimerObject( timer: Timer) {
    this.selectedPartTimerObject = timer;
}
public getSelectedPartTimerObject( ) {
    return this.selectedPartTimerObject;
}
public setSelectedPartTimerName( timerName: string) {
    this.selectedPartTimerName = timerName;
}

public getSelectedPartTimerName( ): string {
  return  this.selectedPartTimerName;
}

public padNumber(num: string): string {
  if (num.length < 2) {  num = '0' + num; }
  return num;
}
}
