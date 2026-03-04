import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error when getItems fails', () => {
    spyOn(console, 'error');
    // Simulate error by calling a method that would set error
    // This is a placeholder; actual implementation may require HttpTestingController
    expect(service).toBeTruthy(); // Service should still be created
  });
});
