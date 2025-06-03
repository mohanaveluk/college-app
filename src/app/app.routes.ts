import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: '',
        loadComponent: () => import('./features/home3/home3.component').then(m => m.Home3Component)
    },
    // {
    //     path: '',
    //     loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    // },
    {
        path: 'home2',
        loadComponent: () => import('./features/home2/home2.component').then(m => m.Home2Component)
    },
    {
        path: 'home3',
        loadComponent: () => import('./features/home3/home3.component').then(m => m.Home3Component)
    },
    {
        path: 'collegesv1',
        loadComponent: () => import('./features/college-list/college-list.component').then(m => m.CollegeListComponent)
    },
    {
        path: 'colleges',
        loadComponent: () => import('./features/college-search/college-search.component').then(m => m.CollegeSearchComponent)
    },
    {
        path: 'colleges/:id',
        loadComponent: () => import('./features/college-details/college-details.component').then(m => m.CollegeDetailsComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    },
    {
        path: 'admin/add-college',
        loadComponent: () => import('./features/admin/college-form/college-form.component').then(m => m.CollegeFormComponent)
    },
    {
        path: 'admin/edit-college/:id',
        loadComponent: () => import('./features/admin/college-form/college-form.component').then(m => m.CollegeFormComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
