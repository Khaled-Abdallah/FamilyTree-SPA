import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import { TabsModule , ModalModule, BsDatepickerModule, BsDropdownModule} from 'ngx-bootstrap';
import { DropdownListModule } from 'ngx-dropdown-list';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlertifyService } from './services/alertify.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './services/auth.Interceptor';
import { ModalService } from './services/modal.service';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { NgxPrintModule } from 'ngx-print';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgxEditorModule } from 'ngx-editor';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { BlogsComponent } from './components/dashboard/blogs/blogs-list/blogs.component';
import { BlogDetailsComponent } from './components/dashboard/blogs/blog-details/blog-details.component';
import { BlogsListResolverService } from './resolvers/blogsListResolver.service';
import { DefinitionResloverDervice } from './resolvers/definitionReslover.service';
import { BlogResolverService } from './resolvers/blogResolver.service';
import { CommentsListResolverService } from './resolvers/commentsListResolver.service';
import { FamilCharListComponent } from './components/dashboard/family-char/famil-char-list/famil-char-list.component';
import { FamilCharListResolverService } from './resolvers/familCharListResolver.service';
import { FamilyCharEditComponent } from './components/dashboard/family-char/family-char-edit/family-char-edit.component';
import { TermsComponent } from './components/dashboard/terms/terms.component';
import { SettingsService } from './services/settings.service';
import { TermsResolverService } from './resolvers/termsResolver.service';
import { SettingComponent } from './components/dashboard/setting/setting.component';
import { SettingsResolverService } from './resolvers/SettingsResolver.service';
import { UserPermissionComponent } from './components/dashboard/users/user-permission/user-permission.component';
import { UserPermissionResolverService } from './resolvers/UserPermissionResolver.service';
import { FamilyTreeListComponent } from './components/dashboard/family-Tree/family-tree-list/family-tree-list.component';
//import { TreeviewModule } from 'ngx-treeview';
import { TreeNgxModule } from 'tree-ngx';
import { TreeModule } from 'angular-tree-component';
import { TreeListResolverService } from './resolvers/TreeListResolver.service';
import { NewsListComponent } from './components/dashboard/news/news-list/news-list.component';
import { newsListResolverService } from './resolvers/newsListResolver.service';
import { NewsDetailsComponent } from './components/dashboard/news/news-details/news-details.component';
import { NewsResolverService } from './resolvers/newsResolver.service';
import { NewsCommentsListResolverService } from './resolvers/newsCommentsListResolver.service';
import { UsersListResolverService } from './resolvers/usersListResolver.service';
import { ManageUserComponent } from './components/dashboard/users/manage-user/manage-user.component';
import { UserInfoComponent } from './components/dashboard/users/user-info/user-info.component';
import { UserProfileComponent } from './components/dashboard/users/user-profile/user-profile.component';
import { UserProfileResolverService } from './resolvers/userProfileResolver.service';
import { NgxTextEditorModule } from 'ngx-text-editor';
import { NewsImagesComponent } from './components/dashboard/news/news-images/news-images.component';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { UsersNotAcceptedResolverService } from './resolvers/usersNotAcceptedResolver.service';
import { NgxGalleryModule, CustomHammerConfig } from 'ngx-gallery';
import 'hammerjs';
import { NewsCommentsNotAcceptedResolver } from './resolvers/newsCommentsNotAcceptedResolver.service';
import { BlogCommentsNotAcceptedResolver } from './resolvers/blogCommentsNotAcceptedResolver.service';
import { RefusalCommentsResolver } from './resolvers/refusalCommentsResolver.service';
import { RefusalNewsCommentsResolver } from './resolvers/refusalNewsCommentsResolver.service';
import { FamilCharWattingResolverService } from './resolvers/FamilCharWattingResolverService.service';
import {TimeAgoPipe} from 'time-ago-pipe';
import { MomentModule } from 'ngx-moment';

// import { CKEditorModule } from 'ng2-ckeditor';
import { CKEditorModule } from 'ng2-ckeditor';
import { UserWifesComponent } from './components/dashboard/users/user-wifes/user-wifes.component';
import { UserChildrenComponent } from './components/dashboard/users/user-children/user-children.component';
import { ChildrenPermissionComponent } from './components/dashboard/users/children-permission/children-permission.component';
import {OrganizationChartModule} from 'primeng/organizationchart';
import { UserLoginComponent } from './components/dashboard/users/user-login/user-login.component';
import { MatchingPasswordDirective } from './helper/matching-password.directive';
import { ValidateEqualModule } from 'ng-validate-equal';
import { VerticalTreeComponent } from './components/dashboard/vertical-tree/vertical-tree.component';
import { RegisterComponent } from './components/dashboard/register/register.component';


export function getToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    VerticalTreeComponent,
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    BlogsComponent,
    BlogDetailsComponent,
    FamilCharListComponent,
    FamilyCharEditComponent,
    TermsComponent,
    SettingComponent,
    UserPermissionComponent,
    FamilyTreeListComponent,
    NewsListComponent,
    NewsDetailsComponent,
    ManageUserComponent,
    UserInfoComponent,
    UserProfileComponent,
    NewsImagesComponent,
    FamilyTreeComponent,
    TimeAgoPipe,
    UserWifesComponent,
    UserChildrenComponent,
    ChildrenPermissionComponent,
    UserLoginComponent,
    MatchingPasswordDirective,
    RegisterComponent
  ],
  imports: [
    OrganizationChartModule,
    TreeModule.forRoot(),
    TreeNgxModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    NgxEditorModule ,
    NgxTextEditorModule ,
    BrowserAnimationsModule,
    CKEditorModule,
    NgProgressModule.withConfig({
      min: 0.08,
      max: 100,
      ease: 'linear',
      speed: 200,
      trickleSpeed: 300,
      meteor: true,
      spinner: true,
      spinnerPosition: 'left',
      direction: 'ltr+',
      color: 'yellow',
      thick: true,
      fixed: true
    }),
    NgxPrintModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      enableHtml: true,
      progressBar: false
    }),
    ChartsModule,
    DropdownListModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    FileUploadModule,
    TabsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: [environment.apiUrl],
        blacklistedRoutes: [environment.apiUrl + 'account']
      },
  }),
    ModalModule.forRoot(),
    NgSelectModule
    ,NgxGalleryModule,
    // MomentModule.forRoot({relativeTimeThresholdOptions: {'m': 59 }})
    MomentModule
  ],
  providers: [
    ModalService,
    AlertifyService,
    SettingsService,
    BlogsListResolverService,
    DefinitionResloverDervice,
    BlogResolverService,
    CommentsListResolverService,
    FamilCharListResolverService,
    TermsResolverService,
    SettingsResolverService,
    UserPermissionResolverService,
    TreeListResolverService,
    newsListResolverService,
    NewsResolverService,
    NewsCommentsListResolverService,
    UsersListResolverService,
    UserProfileResolverService,
    UsersNotAcceptedResolverService,
    NewsCommentsNotAcceptedResolver,
    BlogCommentsNotAcceptedResolver,
    RefusalCommentsResolver,
    RefusalNewsCommentsResolver,
    FamilCharWattingResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ,{
      provide: HAMMER_GESTURE_CONFIG,
          useClass: CustomHammerConfig
    }

    //,{ provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
