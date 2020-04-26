import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { NgCircleProgressModule } from 'ng-circle-progress';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
   {
    path: 'timer-detail',
    loadChildren: () => import('./timer-detail/timer-detail.module').then( m => m.TimerDetailPageModule)
  },
  {
    path: 'timer-part-detail',
    loadChildren: () => import('./timer-part-detail/timer-part-detail.module').then( m => m.TimerPartDetailPageModule)
  },
  {
    path: 'timer-run',
    loadChildren: () => import('./timer-run/timer-run.module').then( m => m.TimerRunPageModule)
  }
 
];
@NgModule({
  imports: [
  
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
