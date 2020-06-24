import { Component } from './base-component'
import { Validatable, validate } from '../util/validation'
import { autobind } from '../decorators/autobind-decorator'
import { projectState } from '../state/project-state'
    // ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true,'user-input');
        this.titleInputElement = <HTMLInputElement>this.element.querySelector("#title");
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector("#description");
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector("#people");
        this.configure();
    }
    
    private clearInputs(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userinput = this.gatherUserInput();
        if (Array.isArray(userinput)){
            const [title,desc,people] = userinput;
            projectState.addProject(title,desc,people);
            this.clearInputs();
        }else {
        }
    }

    configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(){}

    private gatherUserInput(): [string,string,number] | void{
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
        };
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable) 
        ){
            alert("Invalid input, please try again");
            return;
        }else {
            return [enteredTitle, enteredDescription,+enteredPeople];
        }
    }
}