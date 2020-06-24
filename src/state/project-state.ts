import {Project, projectStatus} from '../models/project';

type Listener<T> = (items:T[])=> void;

class state<T> {
    protected listeners:Listener<T>[] = [];
    addListener(listnerFn: Listener<T>){
    this.listeners.push(listnerFn);
    }
}

export class ProjectState extends state<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;
    private constructor(){
        super();
    }
    public addProject(title: string, description: string,numOfPeople:number){
        const newProject = new Project(Math.random().toString(), title,description,numOfPeople,projectStatus.Active)
        this.projects.push(newProject);
        this.updateListeners();
    };

    static getInstance(){
        if (this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    public moveProject(projectId: string, newStatus: projectStatus){
      const project =   this.projects.find(prj=> prj.id === projectId);
      if(project && project.status !== newStatus){
        project.status = newStatus;
      }
      this.updateListeners();
    }

    private updateListeners(){
        for (const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }

}
export const projectState = ProjectState.getInstance();
