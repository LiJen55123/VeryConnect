import {Routes} from '@angular/router';
import {Home} from './Home/Home.component';
import {AboutComponent} from './about/about.component'
import { WelcomeComponent } from './welcome/welcome.component'
export const routes: Routes = [
  {
    path: '',
    title: 'App about Page',
    component: WelcomeComponent,
  },
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
