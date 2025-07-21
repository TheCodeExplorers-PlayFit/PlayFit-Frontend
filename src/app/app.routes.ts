import { Routes } from '@angular/router';

// ===== PLAYER =====
import { PlayerDashboardComponent } from './player/player-dashboard/player-dashboard.component';
import { PlayerLayoutComponent } from './player/player-layout/player-layout.component';
import { StadiumTimetableComponent } from './player/stadium-timetable/stadium-timetable.component';
import { PlayerTransactionsComponent } from './player/player-transactions/player-transactions.component';
import { PlayerBookingHistoryComponent } from './player/player-booking-history/player-booking-history.component';
import { PlayerTimetableComponent } from './player/player-timetable/player-timetable.component';
import { PlayerComplaintsComponent } from './player/player-complaints/player-complaints.component';
import { PlayerAnnouncementsComponent } from './player/player-announcements/player-announcements.component';
import { PlayerHealthComponent } from './player/player-health/player-health.component';
import { SpecialOffersComponent } from './player/special-offers/special-offers.component';
import { PlayerPrivateSessionsComponent } from './player/player-private-sessions/player-private-sessions.component';

// ===== STADIUM OWNER =====
import { DashboardComponent as StadiumOwnerDashboardComponent } from './stadium-owner/dashboard/dashboard.component';
import { StadiumOwnerLayoutComponent } from './stadium-owner/stadium-owner-layout/stadium-owner-layout.component';
import { AddStadiumComponent } from './stadium-owner/add-stadium/add-stadium.component';
import { StadiumsComponent } from './stadium-owner/stadiums/stadiums.component';
import { AchievementsComponent } from './stadium-owner/achievements/achievements.component';
import { MaintenanceRequestsComponent } from './stadium-owner/maintenance-requests/maintenance-requests.component';
import { BlogsComponent as StadiumOwnerBlogsComponent} from './stadium-owner/blogs/blogs.component';
import { PlayerPackagesComponent } from './stadium-owner/player-packages/player-packages.component';
import { WaitlistComponent } from './stadium-owner/waitlist/waitlist.component';

// ===== COACH =====
import { BookingHistoryComponent } from './coach/booking-history/booking-history.component';
import { StadiumListComponent } from './coach/stadium-list/stadium-list.component';
import { DashboardComponent as CoachDashboardComponent } from './coach/dashboard/dashboard.component';
import { CoachPrivateSessionsComponent } from './coach/coach-private-sessions/coach-private-sessions.component';
import { CoachComplaintsComponent } from './coach/CoachComplaints/CoachComplaints.component';
import { CoachLayoutComponent } from './coach/coach-layout/coach-layout.component';
import { CoachStadiumtimetableComponent } from './coach/coach-stadium-timetable/coach-stadium-timetable.component';
import { SalaryDetailsComponent } from './coach/salary-details/salary-details.component';
import {SessionDetailsComponent} from './coach/session-details/session-details.component';
import { CoachBlogPostComponent } from './coach/coach-blog-post/coach-blog-post.component';
import { CoachAnnouncementComponent } from './coach/CoachAnnouncements/coach-announcement.component';
import { CoachAchievementsComponent } from './coach/CoachAchievements/coach-achievements/coach-achievements.component';


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
import { HealthOfficerLayoutComponent } from './healthOfficer/health-officer-layout/health-officer-layout.component';
import { SafetyAdviceReadmoreComponent } from './healthOfficer/sidebar/safety-advise-readmore/safety-advise-readmore/safety-advise-readmore.component';     

// ===== AUTH + COMMON =====
import { HomeComponent } from './nav-bar/home/home.component';
import { AboutComponent } from './nav-bar/about/about.component';
import { SignInPageComponent } from './auth/sign-in-page/sign-in-page.component';
import { SignInFormComponent } from './register/sign-in-form/sign-in-form.component';
import { RoleSelectionComponent } from './register/role-selection/role-selection.component';
import { SignInFormCoachComponent } from './register/sign-in-form-coach/sign-in-form-coach.component';
import { SignInFormMedicalOfficerComponent } from './register/sign-in-form-medical-officer/sign-in-form-medical-officer.component';
import { SignInFromStadiumOwnerComponent } from './register/sign-in-from-stadium-owner/sign-in-from-stadium-owner.component';
import { SignInFormCommonComponent } from './register/sign-in-form-common/sign-in-form-common.component';
import { BlogsDisplayComponent } from './common/blogs/blogs.component';
import { EmailVerificationComponent } from './register/email-verification/email-verification.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password/forgot-password.component';
import { ResetVerificationComponent } from './auth/reset-verification/reset-verification/reset-verification.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password/reset-password.component';
import { RatingsComponent } from './common/ratings/ratings.component';
import { ProfileComponent } from './common/profile/profile.component';

// ===== ADMIN =====
import { AdminDashboardComponent } from './Admin/sidebar/admindashboard/admindashboard.component';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { AnalyticsComponent } from './Admin/sidebar/analytics/analytics.component';
import { UserManagementComponent } from './Admin/sidebar/user-management/user-management.component';
import { ApprovalsComponent } from './Admin/sidebar/approvals/approvals.component';
import { BlogsComponent as adminblogscomponent } from './Admin/sidebar/blogs/blogs.component';
import { SpecialNoticesComponent } from './Admin/sidebar/special-notices/special-notices.component';
import { CalendarComponent } from './Admin/sidebar/calender/calender.component';
import { ReportsComponent } from './Admin/sidebar/reports/reports.component';
import { SystemMaintainCreateComponent } from './Admin/sidebar/system-maintain-create/system-maintain-create.component';

//import { FeedbackComponent } from './Admin/sidebar/feedback/feedback.component';
import { StadiumRatingsForCoachComponent } from './coach/stadiumRatings/stadium-ratings/stadium-ratings.component';

import { AdminRatingsComponent } from './Admin/sidebar/admin-ratings/admin-ratings.component';
import { AdminComplaintsComponent } from './Admin/sidebar/admin-complaints/admin-complaints.component';

export const routes: Routes = [
  // ===== COMMON ROUTES =====
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInPageComponent },
  { path: 'signin', component: SignInPageComponent },
  { path: 'signup', component: RoleSelectionComponent },
  { path: 'sign-in-form-common', component: SignInFormCommonComponent },
  { path: 'email-verification', component: EmailVerificationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-verification', component: ResetVerificationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'sign-in-form', component: SignInFormComponent },
  { path: 'sign-in-form-coach', component: SignInFormCoachComponent },
  { path: 'sign-in-form-stadium-owner', component: SignInFromStadiumOwnerComponent },
  { path: 'sign-in-form-medical-officer', component: SignInFormMedicalOfficerComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blogs', component: BlogsDisplayComponent },
  // ===== ADMIN ROUTES =====
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'approvals', component: ApprovalsComponent },
      { path: 'blogs', component: adminblogscomponent },
      { path: 'special-notices', component: SpecialNoticesComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'system-maintenance', component: SystemMaintainCreateComponent },
      { path: 'admin-ratings', component: AdminRatingsComponent },
      { path: 'settings', component: AdmindashboardComponent },
      //{ path: 'feedback', component: FeedbackComponent },
      { path: 'handle-complaints', component: AdminComplaintsComponent },
    ]
  },

  // ===== PLAYER ROUTES =====
  {
    path: 'player',
    component: PlayerLayoutComponent,
    children: [
      { path: 'dashboard', component: PlayerDashboardComponent },
      { path: 'stadium-timetable/:stadiumId', component: StadiumTimetableComponent },
      { path: 'transactions', component: PlayerTransactionsComponent },
      { path: 'booking-history', component: PlayerBookingHistoryComponent },
      { path: 'my-timetable', component: PlayerTimetableComponent },
      { path: 'complaints', component: PlayerComplaintsComponent },
      { path: 'announcements', component: PlayerAnnouncementsComponent},
      { path: 'ratings', component:RatingsComponent},
      { path: 'profile', component: ProfileComponent},
      { path: 'Player-Health', component: PlayerHealthComponent},
      { path: 'special-offers', component: SpecialOffersComponent },
      { path: 'private-playing', component: PlayerPrivateSessionsComponent}
    ]
  },

  // ===== COACH ROUTES =====
  {
    path: 'coach',
    component: CoachLayoutComponent,
    children: [
      { path: 'view-session-details',component: SessionDetailsComponent},
      { path: 'dashboard', component: CoachDashboardComponent },
      { path: 'booking-history', component: BookingHistoryComponent },
      { path: 'stadium-list', component: StadiumListComponent },
      { path: 'private-playing-requests', component: CoachPrivateSessionsComponent },
      { path: 'complaints', component: CoachComplaintsComponent },
      { path: 'coach-stadium-timetable/:id', component: CoachStadiumtimetableComponent },
      { path: 'salary-details', component: SalaryDetailsComponent },
      { path: 'coach-blog-post', component: CoachBlogPostComponent },
      { path: 'blogs', component: BlogsDisplayComponent },
      { path: 'coach-announcement', component: CoachAnnouncementComponent},
      {path: 'stadium-ratings', component:StadiumRatingsForCoachComponent}, 
      {path: 'coach-achievements', component: CoachAchievementsComponent},

    ]
  },

  // ===== STADIUM OWNER ROUTES =====
  {
    path: 'stadium-owner',
    component: StadiumOwnerLayoutComponent,
    children: [
      { path: 'dashboard', component: StadiumOwnerDashboardComponent },
      { path: 'stadiums', component: StadiumsComponent },
      { path: 'add-stadium', component: AddStadiumComponent },
      { path: 'blogs', component:BlogsComponent},
      { path: 'achievements', component: AchievementsComponent },
      { path: 'maintenance-requests', component: MaintenanceRequestsComponent },
      { path: 'player-packages', component: PlayerPackagesComponent },
      { path: 'waitlist', component: WaitlistComponent },
    ]
  },

  // ===== HEALTH OFFICER ROUTES =====
  {
    path: 'health',
    component: HealthOfficerLayoutComponent,
    children: [
      { path: 'dashboard', component: HealthOfficerDashboardComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'record-injuries/:id', component: RecordInjuriesComponent },
      { path: 'players-health-records', component: PlayersHealthRecordsComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'safety-advice', component: SafetyAdviceComponent },
      { path: 'safety-advice-create', component: SafetyAdviceCreateComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'signout', component: SignOutComponent },
      { path: 'safety-advice-form/:id', component: SafetyAdviceCreateComponent },
      { path: 'safety-advise-readmore/:id', component: SafetyAdviceReadmoreComponent }

    ]
  },

  // ===== FALLBACK =====
  { path: '**', redirectTo: '' }
];