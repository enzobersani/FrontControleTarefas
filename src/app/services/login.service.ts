import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, LoginResponse } from '../models/login-request.model';
import { TokenDecodeModel } from '../models/tokenDecode.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:44387/api/auth'

  constructor(private http: HttpClient,
              private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<LoginResponse>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('token', response.token);
      })
    )
  }

  logout(): void{
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(): TokenDecodeModel | null {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;
        const collaboratorId = decodedToken.collaboratorId;
        return { userId, collaboratorId };
      } catch (error) {
        this.redirectToLogin();
        return null;
      }
    } else {
      this.redirectToLogin();
      return null;
    }
  }

  private redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
