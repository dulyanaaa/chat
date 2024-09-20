import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './superadmin/users/users.component';
import { GroupsComponent } from './superadmin/groups/groups.component';
import { ChannelsComponent } from './superadmin/channels/channels.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfigComponent } from './config/config.component';
import { LayoutComponent } from './superadmin/layout/layout.component';
import { LogoutComponent } from './auth/logout/logout.component';

import { LayoutComponent as AdminLayout } from './admin/layout/layout.component';
import { GroupsComponent as AdminGroup } from './admin/groups/groups.component';
import { ChannelsComponent as AdminChannel } from './admin/channels/channels.component';

import { LayoutComponent as UserLayout } from './user/layout/layout.component';
import { ChatComponent } from './user/chat/chat.component';
import { GroupsComponent as UserGroups } from './user/groups/groups.component';
import { InterestsComponent } from './admin/interests/interests.component';

export const routes: Routes = [
  { path: 'config', component: ConfigComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'superadmin',
    component: LayoutComponent,
    children: [
      { path: '', component: UsersComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'channels', component: ChannelsComponent },
    ],
  },
  {
    path: 'groupadmin',
    component: AdminLayout,
    children: [
      { path: '', component: AdminGroup },
      { path: 'groups', component: AdminGroup },
      { path: 'channels', component: AdminChannel },
      { path: 'interests', component: InterestsComponent },
    ],
  },
  {
    path: 'user',
    component: UserLayout,
    children: [
      { path: '', component: UserGroups },
      { path: 'groups', component: UserGroups },
      { path: 'chat', component: ChatComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'superadmin/users', component: UsersComponent },
  { path: 'superadmin/groups', component: GroupsComponent },
  { path: 'superadmin/channels', component: ChannelsComponent },
  { path: '**', redirectTo: '/superadmin/users' },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)], // Register the routes
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
