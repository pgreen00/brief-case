import { Routes } from '@angular/router';
import { auth } from './tokens/current-user';

export const routes: Routes = [
  {
    path: '',
    canMatch: [auth],
    children: [
      {
        path: 'cases',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/cases-view/cases-view').then(m => m.CasesView),
            outlet: 'main'
          },
          {
            path: '',
            loadComponent: () => import('./components/main-panel/main-panel').then(m => m.MainPanel),
            outlet: 'leftpanel'
          },
          {
            path: '',
            loadComponent: () => import('./components/main-footer/main-footer').then(m => m.MainFooter),
            outlet: 'footer'
          }
        ]
      },
      {
        path: 'cases/wizard',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/case-wizard/case-wizard').then(m => m.CaseWizard),
            outlet: 'main'
          },
          {
            path: '',
            loadComponent: () => import('./components/case-wizard-footer/case-wizard-footer').then(m => m.CaseWizardFooter),
            outlet: 'footer'
          }
        ]
      },
      {
        path: 'cases/:id',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/case-detail/case-detail').then(m => m.CaseDetail),
            outlet: 'main'
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'cases',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        outlet: 'main'
      }
    ]
  }
];
