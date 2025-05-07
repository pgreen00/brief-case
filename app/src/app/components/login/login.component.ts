import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { JeButton, JeDivider, JeForm, JeOption, JeSelect, JeTextfield } from 'jebamo-angular';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'bc-login',
  imports: [JeForm, JeTextfield, JeButton, JeSelect, JeOption, JeDivider],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  public businesses = toSignal(fromFetch<Business[]>(`${server}/businesses`, { selector: res => res.json() }))

  async submit(formData: Record<string, string>) {
    const res = await fetch(`${server}/auth`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData['email'],
        password: formData['pw'],
        businessId: Number(formData['businessId'] || '1')
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (res.ok) {
      this.router.navigate(['/'], {onSameUrlNavigation: 'reload'})
    }
  }
}
