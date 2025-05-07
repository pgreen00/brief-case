import { InjectionToken } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CanActivateFn } from "@angular/router";
import { BehaviorSubject, catchError, map, of, switchMap, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";

const user$ = new BehaviorSubject<User | null>(null)

export const CURRENT_USER = new InjectionToken('current user', {
  providedIn: 'root',
  factory: () => toSignal(user$, { requireSync: true })
})

const fetchUser$ = fromFetch(`${server}/auth`, { credentials: 'include' }).pipe(
  switchMap(response => response.status == 200 ? response.json() as Promise<User> : of(null)),
  catchError(() => of(null)),
  tap(user => user$.next(user))
)

export const auth: CanActivateFn = (_route, _state) => {
  return user$.value ? true : fetchUser$.pipe(map(() => !!user$.value))
}
