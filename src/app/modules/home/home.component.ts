import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoFieldModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageModule, PoWidgetModule } from '@po-ui/ng-components';
import { ProjectService } from '../../services/project.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { ProjectResultModel, ProjetoRequest, SearchProjectResponseModel } from '../../models/projetos-request.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PoPageModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoModalModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;


  name: string = '';
  inputNameProjeto: string = '';

  projects: ProjectResultModel[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 100;


  constructor(private poNotification: PoNotificationService,
              private projectService: ProjectService,
              private router: Router
  ){}
  
  ngOnInit(): void {
    this.loadProjects();
  }

  abrirProjeto(project: ProjectResultModel){
    this.router.navigate(['/project', project.id])
  }

  fechar(){
    this.name = '';
    this.poModal.close();
  }

  confirmar(){
    if(this.name.trim() == ''){
      this.poNotification.warning('É necessário informar um nome para o projeto!');
      return;
    }

    this.projectService.adicionarProjeto(this.name).pipe(
      tap((response) => {
        this.name = '';
        this.inputNameProjeto = '';
        this.loadProjects();
        this.poNotification.success("Projeto adicionado com sucesso!")
      }),
      catchError((error) => {
        if(error.status === 400)
          this.poNotification.warning(error.error.message);
        else if(error.status === 401)
          this.poNotification.error("Usuário não autorizado!")
        else
          this.poNotification.error("Erro interno ao realizar cadastro! Informe ao suporte!")
        return of(null);
      })
    ).subscribe();
  }


  loadProjects(): void{
    const request = {
      page: this.currentPage,
      pageSize: this.pageSize,
      name: this.inputNameProjeto
    };

    this.projectService.buscarProjetos(request).subscribe(
      (response: SearchProjectResponseModel) => {
        this.projects = response.items || [];
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.poNotification.warning('Erro ao buscar projetos.');
      }
    )
  };

  onSearch(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProjects();
  }
}
