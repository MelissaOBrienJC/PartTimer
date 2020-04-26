import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimerRunPage } from './timer-run.page';

const routes: Routes = [
  {
    path: '',
    component: TimerRunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimerRunPageRoutingModule {}
