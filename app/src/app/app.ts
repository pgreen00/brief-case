import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JePage } from 'jebamo-angular';

@Component({
  selector: 'bc-root',
  imports: [RouterOutlet, JePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'brief-case-app';
}
