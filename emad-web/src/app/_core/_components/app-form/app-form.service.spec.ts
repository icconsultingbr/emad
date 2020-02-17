import { TestBed, inject } from '@angular/core/testing';

import { AppFormService } from './app-form.service';

describe('AppFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppFormService]
    });
  });

  it('should be created', inject([AppFormService], (service: AppFormService) => {
    expect(service).toBeTruthy();
  }));
});
