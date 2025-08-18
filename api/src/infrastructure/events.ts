import { filter, map, Subject } from "rxjs";

type EventName = 'case_updated' | 'case_group_updated';

type EventData<T extends EventName> =
  T extends 'case_updated' ? { id: number }
  : T extends 'case_group_updated' ? { id: number, test: string }
  : never;

type ApiEvent<T extends EventName = EventName> = {
  name: T;
  data: EventData<T>;
  tenantId: number;
};

const events$ = new Subject<ApiEvent>();

export function listen<T extends EventName>(name: T, tenantId: number) {
  return events$.pipe(
    filter(e => e.name === name && e.tenantId === tenantId),
    map(e => e.data as EventData<T>)
  )
}

export function raise<T extends EventName>(event: ApiEvent<T>) {
  events$.next(event);
}
