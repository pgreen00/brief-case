import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JePage } from 'jebamo-angular';

@Component({
  selector: 'bc-root',
  imports: [RouterOutlet, JePage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'brief-case-app';
}
