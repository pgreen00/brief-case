import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPanel } from './main-panel';

describe('MainPanel', () => {
  let component: MainPanel;
  let fixture: ComponentFixture<MainPanel>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPanel],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPanel);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
