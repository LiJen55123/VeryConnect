// Assume we have an interface like this:
import {NgForOf} from "@angular/common";

export interface Ticket {
  // Define properties based on your actual ticket structure
  id: number;
  Name: string;
  // ...other properties
}

// Your component:
import {Component, HostListener, OnInit} from '@angular/core';
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
  private offset: number = 0;
  private limit: number = 20; // Determine the appropriate page size
  private allDataLoaded: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTickets();
  }
  loadTickets(): void {
    if (this.allDataLoaded) {
      return;
    }

    this.apiService.getTickets(this.offset, this.limit).subscribe({
      next: (data: TicketModel[]) => {
        this.tickets = [...this.tickets, ...data];
        this.offset += data.length;
        if (data.length < this.limit) {
          this.allDataLoaded = true; // No more data to load
        }
      },
      error: (error: any) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // Load more tickets
      this.loadTickets();
    }
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
