import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimerPartDetailPage } from './timer-part-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TimerPartDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimerPartDetailPageRoutingModule {}
