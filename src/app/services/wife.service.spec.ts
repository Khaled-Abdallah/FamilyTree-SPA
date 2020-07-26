import { TestBed } from '@angular/core/testing';

import { WifeService } from './wife.service';

describe('WifeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WifeService = TestBed.get(WifeService);
    expect(service).toBeTruthy();
  });
});
