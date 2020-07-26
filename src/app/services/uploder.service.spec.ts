import { TestBed } from '@angular/core/testing';

import { UploderService } from './uploder.service';

describe('UploderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploderService = TestBed.get(UploderService);
    expect(service).toBeTruthy();
  });
});
