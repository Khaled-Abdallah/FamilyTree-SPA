import { TestBed } from '@angular/core/testing';

import { FamilyCharactersService } from './family-characters.service';

describe('FamilyCharactersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FamilyCharactersService = TestBed.get(FamilyCharactersService);
    expect(service).toBeTruthy();
  });
});
