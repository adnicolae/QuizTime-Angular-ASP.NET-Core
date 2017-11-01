import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Repository } from '../../data/repository';
import { Quiz } from '../../models/quiz.model';
import { Choice } from '../../models/choice.model';

@Component({
    selector: 'create-quiz',
    templateUrl: './createquiz.component.html'
})
export class CreateQuizComponent {
    quizForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private repo: Repository) {
        this.createForm();
    }

    setChoices(choices: Choice[]) {
        const choiceFGs = choices.map(choice => this.formBuilder.group(choice));
        const choiceFromArray = this.formBuilder.array(choiceFGs);
        this.quizForm.setControl('choices', choiceFromArray);
    }

    get choices(): FormArray {
        return this.quizForm.get('choices') as FormArray;
    }

    addChoice() {
        this.choices.push(this.formBuilder.group(new Choice()));
    }

    removeChoice(index: number) {
        this.choices.removeAt(index);
    }

    choiices : Choice[] = [new Choice(2310, 'titlu', false), new Choice(233, 'titlu2', true)];

    onSubmit() {
        const formModel = this.quizForm.value;

        const saveQuiz: Quiz = {
            quizId: 0,
            title: formModel.title as string,
            dateCreated: new Date(),
            assignedPoints: formModel.assignedPoints as number,
            creator: this.repo.quizzes[1].creator
        };

        this.repo.createQuiz(saveQuiz);

        console.log(this.repo.quizzes[this.repo.quizzes.length - 1]);

        const ch: any = formModel.choices.map((choice: Choice) => choice.choiceId = 0);

        const ch2: any = formModel.choices.map((choice: Choice) => choice.quiz = this.repo.quizzes[this.repo.quizzes.length - 1]);

        const choicesCopy: Choice[] = formModel.choices.map(
            (choice: Choice) => Object.assign(new Choice(), choice));


        for (var c in choicesCopy)
        {
            console.log(choicesCopy[c]);
        }

        console.log(choicesCopy);
        console.log(ch);
        console.log("AFTER");
        console.log(this.choiices);
        console.log(formModel.choices as Choice[]);
    }

    createForm() {
        this.quizForm = this.formBuilder.group({
            title: ['', Validators.required],
            assignedPoints: '0',
            choices: this.formBuilder.array([]),
        });
    }
}