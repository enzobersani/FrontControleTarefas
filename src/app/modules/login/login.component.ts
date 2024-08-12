import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';
import { LoginRequest } from '../../models/login-request.model';
import { PoNotificationService } from '@po-ui/ng-components';
import { catchError, of, tap } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PoPageLoginModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: LoginRequest = {
    userName: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private router: Router,
              private loginService: LoginService,
              private poNotification: PoNotificationService){}

  onLogin(event: PoPageLogin): void{
    this.credentials.userName = event.login;
    this.credentials.password = event.password;

    this.loginService.login(this.credentials).pipe(
      tap((response) => {
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        if (error.status === 400 && error.error.notifications) {
          const errorMessage = error.error.notifications.map((notification: { message: any; }) => notification.message).join(', ');
          this.poNotification.warning(errorMessage);
        } else {
          this.poNotification.error("Erro interno ao adicionar horário! Informe ao suporte!");
        }
        return of(null);
      })
    ).subscribe();
  }
}