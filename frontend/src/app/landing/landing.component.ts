// Assume we have an interface like this:
import {NgForOf} from "@angular/common";
// Your component:
import {Component, HostListener, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {ApiService} from "../sevices/api.service"; // Make sure this path is correct
import {TicketModel} from "../models/ticket.model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input"; // Update the path as needed

export interface Ticket {
  // Define properties based on your actual ticket structure
  id: number;
  Name: string;
  // ...other properties
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink, NgForOf, MatFormFieldModule, MatInputModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'] // Corrected this line
})
export class LandingComponent implements OnInit {
  public tickets: TicketModel[] = [];
  private offset: number = 0;
  private limit: number = 20; // Determine the appropriate page size
  private allDataLoaded: boolean = false;
  private searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTickets();
  }
  searchTickets(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // Reset tickets and offset for a new search
    this.tickets = [];
    this.offset = 0;
    this.allDataLoaded = false;

    // Call the search method if the term length is 3 or more
    if (this.searchTerm.length >= 3 || this.searchTerm.length == 0) {
      this.loadTickets(true);
    }
  }
  loadTickets(isSearch: boolean = false): void {
    if (this.allDataLoaded && !isSearch) {
      return;
    }

    this.apiService.searchTickets(this.searchTerm, this.offset, this.limit).subscribe({
      next: (data: TicketModel[]) => {
        this.tickets = isSearch ? data : [...this.tickets, ...data];
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
