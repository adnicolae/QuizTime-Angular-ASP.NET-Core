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

        const choicesCopy: Choice[] = formModel.choices.map(
            (choice: Choice) => Object.assign({}, choice));



        this.repo.createQuiz(new Quiz(0, formModel.title as string, formModel.assignedPoints as number, new Date(), this.repo.quizzes[1].creator));
    }

    createForm() {
        this.quizForm = this.formBuilder.group({
            title: ['', Validators.required],
            assignedPoints: '0',
            choices: this.formBuilder.array([]),
        });
    }
}