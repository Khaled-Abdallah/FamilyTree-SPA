import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChildrenComponent } from './user-children.component';

describe('UserChildrenComponent', () => {
  let component: UserChildrenComponent;
  let fixture: ComponentFixture<UserChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChildrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
