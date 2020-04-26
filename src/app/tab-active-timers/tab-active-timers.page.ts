import { Component, OnInit } from '@angular/core';
import { Timer, TimerState } from '../models/timer';
import { TimerService } from '../service/timer.service';

@Component({
  selector: 'app-tab-active-timers',
  templateUrl: 'tab-active-timers.page.html',
  styleUrls: ['tab-active-timers.page.scss']
})
export class TabActiveTimersPage  implements OnInit {
  activeTimerList: Timer[]  ;
  constructor(public timerService: TimerService) {
  }

  ngOnInit(): void {
    this.activeTimerList = this.timerService.getActiveTimerList();
  }
}
