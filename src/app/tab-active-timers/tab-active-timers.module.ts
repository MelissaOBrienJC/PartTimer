import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabActiveTimersPage } from './tab-active-timers.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TabActiveTimersPage }])
  ],
  declarations: [TabActiveTimersPage]
})
export class TabActiveTimersPageModule {}
