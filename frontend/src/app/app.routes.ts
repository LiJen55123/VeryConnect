import {Routes} from '@angular/router';
import {Home} from './Home/Home.component';
import {AboutComponent} from './about/about.component'
export const routes: Routes = [
  {
    path: 'home',
    title: 'App Home Page',
    component: Home,
  },
  {
    path: 'about',
    title: 'App about Page',
    component: AboutComponent,
  },
];
