import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProjectAtualizar, ProjectResultModel, ProjetoRequest, SearchProjectResponseModel } from '../models/projetos-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:44387/api/project'

  constructor(private http: HttpClient) { }

  adicionarProjeto(name: string): Observable<string>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = { name }

    return this.http.post<string>(`${this.apiUrl}`, body, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    )
  }

  atualizarProjeto(request: ProjectAtualizar): Observable<string>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<string>(`${this.apiUrl}`, request, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    )
  }

  buscarProjetos(request: ProjetoRequest): Observable<SearchProjectResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let url = `${this.apiUrl}?page=${request.page}&pageSize=${request.pageSize}`;

    if (request.name) {
      url += `&name=${encodeURIComponent(request.name)}`;
    }

    return this.http.get<SearchProjectResponseModel>(url, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  buscarProjetoPorId(id: string): Observable<ProjectResultModel>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProjectResultModel>(`${this.apiUrl}/id?Id=${id}`, { headers }).pipe(
      catchError((error) => {
        throw error;
      }) 
    );
  }

  deleteProject(projectId: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${projectId}`, { headers });
  }
}
