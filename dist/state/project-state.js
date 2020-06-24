import { Project, projectStatus } from '../models/project.js';
class state {
    constructor() {
        this.listeners = [];
    }
    addListener(listnerFn) {
        this.listeners.push(listnerFn);
    }
}
export class ProjectState extends state {
    constructor() {
        super();
        this.projects = [];
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, projectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    ;
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
        }
        this.updateListeners();
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map