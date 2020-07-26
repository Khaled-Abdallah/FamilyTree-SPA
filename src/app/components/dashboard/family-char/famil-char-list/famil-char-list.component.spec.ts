import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilCharListComponent } from './famil-char-list.component';

describe('FamilCharListComponent', () => {
  let component: FamilCharListComponent;
  let fixture: ComponentFixture<FamilCharListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilCharListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilCharListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
