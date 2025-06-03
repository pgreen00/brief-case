import { SlicePipe } from '@angular/common';
import { afterRenderEffect, Component, ElementRef, inject, input, resource, signal, viewChild } from '@angular/core';
import { JeButton, JeLoading, JeTextfield, JeToolbar, JeTooltip } from 'jebamo-angular';
import { Grid } from '../grid/grid';
import { CASE_GROUPS } from '../../tokens/case-groups';

type Case = {
  id: number
  case_group: {
    id: number
    title: string
    description: string
  }
  business_user: {
    id: number
    first_name: string
    last_name: string
    middle_name: string | null
    email: string
    phone: string
  }
  tags: string[] | null
  code: string
}

@Component({
  selector: 'bc-cases-view',
  imports: [Grid, JeLoading, SlicePipe, JeTooltip, JeTextfield, JeToolbar],
  templateUrl: './cases-view.html',
  styleUrl: './cases-view.css'
})
export class CasesView {
  groupId = input<number>();
  bottom = viewChild<ElementRef>('bottom');
  pagination = signal(0);
  caseGroups = inject(CASE_GROUPS)
  intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && this.pagination() < (this.cases.value()?.length ?? 0)) {
        this.pagination.update(p => p + 25)
      }
    }
  })

  cases = resource({
    params: () => this.groupId(),
    loader: async ({params}) => {
      if (!params) return []
      const response = await fetch(`${server}/case_groups/${params}/cases`, { credentials: 'include' });
      return await response.json() as Case[];
    }
  })

  constructor() {
    afterRenderEffect(() => {
      this.intersectionObserver.disconnect()
      const el = this.bottom()?.nativeElement
      if (el) {
        this.intersectionObserver.observe(el)
      }
    })
  }

  async copyToClipboard(code: string, el: HTMLButtonElement) {
    await navigator.clipboard.writeText(code)
    el.innerHTML = 'Copied <je-icon size="sm">check</je-icon>'
    await new Promise(resolve => setTimeout(resolve, 3000))
    el.innerHTML = code
  }
}
