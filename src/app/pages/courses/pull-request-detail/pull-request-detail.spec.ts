import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestDetail } from './pull-request-detail';

describe('PullRequestDetail', () => {
  let component: PullRequestDetail;
  let fixture: ComponentFixture<PullRequestDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullRequestDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullRequestDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
