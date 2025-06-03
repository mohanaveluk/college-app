export interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    mobile: string;
    major: string;
    created_at: Date;
    updated_at: Date;
    is_active: number;
    uguid: string;
    role_id: number;
    profileImage: string;
  }
  
  export interface ProfileUpdateRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    mobile?: string;
    major?: string;
    profileImage?: string;
  }