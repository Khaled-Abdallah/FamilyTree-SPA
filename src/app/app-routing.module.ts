import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { BlogsComponent } from './components/dashboard/blogs/blogs-list/blogs.component';
import { BlogDetailsComponent } from './components/dashboard/blogs/blog-details/blog-details.component';
import { BlogsListResolverService } from './resolvers/blogsListResolver.service';
import { DefinitionResloverDervice } from './resolvers/definitionReslover.service';
import { BlogResolverService } from './resolvers/blogResolver.service';
import { CommentsListResolverService } from './resolvers/commentsListResolver.service';
import { FamilCharListComponent } from './components/dashboard/family-char/famil-char-list/famil-char-list.component';
import { FamilCharListResolverService } from './resolvers/familCharListResolver.service';
import { TermsComponent } from './components/dashboard/terms/terms.component';
import { TermsResolverService } from './resolvers/termsResolver.service';
import { SettingComponent } from './components/dashboard/setting/setting.component';
import { SettingsResolverService } from './resolvers/SettingsResolver.service';
import { UserPermissionComponent } from './components/dashboard/users/user-permission/user-permission.component';
import { UserPermissionResolverService } from './resolvers/UserPermissionResolver.service';
import { FamilyTreeListComponent } from './components/dashboard/family-Tree/family-tree-list/family-tree-list.component';
import { TreeListResolverService } from './resolvers/TreeListResolver.service';
import { NewsListComponent } from './components/dashboard/news/news-list/news-list.component';
import { newsListResolverService } from './resolvers/newsListResolver.service';
import { NewsDetailsComponent } from './components/dashboard/news/news-details/news-details.component';
import { NewsResolverService } from './resolvers/newsResolver.service';
import { NewsCommentsListResolverService } from './resolvers/newsCommentsListResolver.service';
import { UsersListResolverService } from './resolvers/usersListResolver.service';
import { UserProfileComponent } from './components/dashboard/users/user-profile/user-profile.component';
import { UserProfileResolverService } from './resolvers/userProfileResolver.service';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { UsersNotAcceptedResolverService } from './resolvers/usersNotAcceptedResolver.service';
import { NewsCommentsNotAcceptedResolver } from './resolvers/newsCommentsNotAcceptedResolver.service';
import { BlogCommentsNotAcceptedResolver } from './resolvers/blogCommentsNotAcceptedResolver.service';
import { RefusalCommentsResolver } from './resolvers/refusalCommentsResolver.service';
import { RefusalNewsCommentsResolver } from './resolvers/refusalNewsCommentsResolver.service';
import { FamilCharWattingResolverService } from './resolvers/FamilCharWattingResolverService.service';
import { RegisterComponent } from './components/dashboard/register/register.component';
import { FirtSettingsComponent } from './components/dashboard/firt-settings/firt-settings.component';



const appRoutes: Routes = [
  { path:'family-tree' ,component: FamilyTreeComponent, resolve:{ treeList: TreeListResolverService }},
  { 
    path:'first-Settings' ,
    component: FirtSettingsComponent, 
    resolve:{ settings: SettingsResolverService},
    canActivate: [AuthGuard]
  },
  { 
    path:'admin' ,component: DashboardComponent,
    canActivate: [AuthGuard],
    children:
    [
      { path:'register' ,component: RegisterComponent},
      { path: 'home', component: HomeComponent , resolve: { definition: DefinitionResloverDervice} },
      { path: 'blogs', component: BlogsComponent, resolve: { blogsList: BlogsListResolverService} },
      { path: 'blog-details/:id', component: BlogDetailsComponent, 
          resolve: 
          { 
            blog: BlogResolverService, 
            comments: CommentsListResolverService,
            blogCommentsNotAccepted: BlogCommentsNotAcceptedResolver
            ,refusalComments : RefusalCommentsResolver
          }
        },
      { path: 'family-characters', component: FamilCharListComponent , 
          resolve: 
          { 
            familyChars: FamilCharListResolverService,
            familyCharsWatting: FamilCharWattingResolverService
          } },
      { path: 'terms', component: TermsComponent, resolve: { terms: TermsResolverService }  },
      { path: 'user-management', component: UserPermissionComponent, resolve: {userPermission: UserPermissionResolverService} },
      { path: 'settings', component: SettingComponent, resolve:{ settings: SettingsResolverService} },      
      { path: 'family-tree', component: FamilyTreeListComponent, resolve:{treeList: TreeListResolverService ,usersNotAccepted: UsersNotAcceptedResolverService} },
      { path: 'news-list', component: NewsListComponent,resolve: {newsList: newsListResolverService} },
      { path: 'news-details/:id', component: NewsDetailsComponent, 
          resolve:{ 
              news: NewsResolverService, 
              newsComments: NewsCommentsListResolverService,
              newsCommentsWatting: NewsCommentsNotAcceptedResolver
              ,refusalComments : RefusalNewsCommentsResolver
           }},
      { 
        path: 'user-profile', 
        component: UserProfileComponent,
        resolve: { userProfile: UserProfileResolverService }
      },
      { path: '', component: HomeComponent },  
      { path: '**', redirectTo:'home', pathMatch:'full'}
    ]
  },
  { path:'login' ,component: LoginComponent}, 
  { path:'' , redirectTo:'login', pathMatch:'full'},      
  { path:'**', redirectTo:'login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
