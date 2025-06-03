import { InjectionToken } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { fromFetch } from "rxjs/fetch";

type CaseGroupWithChildren = CaseGroup & { children: CaseGroupWithChildren[] }

const caseGroups$ = fromFetch<CaseGroupWithChildren[]>(`${server}/case_groups`, {
  credentials: 'include',
  selector: res => res.json()
})

export const CASE_GROUPS = new InjectionToken('case groups', {
  providedIn: 'root',
  factory: () => rxResource({
    stream: () => caseGroups$,
    defaultValue: []
  }).asReadonly()
})
