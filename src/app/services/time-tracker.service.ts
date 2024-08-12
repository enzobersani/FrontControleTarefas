import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HoursResponse, SearchTimeTrackerResponseModel, TimeTrackerRequest } from '../models/timeTracker.model';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  private apiUrl = 'https://localhost:44387/api/timeTracker'; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  getTimeTrackersByTaskId(taskId: string): Observable<SearchTimeTrackerResponseModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<SearchTimeTrackerResponseModel[]>(`${this.apiUrl}/task?taskId=${taskId}`, { headers }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Erro ai buscar tarefas.'))
      })
    );
  }

  adicionarTimeTracker(request: TimeTrackerRequest): Observable<string>{
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

  getHours(userId: string, date: string): Observable<HoursResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<HoursResponse>(`${this.apiUrl}/hours?CollaboratorId=${userId}&Date=${date}`, { headers }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Erro ao buscar horas.'))
      })
    );
  }
}
