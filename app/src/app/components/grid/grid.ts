import { Component, input } from '@angular/core';

@Component({
  selector: 'bc-grid',
  imports: [],
  templateUrl: './grid.html',
  styleUrl: './grid.css'
})
export class Grid {
  columns = input.required<string[]>();
}
