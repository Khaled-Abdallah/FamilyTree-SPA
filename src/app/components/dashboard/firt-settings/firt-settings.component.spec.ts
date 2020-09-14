import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirtSettingsComponent } from './firt-settings.component';

describe('FirtSettingsComponent', () => {
  let component: FirtSettingsComponent;
  let fixture: ComponentFixture<FirtSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirtSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirtSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
