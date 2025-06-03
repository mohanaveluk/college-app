import { Injectable } from '@angular/core';
import { College, CollegesByCategoryResponse, CollegeSearchParams } from '../models/college.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, delay, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { CollegeModel, CollegeSearchResponse, Country, District, State } from '../models/search-response.model';
import { RecentCollege } from '../models/recent-college.model';

@Injectable({
  providedIn: 'root'
})

export class CollegeService {
  private apiUrl = 'https://api.example.com/colleges'; // Replace with actual API endpoint
  
  private recentCollegesSubject = new BehaviorSubject<College[]>([]);
  recentColleges$ = this.recentCollegesSubject.asObservable();
  private destroy$ = new Subject<void>();

  
  // Mock data for development until the API is available
  private mockColleges: College[] = [
    {
      id: 1,
      name: 'Harvard University',
      city: 'Cambridge',
      state: 'Massachusetts',
      category: 'deemed',
      address: '86 Brattle Street, Cambridge, MA 02138',
      rating: 4.9,
      established: 1636,
      courses: ['Computer Science', 'Business', 'Law', 'Medicine', 'Arts'],
      description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher learning in the United States.',
      imageUrl: 'https://images.pexels.com/photos/164589/pexels-photo-164589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '(617) 495-1000',
        email: 'admissions@harvard.edu',
        website: 'harvard.edu'
      },
      active: true,
      location: {
        latitude: 42.3770,
        longitude: -71.1167
      },
      performance: {
        placements: 98,
        research: 95,
        infrastructure: 97,
        teaching: 96
      }
    },
    {
      id: 2,
      name: 'Stanford University',
      city: 'Stanford',
      state: 'California',
      category: 'deemed',
      address: '450 Serra Mall, Stanford, CA 94305',
      rating: 4.8,
      established: 1885,
      courses: ['Engineering', 'Computer Science', 'Business', 'Medicine', 'Education'],
      description: 'Stanford University is a private research university in Stanford, California. Its academic strength, wealth, and proximity to Silicon Valley have made it one of the world\'s most prestigious universities.',
      imageUrl: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '(650) 723-2300',
        email: 'admission@stanford.edu',
        website: 'stanford.edu'
      },
      active: true,
      location: {
        latitude: 37.4275,
        longitude: -122.1697
      },
      performance: {
        placements: 96,
        research: 98,
        infrastructure: 95,
        teaching: 94
      }
    },
    {
      id: 3,
      name: 'MIT',
      city: 'Cambridge',
      state: 'Massachusetts',
      category: 'deemed',
      address: '77 Massachusetts Ave, Cambridge, MA 02139',
      rating: 4.9,
      established: 1861,
      courses: ['Engineering', 'Computer Science', 'Mathematics', 'Physics', 'Business'],
      description: 'The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has played a key role in the development of many areas of modern technology and science.',
      imageUrl: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '(617) 253-1000',
        email: 'admissions@mit.edu',
        website: 'mit.edu'
      },
      active: true,
      location: {
        latitude: 42.3601,
        longitude: -71.0942
      },
      performance: {
        placements: 99,
        research: 99,
        infrastructure: 96,
        teaching: 97
      }
    },
    {
      id: 4,
      name: 'Oxford University',
      city: 'Oxford',
      state: 'Oxfordshire',
      category: 'deemed',
      address: 'University Offices, Wellington Square, Oxford OX1 2JD, UK',
      rating: 4.8,
      established: 1096,
      courses: ['Humanities', 'Law', 'Medicine', 'Sciences', 'Social Sciences'],
      description: 'The University of Oxford is the oldest university in the English-speaking world and the second-oldest university in continuous operation. It grew rapidly from 1167 when Henry II banned English students from attending the University of Paris.',
      imageUrl: 'https://images.pexels.com/photos/10021479/pexels-photo-10021479.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '+44 1865 270000',
        email: 'admissions@ox.ac.uk',
        website: 'ox.ac.uk'
      },
      active: true,
      location: {
        latitude: 51.7548,
        longitude: -1.2544
      },
      performance: {
        placements: 94,
        research: 96,
        infrastructure: 93,
        teaching: 95
      }
    },
    {
      id: 5,
      name: 'UC Berkeley',
      city: 'Berkeley',
      state: 'California',
      category: 'affiliated',
      address: 'Berkeley, CA 94720',
      rating: 4.7,
      established: 1868,
      courses: ['Computer Science', 'Engineering', 'Business', 'Natural Sciences', 'Social Sciences'],
      description: 'The University of California, Berkeley is a public land-grant research university in Berkeley, California. Established in 1868, it is the flagship campus of the University of California system and one of the most selective universities in the United States.',
      imageUrl: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '(510) 642-6000',
        email: 'admissions@berkeley.edu',
        website: 'berkeley.edu'
      },
      active: true,
      location: {
        latitude: 37.8719,
        longitude: -122.2585
      },
      performance: {
        placements: 92,
        research: 94,
        infrastructure: 90,
        teaching: 93
      }
    },
    {
      id: 6,
      name: 'Princeton University',
      city: 'Princeton',
      state: 'New Jersey',
      category: 'autonomous',
      address: 'Princeton, NJ 08544',
      rating: 4.8,
      established: 1746,
      courses: ['Humanities', 'Social Sciences', 'Natural Sciences', 'Engineering', 'Public Affairs'],
      description: 'Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746, it is one of the oldest institutions of higher education in the United States and one of the nine colonial colleges chartered before the American Revolution.',
      imageUrl: 'https://images.pexels.com/photos/1619308/pexels-photo-1619308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      contact: {
        phone: '(609) 258-3000',
        email: 'admission@princeton.edu',
        website: 'princeton.edu'
      },
      active: true,
      location: {
        latitude: 40.3431,
        longitude: -74.6551
      },
      performance: {
        placements: 95,
        research: 93,
        infrastructure: 94,
        teaching: 96
      }
    }
  ];

  constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder
  ) { }

  getCollegesMock(params?: CollegeSearchParams): Observable<College[]> {
    // For now, use mock data
    return this.getMockColleges(params);
  }

  getCollegesV1(params?: CollegeSearchParams): Observable<College[]> {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`search/colleges`);
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<College[]>(endpoint, { params: httpParams });
    
    // For now, use mock data
    //return this.getMockColleges(params);
  }

  getColleges(params?: CollegeSearchParams): Observable<CollegeSearchResponse<CollegeModel>>  {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`search/colleges`);
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<CollegeSearchResponse<CollegeModel>>(endpoint, { params: httpParams });
    
    // For now, use mock data
    //return this.getMockColleges(params);
  }


  searchColleges(params?: CollegeSearchParams): Observable<CollegeSearchResponse<CollegeModel>> {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`search/colleges`);
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<CollegeSearchResponse<CollegeModel>>(endpoint, { params: httpParams });
    
    // For now, use mock data
    //return this.getMockColleges(params);
  }

  searchCollegex(params?: CollegeSearchParams): Observable<CollegeSearchResponse<CollegeModel>> {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`search/collegex`);
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<CollegeSearchResponse<CollegeModel>>(endpoint, { params: httpParams }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Service error:', error);
        return throwError(() => new Error(error.message));
      })
    );
    // For now, use mock data
    //return this.getMockColleges(params);
  }

  getCollegesByCategorySections(categorySectionIds: string[]): Observable<CollegesByCategoryResponse> {
    // Create HTTP params
    let params = new HttpParams();
    const endpoint = this.apiUrlBuilder.buildApiUrl(`colleges/by-category`);
    if (categorySectionIds && categorySectionIds.length) {
      // Join array into comma-separated string for the API
      params = params.set('category_section_ids', categorySectionIds.join(','));
    }

    return this.http.get<CollegesByCategoryResponse>(`${endpoint}`,  { params });
  }

  getCollegeByIdV1(id: number): Observable<College | undefined> {
    // When API is available, use this code:
    // return this.http.get<College>(`${this.apiUrl}/${id}`);
    
    // For now, use mock data
    return of(this.mockColleges.find(college => college.id === id)).pipe(delay(300));
  }
  getCollegeById(id: string): Observable<CollegeModel | undefined> {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`colleges/${id}`);
    return this.http.get<CollegeModel>(endpoint);
    
    
  }

  createCollege(college: Omit<College, 'id'>): Observable<College> {
    // When API is available, use this code:
    // return this.http.post<College>(this.apiUrl, college);
    
    // For now, use mock data
    return of({
      ...college,
      id: this.mockColleges.length + 1
    }).pipe(delay(500));
  }

  updateCollege(id: string, college: Partial<CollegeModel>): Observable<CollegeModel> {
    // When API is available, use this code:
    const endpoint = this.apiUrlBuilder.buildApiUrl(`colleges/${id}`);
    return this.http.put<CollegeModel>(endpoint, college);
    
    // For now, use mock data
    // return of({
    //   ...this.mockColleges.find(c => c.id === id)!,
    //   ...college,
    //   id
    // }).pipe(delay(500));
  }

  deleteCollege(id: string): Observable<void> {
    // When API is available, use this code:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // For now, use mock data
    return of(void 0).pipe(delay(500));
  }


  saveRecentCollege(userId: string, createRecentCollegeDto: RecentCollege): Observable<any> {

    const endpoint = this.apiUrlBuilder.buildApiUrl(`recent-colleges`);
    return this.http.post(`${endpoint}`, { userId, ...createRecentCollegeDto }).pipe(
      tap(response => {
        console.log('Recent college saved:', response);
        const updated = this.recentCollegesSubject.value;
        this.recentCollegesSubject.next(updated);
      }),
      catchError(this.handleError)
    );
  }

  getRecentColleges(userId: string, limit: number, page: number): Observable<any> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`recent-colleges`);
    return this.http.get(`${endpoint}`, { params: { userId, limit, page } }).pipe(
      catchError(this.handleError)
    );
  }

  getSuggestions(userId: string, limit: number): Observable<any> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`recent-colleges/suggestions`);
    return this.http.get(`${endpoint}/suggestions`, { params: { userId, limit } }).pipe(
      catchError(this.handleError)
    );
  }


  // Get all courses
  getStates(): Observable<State[]> {
    const apiUrl = this.apiUrlBuilder.buildApiUrl('colleges/states');
    return this.http.get<State[]>(apiUrl);
  }

  // Get all courses
  getDistricts(): Observable<District[]> {
    const apiUrl = this.apiUrlBuilder.buildApiUrl('colleges/districts');
    return this.http.get<District[]>(apiUrl);
  }

    // Get all courses
  getCountries(): Observable<Country[]> {
    const apiUrl = this.apiUrlBuilder.buildApiUrl('colleges/countries');
    return this.http.get<Country[]>(apiUrl);
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error instanceof Object) {
      // Server-side error
      errorMessage = error.error.message || 'An error occurred';
    } else {
      // Other errors
      errorMessage = `Error Code: ${error.status},  Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getMockColleges(params?: CollegeSearchParams): Observable<College[]> {
    return of(this.mockColleges).pipe(
      map((colleges: any[]) => {
        if (!params) return colleges;

        return colleges.filter(college => {
          let matches = true;
          
          if (params.keyword && !college.name.toLowerCase().includes(params.keyword.toLowerCase())) {
            matches = false;
          }
          
          if (params.city && college.city.toLowerCase() !== params.city.toLowerCase()) {
            matches = false;
          }
          
          if (params.state && college.state.toLowerCase() !== params.state.toLowerCase()) {
            matches = false;
          }
          
          if (params.category && college.category !== params.category) {
            matches = false;
          }
          
          if (params.course) {
            const hasCourse = college.courses.some(
              (course: string) => course.toLowerCase().includes(params.course!.toLowerCase())
            );
            if (!hasCourse) matches = false;
          }
          
          return matches;
        });
      }),
      delay(300) // Simulate network delay
    );
  }
}
