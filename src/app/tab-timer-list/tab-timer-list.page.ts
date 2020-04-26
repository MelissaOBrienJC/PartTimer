import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../service/storage.service';
import { TimerService } from '../service/timer.service';
import { TimePickerService } from '../service/time-picker.service';
import { Timer} from '../models/timer';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-tab-timer-list',
  templateUrl: 'tab-timer-list.page.html',
  styleUrls: ['tab-timer-list.page.scss']
})
export class TabTimerListPage  implements OnInit, OnDestroy {

  subscription: Subscription;
  timerNameList: string[];
 // timerList: Timer[];
  selectedTimer: Timer;


  constructor( public storageService: StorageService,
               public timerService: TimerService,
               public timePickerService: TimePickerService,
               private router: Router
               ) {

  }

// -----------------------------------------------------------
// Getlist of timer names in from storage
// -----------------------------------------------------------
  ngOnInit() {

       this.subscription = this.storageService.getTimerNameList()
      .subscribe( data => {
        this.timerNameList = data;
        this.timerNameList.sort();
      });
}




// -----------------------------------------------------------
// Called from html when a timer is selcted
// Stores selected timer name in timerService
// -----------------------------------------------------------
timerSelected(timerName: string) {
  this.timePickerService.setSelectedTimerName( timerName);
  this.router.navigate(['timer-detail']);
}


timerNew() {
  this.timePickerService.clearSelectedTimer( );
}

timerStart(name: string) {
   this.timePickerService.setSelectedTimerName( name);
   this.router.navigate(['timer-run']);
  }

ngOnDestroy(){
        this.subscription.unsubscribe();
  }
}
