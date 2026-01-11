import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Projects } from './components/projects/projects';
import { Resume } from './components/resume/resume';
import { Contact } from './components/contact/contact';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path: '', component: Home },
            { path: 'projects', component: Projects },
            { path: 'resume', component: Resume },
            { path: 'contact', component: Contact },
            { path: '**', redirectTo: '' },
        ]
    }
    
];
