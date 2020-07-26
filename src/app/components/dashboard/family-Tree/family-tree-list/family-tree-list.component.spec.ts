import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTreeListComponent } from './family-tree-list.component';

describe('FamilyTreeListComponent', () => {
  let component: FamilyTreeListComponent;
  let fixture: ComponentFixture<FamilyTreeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyTreeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
