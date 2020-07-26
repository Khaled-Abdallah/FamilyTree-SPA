import { TestBed } from '@angular/core/testing';

import { DefinitionService } from './definition.service';

describe('DefinitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefinitionService = TestBed.get(DefinitionService);
    expect(service).toBeTruthy();
  });
});
