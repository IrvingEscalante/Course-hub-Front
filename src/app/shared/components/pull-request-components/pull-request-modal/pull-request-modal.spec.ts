import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestModal } from './pull-request-modal';

describe('PullRequestModal', () => {
  let component: PullRequestModal;
  let fixture: ComponentFixture<PullRequestModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PullRequestModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullRequestModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
