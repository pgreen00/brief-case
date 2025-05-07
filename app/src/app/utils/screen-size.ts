import { InjectionToken } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, debounceTime, distinctUntilChanged, map, startWith } from "rxjs";

const breakpoints = {
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
} as const;

const windowResize$ = fromEvent(window, 'resize').pipe(debounceTime(200), distinctUntilChanged());

const currentBreakpoint$ = windowResize$.pipe(
  startWith(null),
	map(() => {
		const width = window.innerWidth;
		if (width < breakpoints.sm) return 'xs';
		if (width < breakpoints.md) return 'sm';
		if (width < breakpoints.lg) return 'md';
		if (width < breakpoints.xl) return 'lg';
		return 'xl';
	})
);

export const CURRENT_BREAKPOINT = new InjectionToken('current breakpoint', {
	providedIn: 'root',
	factory: () => toSignal(currentBreakpoint$.pipe(distinctUntilChanged()), { requireSync: true })
})
