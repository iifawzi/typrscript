// Validation: 
interface Validatable {
    value?:string | number;
    required?:boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable): boolean{
    let isValid:boolean = true;
    if (validatableInput.required){
        isValid = isValid && validatableInput.value?.toString().trim().length !== 0;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.maxLength;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.minLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// decorators
function autobind(_: any, _2:string, descriptor:PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
return adjDescriptor;
}

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById("project-input")!;
        this.hostElement = <HTMLDivElement>document.getElementById("app")!;

        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input"

        this.titleInputElement = <HTMLInputElement>this.element.querySelector("#title");
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector("#description");
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector("#people");

        this.configure();
        this.attach();
    }

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
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
            console.log(title,desc,people);
            this.clearInputs();
        }else {
        }
    }

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

    private configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }
}



const prjInput = new ProjectInput();