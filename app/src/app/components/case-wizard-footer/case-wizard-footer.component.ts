import { Component, input, numberAttribute } from '@angular/core';
import { JeButton, JeToolbar } from 'jebamo-angular';

@Component({
  selector: 'bc-case-wizard-footer',
  imports: [JeToolbar, JeButton],
  templateUrl: './case-wizard-footer.component.html',
  styleUrl: './case-wizard-footer.component.scss'
})
export class CaseWizardFooterComponent {
  step = input<number, string>(undefined, {transform:numberAttribute});

  back() {
    document.querySelector<HTMLJeWizardElement>('je-wizard')?.previous()
  }
}
