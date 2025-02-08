import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StandingsComponent } from './components/standings-component';

@Component({
  selector: 'app-root',
  imports: [StandingsComponent],
  template: `<app-standings></app-standings>`,
  standalone: true
})
export class AppComponent {
  title = 'RBDriverStandingsAngular';
}
