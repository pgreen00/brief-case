import { Component, inject, resource } from '@angular/core';
import { JeBranch, JeIconButton, JeToolbar, JeTooltip, JeTree } from 'jebamo-angular';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Router } from '@angular/router';

type CaseGroup = {
  id: number;
  title: string;
  business_id: number;
  description: string | null;
  parent_id: number | null;
  group_rank: number | null;
  automations: Record<string, string> | null;
  last_modified: Date;
}
type CaseGroupWithChildren = CaseGroup & { children: CaseGroupWithChildren[] }

@Component({
  selector: 'bc-main-panel',
  imports: [JeTree, JeBranch, JeToolbar, JeIconButton, JeTooltip],
  templateUrl: './main-panel.component.html',
  styleUrl: './main-panel.component.scss'
})
export class MainPanelComponent {
  private router = inject(Router)

  caseGroups = resource({
    loader: async () => {
      const res = await fetch(`${server}/case_groups`, { credentials: 'include' })
      return await res.json() as CaseGroupWithChildren[];
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
    win.once('tauri://created', () => console.log('settings window ready'));
  }
}
