import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { RepositoryModule } from './data/repository.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchResultsComponent } from './components/fetchresults/fetchresults.component';
import { SessionBoardComponent } from './components/sessionboard/sessionboard.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BoardComponent } from './components/sessionboard/board.component';

import { QuizDetailComponent } from './components/quizdetail/quizdetail.component';
import { JoinSessionComponent } from './components/joinsession/joinsession.component';
import { ParticipantBoardComponent } from './components/joinsession/participantboard.component';
import { CreateQuizComponent } from './components/createquiz/createquiz.component';
import { SimpleTimer } from 'ng2-simple-timer';
import { RegisterComponent } from './components/registration/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthService } from './components/registration/auth.service';
import { GroupManagementComponent } from './components/groupmanagement/groupmanagement.component';
import { GroupQuizzesComponent } from './components/groupmanagement/groupquizzes.component';
import { GroupResultsComponent } from './components/groupmanagement/groupresults.component';
import { RevisionComponent } from './components/revision/revision.component';
import { ErrorHandler } from "@angular/core";
import { ErrorHandlerService } from "./errorHandler.service";
import { DisplayErrorComponent } from "./components/displayerror/displayerror.component";
import { SuiModule } from 'ng2-semantic-ui';
import { ChartsModule } from 'ng2-charts';
import { SidebarModule } from 'ng-sidebar';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';
import { DrawQuizComponent } from './components/drawquiz/drawquiz.component';
// Create handler object to override ng behaviour such that
// all errors are handled using the custom handler service
const eHandler = new ErrorHandlerService();

export function handler() {
    return eHandler;
}

@NgModule({
    providers: [
        SimpleTimer,
        AuthService,
        { provide: ErrorHandlerService, useFactory: handler },
        { provide: ErrorHandler, useFactory: handler }, 
    ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        WelcomeComponent,
        FetchResultsComponent,
        SessionBoardComponent,
        BoardComponent,
        QuizDetailComponent,
        JoinSessionComponent,
        CreateQuizComponent,
        ParticipantBoardComponent,
        RegisterComponent,
        SettingsComponent,
        GroupManagementComponent,
        GroupQuizzesComponent,
        GroupResultsComponent,
        DisplayErrorComponent,
        RevisionComponent,
        DrawQuizComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RepositoryModule,
        SuiModule,
        ChartsModule,
        CanvasWhiteboardModule,
        SidebarModule.forRoot(),
        CookieModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'welcome', component: WelcomeComponent },
            { path: 'new/quiz', component: CreateQuizComponent },
            { path: 'fetch-results', component: FetchResultsComponent },
            { path: 'session-board', component: SessionBoardComponent },
            { path: 'session-board/host/:id', component: SessionBoardComponent },
            { path: 'session-board/participant/:id', component: ParticipantBoardComponent },
            { path: 'join', component: JoinSessionComponent },
            { path: 'fetch-quizzes/detail', component: QuizDetailComponent },
            { path: 'quizzes/detail/:id', component: QuizDetailComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'groups', component: GroupManagementComponent },
            { path: 'groups/quizzes/:id', component: GroupQuizzesComponent },
            { path: 'groups/results/:id', component: GroupResultsComponent },
            { path: 'new/revision', component: RevisionComponent },
            { path: 'draw', component: DrawQuizComponent},
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
