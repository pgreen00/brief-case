import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetail } from './case-detail';

describe('CaseDetail', () => {
  let component: CaseDetail;
  let fixture: ComponentFixture<CaseDetail>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDetail);
    fixture.componentRef.setInput('id', 1)
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
