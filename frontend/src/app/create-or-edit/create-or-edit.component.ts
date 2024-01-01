import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../sevices/api.service';
import {HttpErrorResponse} from "@angular/common/http";
import {TicketFormModel} from "../models/ticket-form.model"; // Make sure the path is correct
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-create-or-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    // HttpClientModule, // Uncomment this if you are importing HttpClientModule here
  ],
  templateUrl: './create-or-edit.component.html',
  styleUrls: ['./create-or-edit.component.scss']
})
export class CreateOrEditComponent implements OnInit {
  public data: string | undefined;
  public formFields: TicketFormModel | undefined; // Store the form fields here
  public ticketForm: FormGroup = new FormGroup({
    Name: new FormControl(''), // Initialize with an empty string or a default value
    // ... initialize other form controls
  });

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as { data: string };
      this.data = state.data;
    }

    this.getFormField(); // Call the method to get the form fields on init
    console.log(this.formFields)
  }

  getFormField(): void {
    this.apiService.getTicketForm().subscribe({
      next: (response: TicketFormModel) => {
        console.log("getting form fields:", response);
        this.formFields = response; // Store the response data
        // Now you can use this.formFields to build your form in the template
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error getting form fields', err);
      },
      complete: () => {
        console.log('Completed fetching form fields');
      }
    });
  }
  submitForm(): void {
    if (this.ticketForm.valid) {
      const formData = this.ticketForm.value; // This will be your form data object
      this.apiService.createTicket(formData).subscribe({
        next: (response) => {
          // Handle the successful response here
          console.log('Ticket created successfully:', response);
          // You might want to navigate to another page or display a success message
        },
        error: (error) => {
          // Handle errors here
          console.error('Error creating ticket:', error);
        }
      });
    }
  }
}
