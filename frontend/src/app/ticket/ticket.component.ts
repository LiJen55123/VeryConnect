import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {TicketModel} from "../models/ticket.model";
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent implements OnInit {
  @Input() ticket!: TicketModel; // Accepts a single ticket as input
  @Output() deleteRequest = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
    if (!this.ticket || Object.keys(this.ticket).length === 0) {
      console.log('Ticket is empty');
    } else {
      console.log('Ticket is not empty', this.ticket);
    }
  }
  onDelete(): void {
    if (this.ticket && this.ticket.Id) {
      this.deleteRequest.emit(this.ticket.Id); // Emitting the ticket's ID
    }
  }
}
