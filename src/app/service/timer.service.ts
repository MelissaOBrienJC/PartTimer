import { Injectable } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { Timer, TimerState, PartTimer } from '../models/timer';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastController } from '@ionic/angular';
import { UserSettingsService } from './user-settings.service';
import { AppInfoService } from './app-info.service';



@Injectable({
  providedIn: 'root'
})
export class TimerService {

  // internal list of active timers
  activeTimerList: Timer[] = new Array<Timer>();
  alarmRing = new Audio();
 

  constructor(private localNotifications: LocalNotifications,
              public toastController: ToastController,
              public storageService: StorageService,
              public  appInfoService: AppInfoService,
              public userSettingsService: UserSettingsService) {
 }

  // ---------------------------------------------------------------------------------
  // determine if timer is running based on it's state
  // ---------------------------------------------------------------------------------
  isRunning(state: number): boolean {
    if ((state !== TimerState.Completed) && (state !== TimerState.Started)) {
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------------
  // get time in mm:ss format from the seconds remaining
  // ---------------------------------------------------------------------------------
  getTimeFromSeconds(secondsCountdown: number): string {
      let minutes: any  = secondsCountdown / 60;
      let seconds: any  = secondsCountdown % 60;
      if (minutes < 1 ) { minutes = 0; }
      if (seconds < 1 ) { seconds = 0; }
      minutes = String('0' + Math.floor(minutes)).slice(-2);
      seconds = String('0' + Math.floor(seconds)).slice(-2);
      return minutes + ':' + seconds;
}

// ---------------------------------------------------------------------------------
// calculate percent complete based on seconds remaining
// ---------------------------------------------------------------------------------
getPercentFomSeconds(secondsCountdown: number, duration: number): number {
  return  ((duration - secondsCountdown) / duration) * 100;
}


// ---------------------------------------------------------------------------------
// calculate the timers duration in seconds from display time format
// ---------------------------------------------------------------------------------
  public  GetDurationSeconds(time: string): number {
    const timeParts = time.split(':');
    const min = +timeParts[0];
    const  sec = +timeParts[1];
    return (( min * 60 ) + sec);
  }


// ---------------------------------------------------------------------------------
//  add or update timer in activeTimerList
// ---------------------------------------------------------------------------------
  private addUpdateActiveTimerList(timer: Timer)  {
     if (this.activeTimerList === []) {
      this.activeTimerList.push(timer);
    } else {
        if ( ! this.updateActiveTimerInList(timer)) {
              this.activeTimerList.push(timer);
        }
    }
  }

// ---------------------------------------------------------------------------------
//  update timer properties in activeTimerList
// ---------------------------------------------------------------------------------
  private updateActiveTimerInList(timer: Timer): boolean {
    const ret = false;
    for (const activeTimer of this.activeTimerList) {
      if (activeTimer.Name === timer.Name ) {
        activeTimer.Interval = timer.Interval;
        activeTimer.Percent = timer.Percent;
        activeTimer.SecondsCountdown = timer.SecondsCountdown;
        activeTimer.State = timer.State;
        return true;
      }
    }
    return ret;
  }

// ---------------------------------------------------------------------------------
//  reset timer to initial settings
// ---------------------------------------------------------------------------------
  public resetTimer(timer: Timer) {
    timer.Percent = 0;
    timer.State = TimerState.NotStarted;
    timer.Time.DisplayTime = this.getTimeFromSeconds(  timer.Time.DurationSeconds);
    timer.SecondsCountdown = timer.Time.DurationSeconds;
  }

// ---------------------------------------------------------------------------------
//  reset part timer to initial settings
// ---------------------------------------------------------------------------------
  public resetPartTimer(timer: Timer) {
    timer.Percent = 0;
    timer.State = TimerState.NotStarted;
    for (const partTimer of timer.PartTimers) {
        partTimer.State = TimerState.NotStarted ;
        partTimer.Time.DisplayTime = this.getTimeFromSeconds(partTimer.Time.DurationSeconds);
        partTimer.SecondsCountdown = partTimer.Time.DurationSeconds;
        partTimer.Percent = 0;
   }
    timer.PartTimerSeqNo = 0;

  }

// ---------------------------------------------------------------------------------
//  update timer dispalyTime and percentage complete
// ---------------------------------------------------------------------------------
  public updateTimerPercent( timer: Timer) {
    timer.Time.DisplayTime = this.getTimeFromSeconds( timer.SecondsCountdown);
    timer.Percent = this.getPercentFomSeconds( timer.SecondsCountdown,
     timer.Time.DurationSeconds);
  }





// ---------------------------------------------------------------------------------
//  start timer calls set interval to invoke updateTimer every .25 seconds
// ---------------------------------------------------------------------------------
startTimer(timer: Timer) {

  if ( this.userSettingsService.userSettings.PreventScreenLock)  {
    this.appInfoService.keepAwake();
  }

  if (timer.MultiPart) {
      if (timer.PartTimerSeqNo  === undefined) {
          timer.PartTimerSeqNo = 0;
      }
      this.startPartTimer(timer.PartTimers[timer.PartTimerSeqNo], timer);
  } else {
      if ( timer.State === TimerState.Completed) {
          this.initializeTimer(timer);
      }
      timer.State = TimerState.Started;
      clearInterval(timer.Interval);

      timer.Interval = setInterval(( ) => {
        this.updateTimer(timer.Name);
      }, 250);
      this.addUpdateActiveTimerList(timer);
    }
}


// ---------------------------------------------------------------------------------
//  start part timer calls set interval to invoke updatePartTimer every .25 seconds
// ---------------------------------------------------------------------------------
startPartTimer(timer: PartTimer, parentTimer: Timer) {
      timer.Time.DisplayTime = this.getTimeFromSeconds(  timer.Time.DurationSeconds);
      if (( timer.State === TimerState.Completed) || (timer.State === TimerState.NotStarted)) {
        this.initializePartTimer(timer);
      }
      timer.State = TimerState.Started;
      clearInterval(timer.Interval);
      timer.Interval = setInterval(( ) => {
        this.updatePartTimer(parentTimer.Name, parentTimer.PartTimerSeqNo);
      }, 250);
      this.addUpdateActiveTimerList(parentTimer);

}


// ---------------------------------------------------------------------------------
//  update timer called every .25 seconds, decrements the seconds remaining and
//  updates the display time. If no seconds are remaining then timer is completed!
// ---------------------------------------------------------------------------------
public updateTimer(timerName: string) {
  for (const activeTimer of this.activeTimerList) {
    if (activeTimer.Name === timerName ) {
        if (activeTimer.SecondsCountdown >= 0 ) {
          activeTimer.SecondsCountdown = activeTimer.SecondsCountdown - .25;
        }
        if ( activeTimer.SecondsCountdown < 0)  {
            this.stopTimer(activeTimer);
            activeTimer.State = TimerState.Completed;
            this.resetTimer(activeTimer);
            this.timerNotification('timer: ' + timerName + ' complete!', timerName );
            this.removeInActiveTimers();
        } else {
              activeTimer.Time.DisplayTime = this.getTimeFromSeconds( activeTimer.SecondsCountdown);
              activeTimer.Percent = this.getPercentFomSeconds( activeTimer.SecondsCountdown,
              activeTimer.Time.DurationSeconds);
        }
      }
    }
}

// ---------------------------------------------------------------------------------
//  update part timer called every .25 seconds, decrements the seconds remaining for
//  this part timer and updates the display time. If no seconds are remaining in current
//  part timer then next part timer is started. If no part timers remain then timer is
//  completed!
// ---------------------------------------------------------------------------------
public updatePartTimer(timerName: string, seqNo: number) {
for (const activeTimer of this.activeTimerList) {
if (activeTimer.Name === timerName ) {
  let pt = activeTimer.PartTimers[seqNo];
  if (  pt.SecondsCountdown === undefined) {
    pt.SecondsCountdown = pt.Time.DurationSeconds;
  }
  pt.Time.DisplayTime = this.getTimeFromSeconds(  pt.SecondsCountdown);
  pt.Percent = this.getPercentFomSeconds(  pt.SecondsCountdown,
  pt.Time.DurationSeconds);
  if (pt.SecondsCountdown >= 0 ) {
      pt.SecondsCountdown = pt.SecondsCountdown - .25;
  }
  if ( pt.SecondsCountdown < 0)  {
    this.timerNotification('timer: ' + timerName + ' ' +  pt.Name + ' complete!', timerName);
    this.stopPartTimer(pt);
    this.removeInActiveTimers();
    activeTimer.PartTimerSeqNo =  activeTimer.PartTimerSeqNo + 1;
    pt = activeTimer.PartTimers[activeTimer.PartTimerSeqNo];
    if (pt != null) {
      pt.State = TimerState.NotStarted;
      this.startPartTimer(pt, activeTimer);
    } else {
      activeTimer.State = TimerState.Completed;
      this.resetPartTimer(activeTimer);
      this.timerNotification('timer: ' + timerName + ' complete!', timerName);
    }
  }
}
}
}


// -----------------------------------------------------------------------
//  intialize timer
// -----------------------------------------------------------------------
initializeTimer(timer: Timer) {
  timer.Percent = 0;
  timer.State = TimerState.NotStarted;
  timer.Time.DisplayTime = '00:00';
  timer.State = TimerState.NotStarted;
  timer.SecondsCountdown = timer.Time.DurationSeconds;
}

// -----------------------------------------------------------------------
//  initialize part timer
// -----------------------------------------------------------------------
initializePartTimer(timer: PartTimer) {
    timer.Percent = 0;
    timer.State = TimerState.NotStarted;
    timer.Time.DisplayTime = '00:00';
    timer.State = TimerState.NotStarted;
    timer.SecondsCountdown = timer.Time.DurationSeconds;
}

noDelaySetInterval(func: any, interval: any) {
      func();
      return setInterval(func, interval);
}


// -----------------------------------------------------------------------
//  starts the timer interval
// -----------------------------------------------------------------------
startTimerSetInterval(timer: Timer) {
      timer.Interval = this.noDelaySetInterval(this.updateTimer(timer.Name), 250);
}


// -----------------------------------------------------------------------
//  stop timer
// -----------------------------------------------------------------------
stopTimer(timer: Timer) {
  if ( timer.MultiPart) {
        const  pt =  this.getRunningPartTimer(timer);
        this.stopPartTimer(pt);
  } else {
        for (const activeTimer of this.activeTimerList) {
        if (activeTimer.Name === timer.Name ) {
                clearInterval(activeTimer.Interval);
                activeTimer.State = TimerState.Stopped;
        }
    }
  }
}

// -----------------------------------------------------------------------
//  stop part timer
// -----------------------------------------------------------------------
stopPartTimer(pt: PartTimer) {
        clearInterval(pt.Interval);
        pt.State = TimerState.Stopped;
}


// -----------------------------------------------------------------------
//  get active timer list
// -----------------------------------------------------------------------
getActiveTimerList( ): Timer[] {
    return this.activeTimerList;
}


// -----------------------------------------------------------------------
//  get active timer
/// -----------------------------------------------------------------------
getActiveTimer(timerName: string ): Timer {
      for (const activeTimer of this.activeTimerList) {
        if (activeTimer.Name === timerName ) {
          return activeTimer;
         }
      }
      return null;
}

// -----------------------------------------------------------------------
//  remove inactive timers from the active timer list
// -----------------------------------------------------------------------
removeInActiveTimers(): void  {
      let timerRunning = false;
      for (const activeTimer of this.activeTimerList) {
        let completed = true;
        if ( activeTimer.MultiPart) {
            for (const partTimer of activeTimer.PartTimers) {
              if ( partTimer.State !== TimerState.Completed ) {
                  completed = false;
                  timerRunning = true;
              }
            }
            if (completed) {
              delete this.activeTimerList[activeTimer.Name];
             }
          } else {
            if (activeTimer.State === TimerState.Completed ) {
                delete this.activeTimerList[activeTimer.Name];
            }
          }
        }
      if ( !timerRunning ) {
          if ( this.userSettingsService.userSettings.PreventScreenLock)  {
              this.appInfoService.allowSleepAgain();
          }
       }
    }


// -----------------------------------------------------------------------
//  sound the alarm
// -----------------------------------------------------------------------
soundTheAlarm(timerName: string) {
  this.alarmRing.src = 'assets/sounds/' + this.userSettingsService.userSettings.Sound + '.mp3';
  this.alarmRing.loop = this.userSettingsService.userSettings.Repeat;
  this.alarmRing.play();
}

// -----------------------------------------------------------------------
//  timerNotification
// -----------------------------------------------------------------------
timerNotification(message: string, timerName: string) {
      this.soundTheAlarm( timerName);
      this.presentToastWithOptions(message, timerName);
    }

// -----------------------------------------------------------------------
//  present the notofication to the user
// -----------------------------------------------------------------------
async presentToastWithOptions(toastMessage: string, timerName: string) {
      const toast = await this.toastController.create({
        header: timerName,
        message: toastMessage,
        position: 'middle',
        buttons: [
          {
            side: 'end',
            text: 'Ok',
            handler: () => {
               this.alarmRing.pause();
            }
          }
        ]
      });
      toast.present();
    }

// -----------------------------------------------------------------------
//  get time percent - called from timer-run page to update timer circle
// -----------------------------------------------------------------------
getTimerPercent(timer: Timer): number {
  if (timer.MultiPart) {
    const pt =  this.getRunningPartTimer(timer);
    if (pt !== null) {
        return pt.Percent;
    }
  } else {
      return timer.Percent;
  }
}

// -----------------------------------------------------------------------
//  get running part timer 
// -----------------------------------------------------------------------
getRunningPartTimer(timer: Timer): PartTimer {
  if ( timer.MultiPart) {
      if ( this.isRunning( timer.State)) {
          if ( timer.PartTimers[timer.PartTimerSeqNo] )  {
            return timer.PartTimers[timer.PartTimerSeqNo];
          }
      }
    }
  return null;
}


// -----------------------------------------------------------------------
//  get running part timer name -called from timer-run page to update timer
//  circle title
// -----------------------------------------------------------------------
getPartTimerName(timer: Timer): string {
  if ( timer.MultiPart) {
    const pt = this.getRunningPartTimer(timer);
    if (pt !== null) {
        return pt.Name.toUpperCase();
    }
  }
  return '';
}

// -----------------------------------------------------------------------
//  get display time - called from timer-run page to update timer circle time
// -----------------------------------------------------------------------
getDisplayTime(timer: Timer): string {
  if ( timer.MultiPart) {
    if ( timer.PartTimers[timer.PartTimerSeqNo] )  {
      const tm =  timer.PartTimers[timer.PartTimerSeqNo].Time;
      if (tm) {
      return   tm.DisplayTime;
      }
    }
  } else {
    const tm =  timer.Time;
        if (tm) {
          return tm.DisplayTime;
    }
  }
  return '00:00';
}

}
