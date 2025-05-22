import { Component, input } from '@angular/core';

@Component({
  selector: 'bc-case-detail',
  imports: [],
  templateUrl: './case-detail.html',
  styleUrl: './case-detail.css'
})
export class CaseDetail {
  id = input.required<number>();
}
