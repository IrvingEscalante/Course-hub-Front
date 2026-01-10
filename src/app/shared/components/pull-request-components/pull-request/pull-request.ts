import { Component, inject, Input } from '@angular/core';
import { Avatar } from "../../avatar/avatar";
import { PullRequestBasicOut } from '../../../../core/models/pull_request.model';
import { Router, RouterModule } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pull-request',
  imports: [Avatar, RouterModule, DatePipe, CommonModule],
  templateUrl: './pull-request.html',
  styleUrl: './pull-request.css'
})
export class PullRequest {
  @Input() pull?:PullRequestBasicOut;
  @Input() isReceivedPR: boolean = true;
  router = inject(Router);

  goToPullRequestDetail(prId: number) {
    this.router.navigate(['/course', 'pull-request', prId.toString()]);
    console.log(prId)
  }
}
