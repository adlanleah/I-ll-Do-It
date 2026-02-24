import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { keepGuard } from './keep-guard';

describe('keepGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => keepGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
