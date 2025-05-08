import { Component, input } from '@angular/core';

@Component({
  selector: 'bc-case-detail',
  imports: [],
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.scss'
})
export class CaseDetailComponent {
  id = input.required<number>();
}
