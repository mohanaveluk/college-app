// college-search-response.model.ts
export interface CollegeSearchResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// college.model.ts
export interface CollegeModel {
    id: string;
    code: number;
    name: string;
    address: string;
    city: string;
    state: State;
    zip: number;
    district: District;
    country: Country;
    category: string;
    rating: number;
    established: number;
    description: string;
    image_url?: string;
    phone: string;
    email: string;
    website?: string;
    latitude?: string;
    longitude?: string;
    created_at: Date;
    created_by: string;
    updated_at?: Date;
    updated_by?: string;
    active: boolean;
    collegeCourses?: CollegeCourse[];
    performances?: Performance[];
  }

  // Related models
export interface State {
    id: string;
    code: string;
    name: string;
  }
  
  export interface District {
    id: string;
    code: string;
    name: string;
  }
  
  export interface Country {
    id: string;
    code: string;
    name: string;
  }
  
  export interface CollegeCourse {
    id: string;
    research: number;
    infrastructure: number;
    teaching: number;
    course: Course;
  }
  
  export interface Course {
    id: string;
    code: string;
    name: string;
  }
  
  export interface Performance {
    id: string;
    placements: number;
    research: number;
    infrastructure: number;
    teaching: number;
  }

  export interface RecentlyViewed {
    id:           string;
    college_id:   string;
    user_id:      string;
    active:       boolean;
    created_at:   Date;
    last_visited: Date;
    visit_count:  number;
    tags:         string;
    notes:        string;
    college:      CollegeModel;
}