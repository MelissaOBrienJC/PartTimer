import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-timer-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-timer-list/tab-timer-list.module').then(m => m.TabTimerListPageModule)
          }
        ]
      },
      {
        path: 'tab-active-timers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-active-timers/tab-active-timers.module').then(m => m.TabActiveTimersPageModule)
          }
        ]
      },
      {
        path: 'tab-settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-settings/tab-settings.module').then(m => m.TabSettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab-timer-list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-timer-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
