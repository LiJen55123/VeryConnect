import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-create-or-edit',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './create-or-edit.component.html',
  styleUrl: './create-or-edit.component.scss'
})
export class CreateOrEditComponent {
  public data: string | undefined; // This property will hold the data

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as { data: string };
      this.data = state.data; // Assign the data from state to the component property
    }
  }
}
