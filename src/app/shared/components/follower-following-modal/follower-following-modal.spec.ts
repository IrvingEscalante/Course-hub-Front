import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerFollowingModal } from './follower-following-modal';

describe('FollowerFollowingModal', () => {
  let component: FollowerFollowingModal;
  let fixture: ComponentFixture<FollowerFollowingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowerFollowingModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerFollowingModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
