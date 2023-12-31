import {Routes} from '@angular/router';
import {CreateOrEditComponent} from './create-or-edit/create-or-edit.component'
import {LandingComponent} from "./landing/landing.component";

export const routes: Routes = [
  {
    path: 'create_edit',
    title: 'App about Page',
    component: CreateOrEditComponent,
  },
  {
    path: '',
    title: 'App about Page',
    component: LandingComponent,
  },
];
