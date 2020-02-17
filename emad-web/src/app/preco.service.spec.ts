import { TestBed, inject } from '@angular/core/testing';

import { PrecoService } from './preco.service';

describe('PrecoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrecoService]
    });
  });

  it('should be created', inject([PrecoService], (service: PrecoService) => {
    expect(service).toBeTruthy();
  }));
});
