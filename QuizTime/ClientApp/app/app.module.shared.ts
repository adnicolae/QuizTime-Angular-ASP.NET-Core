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
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchQuizzesComponent } from './components/fetchquizzes/fetchquizzes.component';
import { FetchResultsComponent } from './components/fetchresults/fetchresults.component';
import { SessionBoardComponent } from './components/sessionboard/sessionboard.component';
import { QuizDetailComponent } from './components/quizdetail/quizdetail.component';
import { JoinSessionComponent } from './components/joinsession/joinsession.component';
import { ParticipantBoardComponent } from './components/joinsession/participantboard.component';
import { CreateQuizComponent } from './components/createquiz/createquiz.component';
import { QuizCreatedComponent } from './components/createquiz/quizcreated.component';
import { SimpleTimer } from 'ng2-simple-timer';

@NgModule({
    providers: [SimpleTimer],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        FetchQuizzesComponent,
        FetchResultsComponent,
        SessionBoardComponent,
        QuizDetailComponent,
        JoinSessionComponent,
        CreateQuizComponent,
        QuizCreatedComponent,
        ParticipantBoardComponent,
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
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'fetch-quizzes', component: FetchQuizzesComponent },
            { path: 'new/quiz', component: CreateQuizComponent },
            { path: 'new/quiz/created', component: QuizCreatedComponent },
            { path: 'fetch-results', component: FetchResultsComponent },
            { path: 'session-board', component: SessionBoardComponent },
            { path: 'session-board/host/:id', component: SessionBoardComponent },
            { path: 'session-board/participant/:id', component: ParticipantBoardComponent },
            { path: 'join', component: JoinSessionComponent },
            { path: 'fetch-quizzes/detail', component: QuizDetailComponent },
            { path: 'fetch-quizzes/detail/:id', component: QuizDetailComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
