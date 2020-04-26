import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { TimerDetailPageRoutingModule } from './timer-detail-routing.module';

import { TimerDetailPage } from './timer-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimerDetailPageRoutingModule
  ],
  declarations: [TimerDetailPage]
})
export class TimerDetailPageModule {

constructor() {}



}
