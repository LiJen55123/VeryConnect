import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button'
import {MatListModule} from "@angular/material/list";
@Component({
  selector: 'app-Home',
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatButtonModule, MatListModule],
  templateUrl: './Home.component.html',
  styleUrl: './Home.component.scss'
})
export class Home {

}
