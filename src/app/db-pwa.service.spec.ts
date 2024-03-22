import { TestBed } from '@angular/core/testing';

import { DbPwaService } from './db-pwa.service';

describe('DbPwaService', () => {
  let service: DbPwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbPwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
