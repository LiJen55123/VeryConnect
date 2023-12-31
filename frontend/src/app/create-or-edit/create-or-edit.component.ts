import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../sevices/api.service';
import {HttpErrorResponse} from "@angular/common/http";
import {TicketFormModel} from "../models/ticket-form.model"; // Make sure the path is correct
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {TicketModel} from "../models/ticket.model";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-or-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './create-or-edit.component.html',
  styleUrls: ['./create-or-edit.component.scss']
})
export class CreateOrEditComponent implements OnInit {
  public title: string = ''; // Variable for the title
  public data: string | undefined;
  public formFields: TicketFormModel | undefined; // Store the form fields here
  public ticketForm: FormGroup = new FormGroup({
    Name: new FormControl(''), // Initialize with an empty string or a default value
    // ... initialize other form controls
  });
  public ticketId?: number;
  constructor(
      private titleService: Title,
      private route: ActivatedRoute,
      private router: Router,
      private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getFormField();
    // Check if we're in 'create' or 'edit' mode based on the current route.
    this.route.data.subscribe(data => {
      this.data = data['data'];  // 'data' here would be set in your route configuration
    });

    // If we're in 'edit' mode, get the 'ticketId' from route parameters
    if (this.data === 'Edit') {
      this.route.params.subscribe(params => {
        this.ticketId = +params['ticketId']; // The '+' is a shorthand to convert string to number
        console.log(this.ticketId)
        if (this.ticketId) {
          this.apiService.getTicketById(this.ticketId).subscribe({
            next: (ticket: TicketModel) => {
              this.ticketForm.patchValue(ticket);
            },
            error: (err) => {
              console.error('Error fetching ticket details', err);
            }
          });
        }
      });
    }

    if (this.data === 'Create') {
    this.title = 'Create a Ticket';
    this.titleService.setTitle('Create a Ticket'); // Set page title
  } else if (this.data === 'Edit') {
    this.title = `Edit Ticket #${this.ticketId}`;
    this.titleService.setTitle(this.title); // Set page title
  }
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
    const formData = this.ticketForm.value;
    if (this.data === 'Create') {
      // Create ticket logic
      this.apiService.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket created successfully', response);
          setTimeout(() => this.router.navigate(['/']), 1000)
        },
        error: (error) => {
          console.error('Error creating ticket:', error);
        }
      });
    } else if (this.data === 'Edit' && this.ticketId) {
      // Update ticket logic
      this.apiService.updateTicket(this.ticketId, formData).subscribe({
        next: (response) => {
          console.log('Ticket updated successfully', response);
          setTimeout(() => this.router.navigate(['/']), 1000)
        },
        error: (error) => {
          console.error('Error updating ticket:', error);
        }
      });
    }
  }
}

}
