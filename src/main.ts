import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

// Update the appConfig with HttpClient provider
const updatedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient()
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));