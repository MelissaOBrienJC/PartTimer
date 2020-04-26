import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { TimerService } from '../service/timer.service';
import { TimePickerService } from '../service/time-picker.service';
import { StorageService } from '../service/storage.service';
import { Timer,  TimerState} from '../models/timer';

@Component({
  selector: 'app-timer-run',
  templateUrl: './timer-run.page.html',
  styleUrls: ['./timer-run.page.scss'],
})

export class TimerRunPage implements OnInit {
  timer = new Timer();
  timerInitialized = false;

  constructor(public timerService: TimerService,
              private router: Router,
              public timePickerService: TimePickerService,
              public storageService: StorageService ) { }

  ngOnInit() {

  }

  backButtonPressed() {
    //this.timerInitialized = false;
  }

  ionViewDidEnter() {

    this.timerService.removeInActiveTimers();
    const timerName = this.timePickerService.getSelectedTimerName();
    const activeTimer = this.timerService.getActiveTimer(timerName);
    if ( activeTimer != null ) {
          this.timer = activeTimer;
    } else {
          this.initializeNewTimer(timerName);
    }
    this.timerInitialized = true;
  }

   // get timer settings from storage
  initializeNewTimer(timerName: string) {
     this.storageService.getTimerFromStorage(timerName).then((result) => {
     if (result != null) {
           this.timer =  JSON.parse(result.value);
           this.timer.State = TimerState.NotStarted;
           this.timer.Percent = 0;
           if ( this.timer.MultiPart ) {
             this.timer.SecondsCountdown = this.timer.PartTimers[this.timer.PartTimerSeqNo].Time.DurationSeconds;
           } else {
             this.timer.SecondsCountdown = this.timer.Time.DurationSeconds;
           }
     }
    });
  }


  getRowColorClass(e: any) {
      if (e === this.timer.PartTimerSeqNo ) {
      return 'highlight';
       } else {
      return '';
    }
  }

  startTimer() {
      this.timerService.startTimer(this.timer);
  }

  restartTimer() {
          this.timerService.stopTimer(this.timer);
          this.timerService.resetTimer(this.timer);
          if(this.timer.MultiPart) {
              this.timerService.resetPartTimer(this.timer);
          }

}
  stopTimer() {
      this.timerService.stopTimer(this.timer);
  }

  formatSubtitle = (percent: number): string => {
    if ( this.timer.MultiPart) {
       return  this.timerService.getPartTimerName(this.timer);
    }
    return '';
  }

  formatTitle = (percent: number): string => {
    //if ( percent === 0 ){return ('00:00');}
    return this.timerService.getDisplayTime(this.timer)

  }

  get percentage(): number {
    return this.timerService.getTimerPercent(this.timer);
  }

  get showSubtitle(): boolean {
    return this.timer.MultiPart;
  }

// -----------------------------------------------------------
// Called from html when a timer is selcted
// Stores selected timer name in timerService
// -----------------------------------------------------------
timerSelected(timerName: string) {
  this.timePickerService.setSelectedTimerName( this.timer.Name);
  this.router.navigate(['timer-detail']);
}
}
