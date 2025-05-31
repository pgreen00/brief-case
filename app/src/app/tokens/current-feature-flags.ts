import { inject, InjectionToken, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DATABASE } from "./database";
import { liveQuery } from "dexie";

export const CURRENT_FEATURE_FLAGS = new InjectionToken('current feature flags', {
  providedIn: 'root',
  factory: () => {
    const db = inject(DATABASE);
    const query$ = liveQuery(() => db.featureFlags.where({ enabled: true }).primaryKeys());
    return toSignal(query$, { initialValue: [] }) as Signal<number[]>;
  }
})
