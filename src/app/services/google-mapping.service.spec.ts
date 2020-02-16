import { TestBed } from '@angular/core/testing';

import { GoogleMappingService } from './google-mapping.service';

describe('GoogleMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleMappingService = TestBed.get(GoogleMappingService);
    expect(service).toBeTruthy();
  });
});
