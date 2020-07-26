import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWifesComponent } from './user-wifes.component';

describe('UserWifesComponent', () => {
  let component: UserWifesComponent;
  let fixture: ComponentFixture<UserWifesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWifesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWifesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
