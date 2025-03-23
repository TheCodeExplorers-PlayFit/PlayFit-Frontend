import { Routes } from '@angular/router';
import { DashboardComponent } from './healthOfficer/sidebar/dashboard/dashboard.component';
import { AppointmentsComponent } from './healthOfficer/sidebar/appointments/appointments.component';
import { RecordInjuriesComponent } from './healthOfficer/sidebar/record-injuries/record-injuries.component';
import { PlayersHealthRecordsComponent } from './healthOfficer/sidebar/players-health-records/players-health-records.component';
import { BlogsComponent } from './healthOfficer/sidebar/blogs/blogs.component';
import { SafetyAdviceComponent } from './healthOfficer/sidebar/safety-advice/safety-advice.component';
import { SettingsComponent } from './healthOfficer/sidebar/settings/settings.component';
import { SignOutComponent } from './healthOfficer/sidebar/sign-out/sign-out.component';
import { SafetyAdviceCreateComponent } from './healthOfficer/sidebar/safety-advice-create/safety-advice-create.component';
 

export const routes: Routes = [
    {
        path : '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
    },
   {
    path : 'dashboard',
    component : DashboardComponent
   },
   {
    path : 'appointments',
    component : AppointmentsComponent
   },
  {
    path : 'recordInjuries',
    component : RecordInjuriesComponent
  },
  {
    path : 'playersHealthRecords',
    component : PlayersHealthRecordsComponent
  },
  {
    path : 'blogs',
    component : BlogsComponent
  },
  {
    path : 'safetyAdvice',
    component : SafetyAdviceComponent
  },
  {
    path : 'settings',
    component : SettingsComponent
  },
  {
    path : 'signOut',
    component : SignOutComponent
  },
  {
    path : 'safetyAdvice-create',
    component : SafetyAdviceCreateComponent
  } 
];
