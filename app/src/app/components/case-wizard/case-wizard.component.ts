import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JeButton, JeCheckbox, JeForm, JeTextfield, JeToolbar, JeWizard } from 'jebamo-angular';

@Component({
  selector: 'bc-case-wizard',
  imports: [JeWizard, JeButton, JeToolbar, JeForm, JeTextfield, JeCheckbox],
  templateUrl: './case-wizard.component.html',
  styleUrl: './case-wizard.component.scss'
})
export class CaseWizardComponent {
  private router = inject(Router)
  steps = [
    { label: 'Client Info' },
    { label: 'Case Info' },
    { label: 'Case Group' },
  ]
  step = signal(0)

  constructor() {
    effect(() => {
      this.router.navigate([], {
        queryParams: {
          step: this.step()
        },
        queryParamsHandling: 'merge'
      })
    })
  }
}
