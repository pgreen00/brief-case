import { Component, input, resource } from '@angular/core';

type Case = {
  id: number
  business_user_id: number
  case_group_id: number
  case_group_title: string
  case_group_description: string | null
  case_group_parent_id: number | null
  tags: string[]
  code: string
  first_name: string | null
  last_name: string | null
  middle_name: string | null
  email: string
  phone: string | null
}

@Component({
  selector: 'bc-cases-view',
  imports: [],
  templateUrl: './cases-view.component.html',
  styleUrl: './cases-view.component.scss'
})
export class CasesViewComponent {
  groupId = input<number>();

  cases = resource({
    request: () => this.groupId(),
    loader: async ({request}) => {
      if (!request) return []
      const response = await fetch(`${server}/cases/by_group/${request}`, { credentials: 'include' });
      return await response.json() as Case[];
    }
  })
}
