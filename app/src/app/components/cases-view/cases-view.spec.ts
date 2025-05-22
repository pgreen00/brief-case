import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesView } from './cases-view';

describe('CasesView', () => {
  let component: CasesView;
  let fixture: ComponentFixture<CasesView>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesView);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
