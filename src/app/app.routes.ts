import { Routes } from '@angular/router';
import { DashboardComponent } from './stadium-owner/dashboard/dashboard.component';
import { AddStadiumComponent } from './stadium-owner/add-stadium/add-stadium.component';
import { AchievementsComponent } from './stadium-owner/achievements/achievements.component';
import { MaintenanceRequestsComponent } from './stadium-owner/maintenance-requests/maintenance-requests.component';
import { ComplaintsComponent } from './stadium-owner/complaints/complaints.component';

export const routes: Routes = [
    {path:"dashboard",component:DashboardComponent},
    {path:"add-stadium",component:AddStadiumComponent},
    {path:"complaints",component:ComplaintsComponent},
    {path:"achievements",component:AchievementsComponent},
    {path:"maintenance-requests",component:MaintenanceRequestsComponent},

];
