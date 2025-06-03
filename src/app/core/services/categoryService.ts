import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';

export interface Category {
    label: string;
    value: string;
    icon: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

    categories : Category[] = [
        { 
          label: 'Deemed Universities', 
          value: 'deemed', 
          icon: 'school', 
          description: 'Universities with high educational standards and academic excellence'
        },
        { 
          label: 'Affiliated Colleges', 
          value: 'affiliated', 
          icon: 'account_balance', 
          description: 'Colleges affiliated with established universities'
        },
        { 
          label: 'Autonomous Colleges', 
          value: 'autonomous', 
          icon: 'architecture', 
          description: 'Colleges with the freedom to design their curricula'
        },
        { 
          label: 'Other Institutions', 
          value: 'other', 
          icon: 'business', 
          description: 'Specialized institutions and other educational facilities'
        }
      ];
    constructor(
        private http: HttpClient,
        private apiUrlBuilder: ApiUrlBuilder
    ) { }

    getCategories(): Observable<Category[]> {
        //const url = this.apiUrlBuilder.buildApiUrl('categories');
        //return this.http.get(url);
        return new Observable(observer => {
            observer.next(this.categories);
            observer.complete();
        });
    }

    getCategoryById(id: number): Observable<any> {
        const url = this.apiUrlBuilder.buildApiUrl(`categories/${id}`);
        return this.http.get(url);
    }

    createCategory(category: any): Observable<any> {
        const url = this.apiUrlBuilder.buildApiUrl('categories');
        return this.http.post(url, category);
    }
}