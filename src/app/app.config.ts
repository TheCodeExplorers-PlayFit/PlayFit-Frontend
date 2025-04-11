import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Import your routes

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)], // Provide the router with your routes configuration
};