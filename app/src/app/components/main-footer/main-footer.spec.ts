import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFooter } from './main-footer';

describe('MainFooter', () => {
  let component: MainFooter;
  let fixture: ComponentFixture<MainFooter>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFooter);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
