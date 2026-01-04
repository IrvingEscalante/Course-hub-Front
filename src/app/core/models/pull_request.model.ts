import { UserOut } from "./user.model";

export interface PullRequestBasicOut{
    id_pull_request: number;
    title: string;
    id_course_source: number;
    id_course_target: number;
    description_pull_request: string;
    status_pull: string;
    merge_status: string;
    date_created: string;
    date_resolved: string | null;
    user: UserOut;
    reviewer: UserOut | null;
}

export interface PullRequestChange {
  id_change: number;
  id_pull_request: number;
  entity_type: string;
  entity_id: number | null;
  entity_uuid: string | null;
  action: 'ADD' | 'UPDATE' | 'DELETE';
  reason: string | null;
  old_data: any;
  new_data: any;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  date_created: string;
  parent_info?: {
    parent_type: 'module' | 'publication';
    parent_id: number;
    parent_name: string;
  } | null;
}

export interface PullRequestChangesResponse {
    id_pull_request: number;
    changes: PullRequestChange[];
    total: number;
}