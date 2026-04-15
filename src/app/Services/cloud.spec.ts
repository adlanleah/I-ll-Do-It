import { TestBed } from '@angular/core/testing';

import { Cloud } from './cloud';

describe('Cloud', () => {
  let service: Cloud;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cloud);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
