import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PoButtonModule, PoComboOption, PoComboOptionGroup, PoFieldModule, PoInfoModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageModule, PoSelectOption, PoWidgetModule } from '@po-ui/ng-components';
import { ProjectAtualizar, ProjectResultModel } from '../../models/projetos-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CollaboratorResultModel, SearchCollaboratorResponseModel } from '../../models/collaborator.model';
import { CollaboratorService } from '../../services/collaborator.service';
import { TaskService } from '../../services/task.service';
import { InsertTask, SearchTaskResponseModel, TaskRequest, TaskResultModel } from '../../models/task.model';
import { catchError, of, tap } from 'rxjs';
import { TaskComponent } from "../task/task.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    PoPageModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoModalModule,
    FormsModule,
    CommonModule,
    PoInfoModule,
    TaskComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{

  //#region variables
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('modalAtualizaocao', { static: true }) modalAtualizaocao!: PoModalComponent;
  @ViewChild('optionsForm', { static: true }) form!: NgForm;
  project: ProjectResultModel | undefined;
  collaborator!: string;
  medicalSpecialtyOptions!: Array<any>;
  showFilter: boolean = false;
  filterName: string = '';
  isAssignedToMe: boolean = true;
  description: string = '';
  name: string = '';
  collaborators: CollaboratorResultModel[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 100;
  collaboratorOptions: Array<PoSelectOption> = [];
  selectedCollaboratorId!: string | undefined;
  options!: Array<PoComboOption>;
  combo!: string | undefined;
  tasks: TaskResultModel[] | undefined = []
  taskRequest: TaskRequest = {};
  insertTask: InsertTask = {}
  projectAtualizar: ProjectAtualizar = {}

  selectedTask!: TaskResultModel;
  @ViewChild('taskModal', { static: true }) taskModal!: TaskComponent;
  //#endregion

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private poNotification: PoNotificationService,
              private collaboratorService: CollaboratorService,
              private taskService: TaskService
              )
  {}
  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
      this.loadColaborattor();
    }
  }

  loadProject(id: string): void{
    this.projectService.buscarProjetoPorId(id).subscribe(
      (response: ProjectResultModel) => {
        this.project = response;
        this.taskRequest.projectId = id;
        this.loadTask(this.taskRequest);
      },
      (error) => {
        this.poNotification.warning('Erro ao buscar projetos.');
      }
    )
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  applyFilter(): void {
    if(this.filterName)
      this.taskRequest.name = this.filterName;
    if(this.selectedCollaboratorId)
      this.taskRequest.collaboratorId = this.selectedCollaboratorId;
    
    this.loadTask(this.taskRequest);
    this.taskRequest.name = '';
    this.taskRequest.collaboratorId = ''
  }

  confirmarAtualizacao(){
    if(this.name == ""){
      this.poNotification.warning("Tarefa deve ter um nome.");
      return
    }

    this.projectAtualizar.id = this.project?.id
    this.projectAtualizar.name = this.name;

    this.projectService.atualizarProjeto(this.projectAtualizar).pipe(
      tap((response) => {
        this.poNotification.success("Tarefa atualizada com sucesso!");
        this.restore();
        if(this.project?.id)
          this.loadProject(this.project?.id);
      }),
      catchError((error) => {
        if(error.status === 400)
          this.poNotification.warning(error.error.message);
        else
          this.poNotification.error("Erro interno ao realizar atualização! Informe ao suporte!")
        return of(null);
      })
    ).subscribe();
  }

  confirmar(){
    if(this.name == ""){
      this.poNotification.warning("Tarefa deve ter um nome.");
      return
    }

    this.insertTask.name = this.name;
    this.insertTask.description = this.description;
    this.insertTask.collaboratorId = this.selectedCollaboratorId;
    this.insertTask.projectId = this.project?.id;

    this.taskService.adicionarTarefa(this.insertTask).pipe(
      tap((response) => {
        this.restore();
        this.poNotification.success("Tarefa criada com sucesso!");
        this.loadTask(this.taskRequest);
      }),
      catchError((error) => {
        if(error.status === 400)
          this.poNotification.warning(error.error.message);
        else
          this.poNotification.error("Erro interno ao realizar cadastro! Informe ao suporte!")
        return of(null);
      })
    ).subscribe();
  }
  
  abrirModal(){
    this.poModal.open();
    this.form.reset();
    this.loadColaborattor();
  }

  voltar() {
    this.router.navigate(['/']);
  }

  fechar(){
    this.poModal.close();
  }

  restore(){
    this.form.reset();
  }

  loadColaborattor(): void{
    const request = {
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.collaboratorService.buscarColaborador(request).subscribe(
      (response: SearchCollaboratorResponseModel) => {
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.collaboratorOptions = (response.items || []).map(collaborator => ({
          label: collaborator.name,
          value: collaborator.id
        }));
        this.options = this.collaboratorOptions;
      },
      (error) => {
        this.poNotification.warning('Erro ao buscar colaboradores.');
      }
    )
  };

  onCollaboratorChange(event: any) {
    this.selectedCollaboratorId = event;
  }

  loadTask(request: TaskRequest): void{
    this.taskService.buscarTarefas(request).subscribe(
      (response: SearchTaskResponseModel) => {
         this.tasks = response.items;
      },
      (error) => {
        this.poNotification.warning('Erro ao buscar projetos.');
      }
    )
  }

  openTask(task: TaskResultModel){
    this.router.navigate(['/project', task.projectId, 'task', task.id]);
  }

  deleteProject() {
    if (this.project) {
      if (confirm('Tem certeza de que deseja excluir este projeto?')) {
        this.projectService.deleteProject(this.project.id).subscribe(
          () => {
            this.poNotification.success('Projeto excluído com sucesso.');
            this.router.navigate(['/']);
          },
          (error: any) => {
            this.poNotification.warning('Erro ao excluir projeto.');
          }
        );
      }
    }
  };
}
