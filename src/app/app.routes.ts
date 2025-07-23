import { Routes } from '@angular/router';

import { ClientsPageComponent } from '@features';

// exp mb сделать лоадинг компоненты
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/clients',
        pathMatch: 'full'
    },
    {
        path: 'clients',
        component: ClientsPageComponent,
        title: 'Clients'
    },
    {
        path: '**',
        redirectTo: '/clients',
        pathMatch: 'full'
    }
];
