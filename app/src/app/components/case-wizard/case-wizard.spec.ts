import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseWizard } from './case-wizard';

describe('CaseWizard', () => {
  let component: CaseWizard;
  let fixture: ComponentFixture<CaseWizard>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseWizard);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
