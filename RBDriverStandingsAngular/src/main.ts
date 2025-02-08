import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { StandingsComponent } from './app/components/standings-component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(StandingsComponent, {
  ...appConfig,      
  providers: [
    ...(appConfig.providers || []),  
    provideHttpClient()              
  ]
})
.catch((err) => console.error(err));