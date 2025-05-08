import { Routes } from '@angular/router';
import { auth } from './utils/auth';

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
            loadComponent: () => import('./components/cases-view/cases-view.component').then(m => m.CasesViewComponent),
            outlet: 'main'
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
        path: 'cases/wizard',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/case-wizard/case-wizard.component').then(m => m.CaseWizardComponent),
            outlet: 'main'
          },
          {
            path: '',
            loadComponent: () => import('./components/case-wizard-footer/case-wizard-footer.component').then(m => m.CaseWizardFooterComponent),
            outlet: 'footer'
          }
        ]
      },
      {
        path: 'cases/:id',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/case-detail/case-detail.component').then(m => m.CaseDetailComponent),
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
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
        outlet: 'main'
      }
    ]
  }
];
