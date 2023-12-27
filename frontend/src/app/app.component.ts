import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-root',
  templateUrl: "app.component.html",
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink],
  styleUrl: "app.component.scss"
})
export class AppComponent {}
