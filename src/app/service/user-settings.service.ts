import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserSettings } from '../models/user-settings';
import { StorageService } from '../service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService implements OnDestroy  {
  public userSettings: UserSettings;
  subscription: Subscription;

  constructor(private storageService: StorageService) {
    this.userSettings = new UserSettings();
    this.userSettings.Repeat = false;
    this.userSettings.PreventScreenLock = false;
    this.userSettings.Sound = 'classic';
   }

  // ------------------------------------------------------------------
  // GetUserSettings called once when app starts up
  // ------------------------------------------------------------------
  public getUserSettings() {

    this.subscription = this.storageService.getUserSettings()
    .subscribe( data => {
      if ( data) {
        if ( data.Sound !== null) {
             this.userSettings.Sound = data.Sound;
        }
        if ( data.Repeat !== null) {
              this.userSettings.Repeat = data.Repeat;
        }
        if ( data.PreventScreenLock !== null) {
          this.userSettings.PreventScreenLock = data.PreventScreenLock;
    }
      }
    });
  }

  // ------------------------------------------------------------------
  // Save User Settings
  // ------------------------------------------------------------------
  saveUserSettings(userSettings: UserSettings) {
    this.storageService.saveUserSettings( userSettings);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
