import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Scoreboard</a>
      <a routerLink="/admin">Admin</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      background: #333;
      padding: 0;
      display: flex;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      padding: 15px 20px;
      display: block;
    }
    
    nav a:hover {
      background: #555;
    }
  `]
})
export class App {}
