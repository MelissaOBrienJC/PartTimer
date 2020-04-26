import { Component, OnInit } from '@angular/core';
import { UserSettings } from '../models/user-settings';
import { UserSettingsService } from '../service/user-settings.service';
import { AppInfoService } from '../service/app-info.service';


@Component({
  selector: 'app-tab-settings',
  templateUrl: 'tab-settings.page.html',
  styleUrls: ['tab-settings.page.scss']
})

export class TabSettingsPage implements OnInit {
  userSettings: UserSettings;
  alarmRing = new Audio();

  constructor( private userSettingsService: UserSettingsService,
               public appInfoService: AppInfoService) {
  }

  ngOnInit() {
    this.userSettings = this.userSettingsService.userSettings;
  }

  ionViewWillLeave() {
      // leaving page so save user settings
      if ( this.userSettingsService.userSettings.PreventScreenLock)  {
            this.appInfoService.keepAwake();
       } else {
        this.appInfoService.allowSleepAgain();
       }
      this.userSettingsService.saveUserSettings(this.userSettings);
    }

    playSound() {
      this.alarmRing.src = 'assets/sounds/' + this.userSettings.Sound + '.mp3';
      this.alarmRing.play();
    }
  }


