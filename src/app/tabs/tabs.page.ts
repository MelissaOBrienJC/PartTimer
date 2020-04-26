import { Component, OnDestroy } from '@angular/core';
import { UserSettingsService } from '../service/user-settings.service';
import { StorageService } from '../service/storage.service';
import { AppInfoService } from '../service/app-info.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy{

  constructor(private  userSettingsService: UserSettingsService,
              private storageService: StorageService,
              private appInfoService: AppInfoService
              ) {
    this.storageService.getUserSettingsFromStorage();
    this.storageService.getTimerNamesFromStorage();
    this.userSettingsService.getUserSettings();
  }

  ngOnDestroy() {
    console.log( 'tabs destroy');
    this.appInfoService.allowSleepAgain();
    
  }

}
