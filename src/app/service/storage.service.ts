import { Injectable } from '@angular/core';
import { Timer } from '../models/timer';
import { UserSettings } from '../models/user-settings';
import { Storage} from '@capacitor/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {



  timerNameList = new Subject<string[]>();
  timerObject = new Subject<Timer>();
  userSettings = new Subject<UserSettings>();
 
  constructor() {}

// ------------------------------------------------------------------
// Save Timer to storage
// ------------------------------------------------------------------
async saveTimer(timer: Timer) {

  await Storage.set({
    key: timer.Name,
    value: JSON.stringify(timer)
  });
  this.getTimerNamesFromStorage();
}
// ------------------------------------------------------------------
// Get UserSettings From Storage
// UserSettingsObject Subject is populated and available for subscription
// ------------------------------------------------------------------

async getUserSettingsFromStorage() {
      const ustr = await Storage.get({ key: 'UserSettings' });
      const uobj =  JSON.parse(ustr.value.toString());
      this.userSettings.next(uobj);
      return uobj;
}



// ------------------------------------------------------------------
// Get Timer From Storage
// timerObject Subject is populated and available for subscription
// ------------------------------------------------------------------
async getTimerFromStorage(name: string) {
  return await Storage.get({ key: name });
}




// async getSomethingFromStorage(name: string) {
//   const val = await Storage.get({ key: name });
//   console.log(val.value.toString());
//   return val;
// }


// ------------------------------------------------------------------
// Get Timer Names form storage
// timerNameList Subject is populated and available for subscription
// ------------------------------------------------------------------
async getTimerNamesFromStorage() {
  const { keys } = await Storage.keys();

  const index: number = keys.indexOf('UserSettings');
  if (index !== -1) {
      keys.splice(index, 1);
  }


  this.timerNameList.next(keys);
}

// ------------------------------------------------------------------
// Get Timer Object Observable
// ------------------------------------------------------------------
public getTimerObject(): Observable<Timer> {
  return this.timerObject.asObservable();
}


// ------------------------------------------------------------------
// Get Timer Names List
// ------------------------------------------------------------------
public getTimerNameList(): Observable<string[]> {
  return this.timerNameList.asObservable();
}


// ------------------------------------------------------------------
// Get User Settings
// ------------------------------------------------------------------
public getUserSettings(): Observable<UserSettings> {
  return this.userSettings.asObservable();
}


// ------------------------------------------------------------------
// Remove Timer from storage
// ------------------------------------------------------------------
async removeTimer(name: string) {
  await Storage.remove({ key: name });
  this.getTimerNamesFromStorage();
}





// ------------------------------------------------------------------
// Save User Setting Repeat to  storage
// ------------------------------------------------------------------
async saveUserSettings(userSettings: UserSettings) {

  await Storage.set({
    key: 'UserSettings',
    value: JSON.stringify(userSettings)
  });
 
}







}
