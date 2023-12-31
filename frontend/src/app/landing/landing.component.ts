import { Component } from '@angular/core';
import {TicketComponent} from '../ticket/ticket.component'
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [TicketComponent, MatButtonModule, RouterLink,],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
