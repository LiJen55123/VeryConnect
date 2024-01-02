// Assume we have an interface like this:
import {NgForOf} from "@angular/common";

export interface Ticket {
  // Define properties based on your actual ticket structure
  id: number;
  Name: string;
  // ...other properties
}

// Your component:
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { ApiService } from "../sevices/api.service"; // Make sure this path is correct
import { TicketModel } from "../models/ticket.model"; // Update the path as needed

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink, NgForOf],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'] // Corrected this line
})
export class LandingComponent implements OnInit {
  public tickets: TicketModel[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getTickets().subscribe({
      next: (data: TicketModel[]) => { // Assuming the data is an array of Ticket
        this.tickets=data;
      },
      error: (error:any) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }
  handleDelete(ticketId: number): void {
    // Confirm with the user if they really want to delete the ticket
    const confirmation = window.confirm('Are you sure you want to delete this ticket?');

    if (confirmation) {
      // Call your ApiService to delete the ticket
      this.apiService.deleteTicket(ticketId).subscribe({
        next: () => {
          console.log(`Ticket with ID ${ticketId} deleted successfully.`);
          // Remove the ticket from the local array to update the UI
          this.tickets = this.tickets.filter(ticket => ticket.Id !== ticketId);
        },
        error: (error) => {
          console.error('Error deleting ticket:', error);
        }
      });
    }
  }
}
