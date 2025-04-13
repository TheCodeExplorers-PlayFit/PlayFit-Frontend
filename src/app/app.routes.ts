import { Routes } from '@angular/router';

// ===== PLAYER =====
import { PlayerDashboardComponent } from './player/player-dashboard/player-dashboard.component';

// ===== STADIUM OWNER =====
import { DashboardComponent as StadiumOwnerDashboardComponent } from './stadium-owner/dashboard/dashboard.component';
import { AddStadiumComponent } from './stadium-owner/add-stadium/add-stadium.component';
import { AchievementsComponent } from './stadium-owner/achievements/achievements.component';
import { MaintenanceRequestsComponent } from './stadium-owner/maintenance-requests/maintenance-requests.component';
import { ComplaintsComponent } from './stadium-owner/complaints/complaints.component';

// ===== COACH =====
import { BookingHistoryComponent } from './coach/booking-history/booking-history.component';
import { ScheduleSelectorComponent } from './coach/schedule-selector/schedule-selector.component';
import { StadiumListComponent } from './coach/stadium-list/stadium-list.component';
import { StadiumDetailComponent } from './coach/stadium-detail/stadium-detail.component';
import { DashboardComponent as CoachDashboardComponent } from './coach/dashboard/dashboard.component';
import { PrivateRequestsComponent } from './coach/private-requests/private-requests.component';
import { ComplaintsComponent as CoachComplaintsComponent } from './coach/complaints/complaints.component';

// ===== HEALTH OFFICER =====
import { DashboardComponent as HealthOfficerDashboardComponent } from './healthOfficer/sidebar/dashboard/dashboard.component';
import { AppointmentsComponent } from './healthOfficer/sidebar/appointments/appointments.component';
import { RecordInjuriesComponent } from './healthOfficer/sidebar/record-injuries/record-injuries.component';
import { PlayersHealthRecordsComponent } from './healthOfficer/sidebar/players-health-records/players-health-records.component';
import { BlogsComponent } from './healthOfficer/sidebar/blogs/blogs.component';
import { SafetyAdviceComponent } from './healthOfficer/sidebar/safety-advice/safety-advice.component';
import { SettingsComponent } from './healthOfficer/sidebar/settings/settings.component';
import { SignOutComponent } from './healthOfficer/sidebar/sign-out/sign-out.component';
import { SafetyAdviceCreateComponent } from './healthOfficer/sidebar/safety-advice-create/safety-advice-create.component';


// ===== AUTH + COMMON =====
import { HomeComponent } from './nav-bar/home/home.component';
import { SignInPageComponent } from './auth/sign-in-page/sign-in-page.component';
import { SignInFormComponent } from './register/sign-in-form/sign-in-form.component';
import { RoleSelectionComponent } from './register/role-selection/role-selection.component';
import { SignInFormCoachComponent } from './register/sign-in-form-coach/sign-in-form-coach.component';
import { SignInFormMedicalOfficerComponent } from './register/sign-in-form-medical-officer/sign-in-form-medical-officer.component';
import { SignInFromStadiumOwnerComponent } from './register/sign-in-from-stadium-owner/sign-in-from-stadium-owner.component';
import { SignInFormCommonComponent } from './register/sign-in-form-common/sign-in-form-common.component';

export const routes: Routes = [
  // ===== COMMON ROUTES =====
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInPageComponent },
  { path: 'signin', component: SignInPageComponent },
  { path: 'signup', component: RoleSelectionComponent },
  { path: 'sign-in-form-common', component: SignInFormCommonComponent },
  { path: 'sign-in-form', component: SignInFormComponent },
  { path: 'sign-in-form-coach', component: SignInFormCoachComponent },
  { path: 'sign-in-form-stadium-owner', component: SignInFromStadiumOwnerComponent },
  { path: 'sign-in-form-medical-officer', component: SignInFormMedicalOfficerComponent },

  // ===== PLAYER ROUTES =====
  { path: 'player/dashboard', component: PlayerDashboardComponent },

  // ===== COACH ROUTES =====
  { path: 'coach/booking-history', component: BookingHistoryComponent },
  { path: 'coach/schedule-selector', component: ScheduleSelectorComponent },
  { path: 'coach/stadium-list', component: StadiumListComponent },
  { path: 'coach/stadium-detail', component: StadiumDetailComponent },
  { path: 'coach/dashboard', component: CoachDashboardComponent },
  { path: 'coach/private-playing-requests', component: PrivateRequestsComponent },
  { path: 'coach/complaints', component: CoachComplaintsComponent },

  // ===== STADIUM OWNER ROUTES =====
  { path: 'stadium-owner/dashboard', component: StadiumOwnerDashboardComponent },
  { path: 'stadium-owner/add-stadium', component: AddStadiumComponent },
  { path: 'stadium-owner/complaints', component: ComplaintsComponent },
  { path: 'stadium-owner/achievements', component: AchievementsComponent },
  { path: 'stadium-owner/maintenance-requests', component: MaintenanceRequestsComponent },

  // ===== HEALTH OFFICER ROUTES =====
  { path: 'health/dashboard', component: HealthOfficerDashboardComponent },
  { path: 'health/appointments', component: AppointmentsComponent },
  { path: 'health/record-injuries', component: RecordInjuriesComponent },
  { path: 'health/players-health-records', component: PlayersHealthRecordsComponent },
  { path: 'health/blogs', component: BlogsComponent },
  { path: 'health/safety-advice', component: SafetyAdviceComponent },
  { path: 'health/safety-advice-create', component: SafetyAdviceCreateComponent },
  { path: 'health/settings', component: SettingsComponent },
  { path: 'health/signout', component: SignOutComponent },

  // ===== FALLBACK =====
  { path: '**', redirectTo: '' }
];
