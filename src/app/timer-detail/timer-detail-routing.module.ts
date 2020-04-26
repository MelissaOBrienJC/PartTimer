import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimerDetailPage } from './timer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TimerDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimerDetailPageRoutingModule {}
