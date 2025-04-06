import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './nav-bar/home/home.component';
import { SignInPageComponent } from './auth/sign-in-page/sign-in-page.component';
import { SignInFormComponent } from './register/sign-in-form/sign-in-form.component';
import { RoleSelectionComponent } from './register/role-selection/role-selection.component';
import { SignInFormCoachComponent } from './register/sign-in-form-coach/sign-in-form-coach.component';
import { SignInFormMedicalOfficerComponent } from './register/sign-in-form-medical-officer/sign-in-form-medical-officer.component';
import { SignInFromStadiumOwnerComponent } from './register/sign-in-from-stadium-owner/sign-in-from-stadium-owner.component';
import { SignInFormCommonComponent } from './register/sign-in-form-common/sign-in-form-common.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'sign-in', component: SignInPageComponent},
    { path: 'signin', component:SignInPageComponent},
    { path: 'signup', component:RoleSelectionComponent},
    { path: 'sign-in-form-common', component: SignInFormCommonComponent },
    { path: 'sign-in-form', component: SignInFormComponent },
    { path: 'sign-in-form-coach', component: SignInFormCoachComponent },
    { path: 'sign-in-form-stadium-owner', component: SignInFromStadiumOwnerComponent },
    { path: 'sign-in-form-medical-officer', component: SignInFormMedicalOfficerComponent },
    { path: '**', redirectTo: '' } 
];
