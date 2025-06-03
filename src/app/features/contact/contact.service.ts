import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { ContactForm } from './contact.model';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder) {}

  submitContactForm(formData: ContactForm): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl('contact');
    return this.http.post(createApi, formData);
  }
}