import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimerPartDetailPageRoutingModule } from './timer-part-detail-routing.module';

import { TimerPartDetailPage } from './timer-part-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimerPartDetailPageRoutingModule
  ],
  declarations: [TimerPartDetailPage]
})
export class TimerPartDetailPageModule {}
