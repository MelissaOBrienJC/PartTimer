import { Component, OnInit,  OnDestroy} from '@angular/core';
import { AlertController, NavController} from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimerService } from '../service/timer.service';
import { TimePickerService } from '../service/time-picker.service';
import { StorageService } from '../service/storage.service';
import { Timer, PartTimer, Time } from '../models/timer';

@Component({
  selector: 'app-timer-part-detail',
  templateUrl: './timer-part-detail.page.html',
  styleUrls: ['./timer-part-detail.page.scss'],
})
export class TimerPartDetailPage implements OnInit, OnDestroy {
  timer: Timer;
  partTimer = new PartTimer();
  timePickerSub: Subscription;
  selectedTimerSub: Subscription;
  partTimerSelectedName = '';

  constructor(public timerService: TimerService, 
              public timePickerService: TimePickerService, 
              public storageService: StorageService,
              public alertController: AlertController,
              private router: Router) {
      this.partTimer.Time = new Time();
      // subscription to get selected time from picker
      this.timePickerSub = this.timePickerService.getTimeSelected()
        .subscribe( data => {
           if (this.partTimer.Time == null)
           {
            this.partTimer.Time = new Time();
           }
           this.partTimer.Time.DisplayTime  = data;
           this.partTimer.Time.DurationSeconds = this.timerService.GetDurationSeconds(this.partTimer.Time.DisplayTime);
        });
      }

ngOnInit() {
  this.timer = this.timePickerService.getSelectedPartTimerObject();
  this.partTimerSelectedName = this.timePickerService.getSelectedPartTimerName();
  if (( this.partTimerSelectedName !== null) && ( this.partTimerSelectedName !== '' )) {
      this.partTimer =  this.timer.PartTimers.find(x => x.Name === this.partTimerSelectedName);
  }
}

  public async showPicker() {
      await this.timePickerService.showTimePicker();
  }

// -----------------------------------------------------------
// Leaving page so store changes
// -----------------------------------------------------------
ionViewDidLeave() {
  if (( this.partTimerSelectedName === null) || ( this.partTimerSelectedName === '' )) {
      // User added a new  Part Timer
      if (( this.timer.PartTimers == null) || (this.timer.PartTimers.length === 0)  ) {
          this.timer.PartTimers = new Array<PartTimer>();
      }
      if ((this.partTimer.Name != null ) && (this.partTimer.Time != null )) {
        this.timer.PartTimers.push(this.partTimer);
      }
  } else {
      // Edit existing Part Timer
      for (const i in this.timer.PartTimers) {
        if (this.timer.PartTimers[i].Name ===  this.partTimer.Name  ) {
           this.timer.PartTimers[i] = this.partTimer;
        }
      }
  }
  this.storageService.saveTimer(this.timer);
}

timerDelete() {
  this.presentDeleteConfirm();
}

ngOnDestroy() {
    this.timePickerSub.unsubscribe();
  }



async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'You wish to delete part timer:' + this.partTimer.Name + '?',
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
              this.timerDeleteConfimed(this.partTimer);
          }
        }
      ]
    });

    await alert.present();
  }

  private timerDeleteConfimed(partTimer: PartTimer) {
    const index = this.timer.PartTimers.indexOf(partTimer);
    if (index > -1) {
      this.timer.PartTimers.splice(index, 1);
    }
    this.timePickerService.clearSelectedPartTimer();
    this.router.navigate(['timer-detail']);
  }
}
