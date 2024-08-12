import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { PoPageBlockedUserComponent } from '@po-ui/ng-templates';
import { AuthGuard } from './auth.guard';
import { ProjectComponent } from './modules/project/project.component';
import { TaskComponent } from './modules/task/task.component';
import { FullTaskComponent } from './modules/full-task/full-task.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'project/:id', component: ProjectComponent },
    { path: 'project/:projectId/task/:taskId', component: TaskComponent },
    { path: 'horas', component: FullTaskComponent },
    { path: '**', component: PoPageBlockedUserComponent }
];