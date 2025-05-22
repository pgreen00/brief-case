import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseWizardFooter } from './case-wizard-footer';

describe('CaseWizardFooter', () => {
  let component: CaseWizardFooter;
  let fixture: ComponentFixture<CaseWizardFooter>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseWizardFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseWizardFooter);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
