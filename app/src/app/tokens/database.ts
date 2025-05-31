import { InjectionToken } from "@angular/core";
import Dexie, { Table } from "dexie";

class BriefCaseDatabase extends Dexie {
  featureFlags!: Table<FeatureFlag, number>;

  constructor() {
    super('BriefCaseDatabase');
    this.version(1).stores({
      featureFlags: 'id, enabled'
    });
  }
}

export const DATABASE = new InjectionToken('BriefCaseDatabase', {
  providedIn: 'root',
  factory: () => new BriefCaseDatabase()
});
