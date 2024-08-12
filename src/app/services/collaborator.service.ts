import { Injectable } from '@angular/core';
import { CollaboratorRequest, SearchCollaboratorResponseModel } from '../models/collaborator.model';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  private apiUrl = 'https://localhost:44387/api/collaborator'
  
  constructor(private http: HttpClient) { }

  buscarColaborador(request: CollaboratorRequest): Observable<SearchCollaboratorResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = `${this.apiUrl}?page=${request.page}&pageSize=${request.pageSize}`;

    return this.http.get<SearchCollaboratorResponseModel>(url, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}