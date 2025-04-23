import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    outlet: 'main'
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/header/header.component').then(m => m.HeaderComponent),
    outlet: 'header'
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/main-panel/main-panel.component').then(m => m.MainPanelComponent),
    outlet: 'leftpanel'
  },
];
