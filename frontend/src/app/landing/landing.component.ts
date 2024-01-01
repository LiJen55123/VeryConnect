// Assume we have an interface like this:
export interface Ticket {
  // Define properties based on your actual ticket structure
  id: number;
  Name: string;
  // ...other properties
}

// Your component:
import { Component, OnInit } from '@angular/core';
import { TicketComponent } from '../ticket/ticket.component';
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { ApiService } from "../sevices/api.service"; // Make sure this path is correct
import { TicketModel } from "../models/ticket.model"; // Update the path as needed

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [TicketComponent, MatButtonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'] // Corrected this line
})
export class LandingComponent implements OnInit {
  public tickets: TicketModel[] | undefined; // Changed to a concrete data structure

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getTickets().subscribe({
      next: (data: TicketModel[]) => { // Assuming the data is an array of Ticket
        console.log(data)
      },
      error: (error:any) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }
}
