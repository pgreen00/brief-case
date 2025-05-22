import { Component, effect, inject, resource, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JeBranch, JeCheckbox, JeDatepicker, JeForm, JePopover, JeTextfield, JeTree, JeWizard } from 'jebamo-angular';
import { CASE_GROUPS } from '../../tokens/case-groups';

interface Dto {
  intake: {
    address: string | null;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    spouseOrEx: string | null;
    maidenName: string | null;
    mothersLastName: string | null;
    children: {
      name: string | null;
      age: number | null;
    }[];
    hs: string | null;
    college: string | null;
    priorFiling: boolean;
    dateLastWorked: Date;
    workHistory: string;
    impairments: string;
    medical: string;
    pharmacy: string;
    notes: string;
    referral: string | null;
    isFeeAgreement: boolean;
  };
  client: {
    firstName: string
    lastName: string
    middleName: string | null
    dob: Date
    gender: string | null
    phone: string
    altPhone: string | null
    email: string
    altContact: string
    altContactPhone: string
    ssn: string
  };
  caseGroup: number;
};

@Component({
  selector: 'bc-case-wizard',
  imports: [JeWizard, JeForm, JeTextfield, JeCheckbox, JeDatepicker, JePopover, JeTree, JeBranch],
  templateUrl: './case-wizard.html',
  styleUrl: './case-wizard.css'
})
export class CaseWizard {
  private router = inject(Router)
  private wizard = viewChild.required(JeWizard)
  caseGroups = inject(CASE_GROUPS);
  steps = [
    { label: 'Client Info' },
    { label: 'Case Info' },
    { label: 'Case Group' },
  ]
  step = signal(0)

  clientInfo?: Record<string, any>;
  caseInfo?: Record<string, any>;

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

  async submit(formData: Record<string, any>) {
    if (this.step() === 0) {
      this.clientInfo = formData
      this.wizard().next()
    } else if (this.step() === 1) {
      this.caseInfo = formData
      this.wizard().next()
    } else if (this.step() === 2) {
      const dto: Dto = {
        intake: {
          address: this.caseInfo!['address'] || null,
          maritalStatus: this.caseInfo!['maritalStatus'] || 'single',
          spouseOrEx: this.caseInfo!['spouseOrEx'] || null,
          maidenName: this.caseInfo!['maidenName'] || null,
          mothersLastName: this.caseInfo!['mothersLastName'] || null,
          children: [],
          hs: this.caseInfo!['hs'] || null,
          college: this.caseInfo!['college'] || null,
          priorFiling: this.caseInfo!['priorFiling'] === 'true',
          dateLastWorked: new Date(this.caseInfo!['dlw']) || null,
          workHistory: this.caseInfo!['workHistory'] || null,
          impairments: this.caseInfo!['impairments'] || null,
          medical: this.caseInfo!['medical'] || null,
          pharmacy: this.caseInfo!['pharmacy'] || null,
          notes: this.caseInfo!['notes'] || null,
          referral: this.caseInfo!['referral'] || null,
          isFeeAgreement: this.caseInfo!['feeAgreement'] === 'true'
        },
        client: {
          firstName: this.clientInfo!['firstName'] || null,
          lastName: this.clientInfo!['lastName'] || null,
          middleName: this.clientInfo!['middleName'] || null,
          dob: new Date(Number(this.clientInfo!['dob'])) || null,
          gender: this.clientInfo!['gender'] || null,
          phone: this.clientInfo!['phone'] || null,
          altPhone: this.clientInfo!['altPhone'] || null,
          email: this.clientInfo!['email'] || null,
          altContact: this.clientInfo!['altContact'] || '',
          altContactPhone: this.clientInfo!['altContactPhone'] || '',
          ssn: this.clientInfo!['ssn']
        },
        caseGroup: Number(formData['caseGroup'])
      }
      const res = await fetch(`${server}/cases`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      })
      if (res.ok) {
        this.wizard().next()
      }
    }
  }
}
