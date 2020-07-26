import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyCharEditComponent } from './family-char-edit.component';

describe('FamilyCharEditComponent', () => {
  let component: FamilyCharEditComponent;
  let fixture: ComponentFixture<FamilyCharEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyCharEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCharEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
