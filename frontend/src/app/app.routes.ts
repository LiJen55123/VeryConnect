import {Routes} from '@angular/router';
import {CreateOrEditComponent} from './create-or-edit/create-or-edit.component'
import {LandingComponent} from "./landing/landing.component";

export const routes: Routes = [
  {
    path: 'create_edit',
    component: CreateOrEditComponent,
    data: { data: 'Create' } // This sets the data for 'create' mode
  },
  {
    path: 'create_edit/:ticketId',
    component: CreateOrEditComponent,
    data: { data: 'Edit' } // This sets the data for 'edit' mode
  },
  {
    path: '',
    title: 'App about Page',
    component: LandingComponent,
  },
];
