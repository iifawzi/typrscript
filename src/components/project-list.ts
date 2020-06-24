import {DragTarget} from '../models/drag-drop.js';
import {Project, projectStatus} from '../models/project.js';
import { Component } from './base-component.js'
import { autobind } from '../decorators/autobind-decorator.js'
import { projectState } from '../state/project-state.js'
import { ProjectItem } from './project-item.js'

export class ProjectList extends Component<HTMLDivElement, HTMLElement>  implements DragTarget{
    assignedProjects: Project[];
    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', false , `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent){
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    };

    @autobind
    dropHandler(event: DragEvent){
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId,this.type == 'finished' ? projectStatus.Finished : projectStatus.Active);
    };

    @autobind
    dragLeaveHandler(_: DragEvent){
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    };

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects: Project[])=> {
            const releventProjects = projects.filter(prj=> {
                if (this.type === 'active'){
                   return prj.status === projectStatus.Active
                }
                return prj.status === projectStatus.Finished

             })
            console.log(this);
            this.assignedProjects = releventProjects;
            this.renderProjects();
        });
    }

    renderContent(){
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase()+ ' PROJECTS'
    }

    private renderProjects(){
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-project-list`)!;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects){
        new ProjectItem(this.element.querySelector('ul')!.id,prjItem);
        }
    };

}
