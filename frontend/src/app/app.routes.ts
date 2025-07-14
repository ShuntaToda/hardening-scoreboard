import { Routes } from '@angular/router';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: ScoreboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
