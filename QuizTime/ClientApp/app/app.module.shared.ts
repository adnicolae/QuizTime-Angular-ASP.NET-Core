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
import { FetchQuizzesComponent } from './components/fetchquizzes/fetchquizzes.component';
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

@NgModule({
    providers: [SimpleTimer, AuthService],
    declarations: [
        AppComponent,
        NavMenuComponent,
        WelcomeComponent,
        FetchQuizzesComponent,
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
        HomeComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RepositoryModule,
        CookieModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'welcome', component: WelcomeComponent },
            { path: 'fetch-quizzes', component: FetchQuizzesComponent },
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
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
