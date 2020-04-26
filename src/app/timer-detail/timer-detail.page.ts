import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TimerService } from '../service/timer.service';
import { TimePickerService } from '../service/time-picker.service';
import { StorageService } from '../service/storage.service';
import { Timer, Time } from '../models/timer';

@Component({
  selector: 'app-timer-detail',
  templateUrl: './timer-detail.page.html',
  styleUrls: ['./timer-detail.page.scss'],
})
export class TimerDetailPage implements OnInit, OnDestroy {
  timer = new Timer();

  timePickerSub: Subscription;
  selectedTimerSub: Subscription;

  constructor(  public timerService: TimerService,
                public timePickerService: TimePickerService,
                public storageService: StorageService, 
                public alertController: AlertController,
                private router: Router ) {

      this.timer.MultiPart = false;
      this.timer.Time = new Time();

      // subscription to get selected time from picker
      this. timePickerSub = this.timePickerService.getTimeSelected()
      .subscribe( data => {
        this.timer.Time.DisplayTime  = data;
        this.timer.Time.DurationSeconds = this.timerService.GetDurationSeconds(this.timer.Time.DisplayTime);
            });
  }

  ngOnInit() {
    const timerName = this.timePickerService.getSelectedTimerName();
    if ( timerName != null)
{

    this.storageService.getTimerFromStorage(this.timePickerService.getSelectedTimerName()).then((result) => {
      if (result != null) {
            this.timer =  JSON.parse(result.value);
      }
    });
  }
  }



// -----------------------------------------------------------
// Called from html when time is to be selected in picker
// -----------------------------------------------------------
  public async showPicker() {
      await this.timePickerService.showTimePicker();
  }

// -----------------------------------------------------------
// Called from html when a part  timer is selcted
// Stores selected timer part name in timePickerService
// -----------------------------------------------------------
timerPartSelected(timerPartName: string) {
  this.timePickerService.setSelectedPartTimerObject(this.timer);
  this.timePickerService.setSelectedPartTimerName(timerPartName);
}
// -----------------------------------------------------------
// Leaving page so store timer info
// -----------------------------------------------------------
ionViewWillLeave() {
      if (this.timer != null)  {
        if ((this.timer.Name != null ) && (this.timer.Time != null )){
          this.storageService.saveTimer(this.timer);
        }
      }
  }

timerPartNew() {
  this.storageService.saveTimer(this.timer);
  this.timePickerService.setSelectedTimerName(this.timer.Name);
  this.timePickerService.setSelectedPartTimerObject(this.timer);
  this.timePickerService.clearSelectedPartTimer();
}

timerDelete() {
  this.presentDeleteConfirm();
}

ngOnDestroy() {
      this.timePickerSub.unsubscribe();
     // this.selectedTimerSub.unsubscribe();
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'You wish to delete timer:' + this.timer.Name + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          // handler: (blah) => {
          //   console.log('cancel');
          // }
        }, {
          text: 'Delete',
          handler: () => {
            this.timerDeleteConfimed(this.timer.Name);
          }
        }
      ]
    });

    await alert.present();
  }

  private timerDeleteConfimed(name: string) {
    this.storageService.removeTimer(this.timer.Name );
    this.timer = null;
    this.timePickerService.clearSelectedTimer();
    this.router.navigate(['/tabs/tab-timer-list']);
  }

}
