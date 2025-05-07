import { Routes } from '@angular/router';
import { auth } from './utils/auth';

export const routes: Routes = [
  {
    path: '',
    canMatch: [auth],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        outlet: 'main'
      },
      {
        path: 'cases',
        loadComponent: () => import('./components/cases-view/cases-view.component').then(m => m.CasesViewComponent),
        outlet: 'main',
        children: [
          {
            path: ':id',
            loadComponent: () => import('./components/case-detail/case-detail.component').then(m => m.CaseDetailComponent)
          }
        ]
      },
      {
        path: '',
        loadComponent: () => import('./components/main-panel/main-panel.component').then(m => m.MainPanelComponent),
        outlet: 'leftpanel'
      },
      {
        path: '',
        loadComponent: () => import('./components/main-footer/main-footer.component').then(m => m.MainFooterComponent),
        outlet: 'footer'
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
        outlet: 'main'
      }
    ]
  }
];
