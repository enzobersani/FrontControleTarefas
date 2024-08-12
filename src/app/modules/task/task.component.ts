import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PoButtonModule, PoComboOption, PoFieldModule, PoInfoModule, PoLinkModule, PoListViewModule, PoModalComponent, PoModalModule, PoNotification, PoNotificationService, PoPageModule, PoSelectOption, PoWidgetModule } from '@po-ui/ng-components';
import { InsertTask, SearchTaskResponseModel, TaskRequest, TaskResultModel, UpdateTask } from '../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { SearchCollaboratorResponseModel } from '../../models/collaborator.model';
import { catchError, of, tap } from 'rxjs';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { SearchTimeTrackerResponseModel, TimeTrackerRequest } from '../../models/timeTracker.model';
import { NgxMaskService } from 'ngx-mask';
import moment from 'moment-timezone';
import { TokenDecodeModel } from '../../models/tokenDecode.model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-task',
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
    PoListViewModule,
    PoLinkModule
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('optionsForm', { static: true }) form!: NgForm;
  @ViewChild('taskModal', { static: true }) taskModal!: PoModalComponent;
  task: TaskResultModel | undefined;
  taskRequest: TaskRequest = {};
  nameAtualizar: string | undefined = '';
  description: string | undefined = '';
  selectedCollaboratorId!: string | undefined;
  collaboratorOptions: Array<PoSelectOption> = [];
  options!: Array<PoComboOption>;
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 100;
  taskId: string | null = null;
  taskUpdate: UpdateTask = {}
  dataHoras: Date = new Date();
  horaInicial: string = '';
  horaFinal: string = '';
  horaValida!: boolean;
  timeTrackerRequest: TimeTrackerRequest = {}
  collaborators: SearchTimeTrackerResponseModel[] = [];
  timerRunning: boolean = false;
  startTime: Date | null = null;
  endTime: Date | null = null;
  elapsedTime: string = '00:00:00';
  intervalId: any = null;
  collaboratorId: string = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private poNotification: PoNotificationService,
              private collaboratorService: CollaboratorService,
              private timeTrackerService: TimeTrackerService,
              private loginService: LoginService 
            ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
    this.decodeToken();
    if (this.taskId) {
      this.loadTask(this.taskId);
      this.loadTimeTrackers(this.taskId)
    }
  }
  decodeToken() {
    const tokenData: TokenDecodeModel | null = this.loginService.decodeToken();
    if (tokenData) {
      this.collaboratorId = tokenData.collaboratorId;
    }
  }

  loadTask(taskId: string): void {
    this.taskRequest.id = taskId;
    this.taskService.buscarTarefas(this.taskRequest).subscribe(
      (response: SearchTaskResponseModel) => {
        if (response.items && response.items.length > 0) {
          this.task = response.items[0]; 
        } else {
          this.task = undefined; // Ou você pode definir uma mensagem ou valor padrão
        }
      },
      (error: any) => {
        this.poNotification.warning('Erro ao buscar tarefa.');
      }
    );
  }

  loadTimeTrackers(taskId: string): void {
    this.timeTrackerService.getTimeTrackersByTaskId(taskId).subscribe(
      (response: SearchTimeTrackerResponseModel[]) => {
        this.collaborators = response.map(tracker => ({
          ...tracker,
          hours: tracker.hours
        }));
      },
      (error: any) => {
        this.poNotification.warning('Erro ao buscar colaboradores e horas.');
      }
    );
  }

  fechar(){
    this.poModal.close();
  }

  restore(){
    this.form.reset();
  }

  closeTask() {
    this.router.navigate(['/project', this.task?.projectId]);
  }

  confirmar(){
    if(this.nameAtualizar == "" || this.nameAtualizar == null){
      this.poNotification.warning("Tarefa deve ter um nome.");
      return
    }
    this.taskUpdate.name = this.nameAtualizar;
    this.taskUpdate.description = this.description;
    this.taskUpdate.collaboratorId = this.selectedCollaboratorId;
    this.taskUpdate.id = this.taskId;

    this.taskService.atualizarTarefa(this.taskUpdate).pipe(
      tap((response) => {
        this.poNotification.success("Tarefa atualizada com sucesso!");
        if(this.taskId)
          this.loadTask(this.taskId);
      }),
      catchError((error) => {
        if(error.status === 400)
          this.poNotification.warning(error.error.message);
        else
          this.poNotification.error("Erro interno ao realizar atualização!")
        return of(null);
      })
    ).subscribe();
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

  deleteTask() {
    if (this.task) {
      if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
        this.taskService.deleteTask(this.task.id).subscribe(
          () => {
            this.poNotification.success('Tarefa excluída com sucesso.');
            this.router.navigate(['/project', this.task?.projectId]);
          },
          (error: any) => {
            this.poNotification.warning('Erro ao excluir tarefa.');
          }
        );
      }
    }
  };

  updateTask(){
    this.poModal.open();
    this.nameAtualizar = this.task?.name
    this.description = this.task?.description
    this.loadColaborattor();
  };

  validarHora(hora: string): void {
    if(hora){
      const regex = /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/;
      this.horaValida = regex.test(hora);
      if (!this.horaValida) {
        this.poNotification.warning("Horário informado não válido!")
        return
      }
    }
  }

  inserirHoras() {
    if (!this.dataHoras) {
      this.poNotification.warning("Data é obrigatória.");
      return;
    }
  
    if (!this.horaInicial) {
      this.poNotification.warning("Horário inicial é obrigatório.");
      return;
    }
  
    if (!this.horaFinal) {
      this.poNotification.warning("Horário final é obrigatório.");
      return;
    }
  
    const startDate = this.combineDateTime(this.dataHoras, this.horaInicial);
    const endDate = this.combineDateTime(this.dataHoras, this.horaFinal);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      this.poNotification.error("Erro ao criar datas. Verifique o formato da data e hora.");
      return;
    }
  
    this.timeTrackerRequest.startDate = startDate;
    this.timeTrackerRequest.endDate = endDate;
    this.timeTrackerRequest.collaboratorId = this.collaboratorId;
    this.timeTrackerRequest.timeZoneId = moment.tz.guess();
  
    if (this.taskId) {
      this.timeTrackerRequest.taskId = this.taskId;
    } else {
      this.poNotification.error("Erro ao capturar código da tarefa!");
      this.timeTrackerRequest = {};
      return;
    }
  
    this.timeTrackerService.adicionarTimeTracker(this.timeTrackerRequest).pipe(
      tap((response) => {
        this.restore();
        this.poNotification.success("Horário adicionado com sucesso!");
        if (this.taskId) {
          this.loadTimeTrackers(this.taskId);
        }
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

  combineDateTime(date: Date, time: string): Date {
    const timeWithColon = time.length === 4 ? `${time.substring(0, 2)}:${time.substring(2, 4)}` : time;
  
    const [hours, minutes] = timeWithColon.split(':').map(num => parseInt(num, 10));
    const combinedDateTime = new Date(date);
  
    if (isNaN(hours) || isNaN(minutes)) {
      return new Date(NaN);
    }
  
    combinedDateTime.setHours(hours, minutes, 0, 0);
    return combinedDateTime;
  }

  toggleTimer() {
    if (this.timerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  formatElapsedTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  startTimer() {
    this.startTime = new Date();
    this.timerRunning = true;

    this.intervalId = setInterval(() => {
      const now = new Date();
      this.elapsedTime = this.formatElapsedTime(now.getTime() - this.startTime!.getTime());
    }, 1000);

    this.poNotification.success('Cronômetro iniciado.');
  }

  stopTimer() {
    clearInterval(this.intervalId);
    this.endTime = new Date();
    this.timerRunning = false;

    this.sendTimeToAPI();
  }

  sendTimeToAPI() {
    if (!this.startTime || !this.endTime) {
      return;
    }
    this.timeTrackerRequest = {};
    this.timeTrackerRequest.startDate = this.startTime;
    this.timeTrackerRequest.endDate = this.endTime;
    this.timeTrackerRequest.collaboratorId = this.collaboratorId;
    this.timeTrackerRequest.timeZoneId = moment.tz.guess();
    if (this.taskId) {
      this.timeTrackerRequest.taskId = this.taskId;
    } else {
      this.poNotification.error("Erro ao capturar código da tarefa!");
      this.timeTrackerRequest = {};
      return;
    }

    this.timeTrackerService.adicionarTimeTracker(this.timeTrackerRequest).pipe(
      tap((response) => {
        this.poNotification.success('Tempo registrado com sucesso!');
        if (this.taskId) {
          this.loadTimeTrackers(this.taskId);
        }
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
