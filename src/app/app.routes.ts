import { Routes } from '@angular/router';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { ScheduleSelectorComponent } from './schedule-selector/schedule-selector.component';
import { StadiumListComponent } from './stadium-list/stadium-list.component';
import { StadiumDetailComponent } from './stadium-detail/stadium-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivateRequestsComponent } from './private-requests/private-requests.component';
import { ComplaintsComponent } from './complaints/complaints.component';

export const routes: Routes = [
    { path: 'booking-history', component: BookingHistoryComponent },
    { path: 'schedule-selector', component: ScheduleSelectorComponent },
    { path: 'stadium-list', component: StadiumListComponent },
    { path: 'stadium-detail', component: StadiumDetailComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'private-playing-requests', component: PrivateRequestsComponent },
    { path: 'complaints', component: ComplaintsComponent },



];


