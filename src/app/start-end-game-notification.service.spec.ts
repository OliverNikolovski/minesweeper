import { TestBed } from '@angular/core/testing';

import { StartEndGameNotificationService } from './start-end-game-notification.service';

describe('StartGameNotificationService', () => {
  let service: StartEndGameNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartEndGameNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
