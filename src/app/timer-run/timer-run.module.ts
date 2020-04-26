import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TimerRunPageRoutingModule } from './timer-run-routing.module';

import { TimerRunPage } from './timer-run.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimerRunPageRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,

       // add-on
       animation: false,
       responsive: true,
       renderOnClick: false
    }),
   ],
  declarations: [TimerRunPage]
})
export class TimerRunPageModule {}
