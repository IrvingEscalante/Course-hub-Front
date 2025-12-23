import { Component, Input } from '@angular/core';
import { Avatar } from "../../avatar/avatar";
import { PullRequestBasicOut } from '../../../../core/models/pull_request.model';

@Component({
  selector: 'app-pull-request',
  imports: [Avatar],
  templateUrl: './pull-request.html',
  styleUrl: './pull-request.css'
})
export class PullRequest {
  @Input() pull?:PullRequestBasicOut;
}
