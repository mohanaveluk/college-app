export interface RecentCollege {
    college_id: string;
    user_id: string;
    active?: boolean;
    last_visited?: Date;
    visit_count?: number;
    tags?: string[];
    notes?: string;
  }