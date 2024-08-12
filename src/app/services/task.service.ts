import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { InsertTask, SearchTaskResponseModel, TaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:44387/api/task'
  
  constructor(private http: HttpClient) { }

  buscarTarefas(request: TaskRequest): Observable<SearchTaskResponseModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    let params = new HttpParams();

    if (request.id)
      params = params.set('id', request.id);

    if (request.name) {
      params = params.set('name', request.name);
    }

    if (request.projectId) {
      params = params.set('projectId', request.projectId);
    }

    if (request.collaboratorId) {
      params = params.set('collaboratorId', request.collaboratorId);
    }

    return this.http.get<SearchTaskResponseModel>(this.apiUrl, { headers, params }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Erro ai buscar tarefas.'))
      })
    );
  }

  adicionarTarefa(request: InsertTask): Observable<string>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<string>(`${this.apiUrl}`, request, { headers }).pipe(
      catchError((error) => {
        throw error;
      })
    )
  }

  atualizarTarefa(request: InsertTask): Observable<string>{
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

  deleteTask(taskId: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, { headers });
  }
}
