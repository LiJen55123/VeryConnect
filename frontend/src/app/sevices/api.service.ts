// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  getTickets(offset: number = 0, limit: number = 20): Observable<TicketModel[]> {
  // Update the URL to include query parameters for pagination
  return this.http.get<TicketModel[]>(`${this.baseUrl}/tickets?offset=${offset}&limit=${limit}`);
}
  // Add a method to get a single ticket by its ID
  getTicketById(ticketId: number): Observable<TicketModel> {
    return this.http.get<TicketModel>(`${this.baseUrl}/tickets/${ticketId}`);
  }
  // Add a method to update a ticket
  updateTicket(ticketId: number, ticketData: TicketModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/tickets/${ticketId}`, ticketData);
  }
  searchTickets(searchTerm: string, offset: number, limit: number): Observable<TicketModel[]> {
  const params = new HttpParams()
    .set('offset', offset.toString())
    .set('limit', limit.toString())
    .set('keyword', searchTerm);

  return this.http.get<TicketModel[]>(`${this.baseUrl}/tickets`, { params });
}
  deleteTicket(ticketId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tickets/${ticketId}`);
  }
}
