import { CollegeModel } from "./search-response.model";

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
    keyword?: string;
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

  export interface SearchEntityParams {
    k?: string;
    cs?: string;
    page?: number;
    limit?: number;
  }


  export interface CategorySection {
    id: string;
    title: string;
    description: string;
    icon: string;
    colleges: College[];
    expanded?: boolean;
    showScrollButtons?: boolean;
  }

  export interface Section {
    id: string;
    title: string;
    description: string;
    icon: string;
    expanded?: boolean;
  }

  export interface CategorySectionv2 {
    categorySection: {
      id: string;
      title: string;
      description: string;
      icon: string;
      expanded?: boolean;
    };
    showScrollButtons?: boolean;
    colleges: CollegeModel[];

  }

  export interface CollegesByCategoryResponse {
    results: CategorySectionv2[];
  }