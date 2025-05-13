export interface College {
    id: number;
    name: string;
    city: string;
    state: string;
    category: 'deemed' | 'affiliated' | 'autonomous' | 'other';
    address: string;
    rating: number;
    established: number;
    courses: string[];
    description: string;
    imageUrl: string;
    contact: {
      phone: string;
      email: string;
      website: string;
    };
    active: boolean;
    location?: {
      latitude: number;
      longitude: number;
    };
    performance?: {
      placements: number;
      research: number;
      infrastructure: number;
      teaching: number;
    };
  }
  
  export interface CollegeSearchParams {
    name?: string;
    city?: string;
    state?: string;
    category?: string;
    course?: string;
    radius?: number;
    latitude?: number;
    longitude?: number;
    page?: number;
    limit?: number;
  }

  export interface CategorySection {
    title: string;
    description: string;
    icon: string;
    colleges: College[];
    expanded?: boolean;
  }