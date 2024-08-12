import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router, RouterOutlet } from '@angular/router';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', link: '/', icon: 'po-icon-home', shortLabel: 'Home' },
    { label: 'Horas gastas', link: 'horas', icon: 'po-icon po-icon-clock', shortLabel: 'Horas' }
  ];

  isLogin : boolean = false;

  constructor(private router: Router,
              private location : Location
  ){}

  ngOnInit(): void {
    this.router.events.subscribe(async (ev) => {
      if (ev instanceof NavigationEnd) {
        if(this.isLogin = this.location.path() === '/login')
          this.isLogin = false;
        else
          this.isLogin = true;
      }
    });
  }
}
