// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {TicketFormModel} from "../models/ticket-form.model";
import {Observable} from "rxjs";
import {TicketModel} from "../models/ticket.model"; // Import the environment
@Injectable({
  providedIn: 'root' // This ensures that the service is a singleton
})
export class ApiService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  // Example HTTP GET request method
  get(url: string) {
    return this.http.get(this.baseUrl +url);
  }

  getTicketForm(): Observable<TicketFormModel> {
    return this.http.get<TicketFormModel>(`${this.baseUrl}/tickets/form-fields`);
  }
  // ... other HTTP methods like post, put, delete, etc.
  createTicket(ticketData: TicketFormModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/form-fields`, ticketData);
  }
  getTickets(): Observable<TicketModel[]> {
  return this.http.get<TicketModel[]>(`${this.baseUrl}/tickets`);
}
}
