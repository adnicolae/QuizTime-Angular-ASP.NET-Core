import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { RepositoryModule } from './data/repository.module';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchQuizzesComponent } from './components/fetchquizzes/fetchquizzes.component';
import { FetchResultsComponent } from './components/fetchresults/fetchresults.component';
import { SessionBoardComponent } from './components/sessionboard/sessionboard.component';
import { QuizDetailComponent } from './components/quizdetail/quizdetail.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        FetchQuizzesComponent,
        FetchResultsComponent,
        SessionBoardComponent,
        QuizDetailComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RepositoryModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'fetch-quizzes', component: FetchQuizzesComponent },
            { path: 'fetch-results', component: FetchResultsComponent },
            { path: 'session-board', component: SessionBoardComponent },
            { path: 'fetch-quizzes/detail', component: QuizDetailComponent },
            { path: 'fetch-quizzes/detail/:id', component: QuizDetailComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
