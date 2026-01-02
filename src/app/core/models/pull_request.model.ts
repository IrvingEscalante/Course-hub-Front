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