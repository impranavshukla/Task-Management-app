import { Routes } from '@angular/router';
import { TaskUI } from './task-ui/task-ui';

export const routes: Routes = [
    {
        path: '',
        component: TaskUI,
        children: [
            { path: 'dashboard', loadComponent: () => import('../components/dashboard/dashboard').then(m => m.Dashboard) },
            { path: 'completed', loadComponent: () => import('../components/completed/completed').then(m => m.Completed) },
            { path: 'motivation', loadComponent: () => import('../components/motivation/motivation').then(m => m.Motivation) },
            { path: 'contact', loadComponent: () => import('../components/contact/contact').then(m => m.Contact) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
