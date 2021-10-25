import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { LoginComponent } from './screens/login/login.component';
import { RegisterComponent } from './screens/register/register.component';
import { UserListComponent } from './screens/user-list/user-list.component';
import { EditprofileComponent } from './screens/editprofile/editprofile.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
// import { SearchtermComponent } from './screens/searchterm/searchterm.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
      children:[

      {
        path:'',
        component: LoginComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'user-list',
        component: UserListComponent
      },
      {
        path:'editprofile',
        component: EditprofileComponent
      }
    ]
    },
  
  
  // {
  //   path:'searchterm',
  //   component: SearchtermComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
