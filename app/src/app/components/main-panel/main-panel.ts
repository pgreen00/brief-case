import { Component, inject, resource } from '@angular/core';
import { JeBranch, JeIconButton, JeToolbar, JeTooltip, JeTree } from 'jebamo-angular';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Router } from '@angular/router';
import { CURRENT_USER } from '../../tokens/current-user';
import { CASE_GROUPS } from '../../tokens/case-groups';

@Component({
  selector: 'bc-main-panel',
  imports: [JeTree, JeBranch, JeToolbar, JeIconButton, JeTooltip],
  templateUrl: './main-panel.html',
  styleUrl: './main-panel.css'
})
export class MainPanel {
  private router = inject(Router)
  user = inject(CURRENT_USER)
  caseGroups = inject(CASE_GROUPS)
  business = resource({
    params: () => this.user(),
    loader: async ({params}) => {
      const base = `${server}/businesses/${params?.business_id}`
      const res = await fetch(`${base}?select=business_name,display_name`, { credentials: 'include' })
      return await res.json() as { business_name: string, display_name: string }
    }
  })

  setGroup(id: any) {
    this.router.navigate([], {
      queryParams: {
        groupId: id
      },
      queryParamsHandling: 'merge'
    })
  }

  openCaseWizard() {
    const win = new WebviewWindow('new-case', {
      url: '/cases/wizard',
      width: 800,
      height: 600,
      title: 'New Case'
    });
    win.once('tauri://created', () => console.log('wizard window ready'));
  }
}
