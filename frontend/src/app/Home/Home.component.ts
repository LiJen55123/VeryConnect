import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button'
@Component({
  selector: 'app-Home',
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './Home.component.html',
  styleUrl: './Home.component.scss'
})
export class Home {
  constructor() {
    console.log("happy");
  }
}
