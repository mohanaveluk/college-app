import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../models/search-response.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

    constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder
  ) { }


  // Get all courses
  getAllCourses(): Observable<Course[]> {
    const apiUrl = this.apiUrlBuilder.buildApiUrl('courses');
    return this.http.get<Course[]>(apiUrl);
  }

  // Get single course by ID
  getCourseById(id: string): Observable<Course> {
    const apiUrl = this.apiUrlBuilder.buildApiUrl(`courses`);
    return this.http.get<Course>(`${apiUrl}/${id}`);
  }
}
