import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoContainerModule, PoFieldModule, PoModalModule, PoPageModule, PoWidgetModule } from '@po-ui/ng-components';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TokenDecodeModel } from '../../models/tokenDecode.model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-full-task',
  standalone: true,
  imports: [
    PoPageModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoModalModule,
    FormsModule,
    CommonModule,
    PoContainerModule 
  ],
  templateUrl: './full-task.component.html',
  styleUrl: './full-task.component.css'
})
export class FullTaskComponent implements OnInit{
  hoursToday: string = '';
  hoursMonth: string = '';
  collaboratorId: string = '';
  date = new Date().toISOString()

  constructor(private timeTrackerService: TimeTrackerService,
              private loginService: LoginService
  ){}

  ngOnInit(): void {
    this.decodeToken();
    this.buscarHoras(this.collaboratorId);
  }

  buscarHoras(collaboratorId: string): void{
    const userId = collaboratorId;

    this.timeTrackerService.getHours(userId, this.date).subscribe(
      (response) => {
        this.hoursToday = response.hoursToday;
        this.hoursMonth = response.hoursMonth;
      }
    );
  }

  decodeToken() {
    const tokenData: TokenDecodeModel | null = this.loginService.decodeToken();
    if (tokenData) {
      this.collaboratorId = tokenData.collaboratorId;
    }
  }

}
