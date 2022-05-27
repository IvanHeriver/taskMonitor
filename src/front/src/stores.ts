import { Writable, writable, get } from "svelte/store";
import type { IProject, ITag, ITask, ITimer } from "./types";
import {uuid} from "./utils"

// export const projects: Writable<Array<IProject>> = writable([]);
function createProjectsStore() {
  const { subscribe, set, update } = writable([]);
  function setAndModify(newValue) {
    set(newValue);
    saveSession();
  }
  return { subscribe, set: setAndModify, update };
}
export const projects: Writable<Array<IProject>> = createProjectsStore();

export const currentProjectId: Writable<string> = writable(null);

const modificationMonitor: Writable<
  Array<{
    projectId: string;
    type: string;
    map: Array<string | number>;
  }>
> = writable([]);

export function registerModification(
  projectId: string,
  type: string,
  map: Array<string | number>
) {
  saveSession();
  console.log("#".repeat(20));
  console.log("modificationMonitor:", { projectId, type, map });
  projects.update((projs) => {
    const index = projs.findIndex((p) => p.id === projectId);
    projs[index].state = "unsaved";
    return projs;
  });
  modificationMonitor.update((old) => [{ projectId, type, map }, ...old]);
}

let debouncer = null;
export function saveSession() {
  if (debouncer !== null) {
    clearTimeout(debouncer);
  }
  debouncer = setTimeout(() => {
    let proj = JSON.parse(JSON.stringify(get(projects)));
    proj = proj.map((p) => {
      p.tasks = p.tasks.map((t) => {
        if (t.mode === "edit") t.mode = "large-view";
        return t;
      });
      p.ui.newTagOpen = false;
      p.ui.newTaskOpen = false;
      p.ui.newTodoOpen = false;
      return p;
    });

    window.electronAPI
      .saveSession(proj, get(currentProjectId))
      .then((_) => console.log("session saved!"));
    debouncer = null;
  }, 500);
}

export function processLoadedProject(loadedProject: IProject): IProject {
    if (!("version" in loadedProject)) {
      loadedProject.version = 0;
    }
    if (loadedProject.version === 0) {
      loadedProject.todos = [];
      loadedProject.ui.newTodoOpen = false
      loadedProject.ui.todoPanelOpen = true
      loadedProject.version = 1
    }
    if (loadedProject.version === 1) {
      // do stuff here to modify the task duration element
      // it should now be an array of IDurationItem
      loadedProject.tasks = loadedProject.tasks.map(task=>{
        if (Array.isArray(task.duration)) {
          console.warn("Already done I think", task.duration)
          // task.duration[0].id = uuid()
          // console.warn("Already done I think", task.duration)
        } else {
          task.duration = [{id: uuid(), date: new Date().toISOString(), duration: task.duration}]
        }
        loadedProject.version = 2
        return task
      })
    }
    loadedProject.ui.newTaskOpen = true
    return loadedProject;
  }
// projects.subscribe((ps)=>{
//   ps.
// })
// export const project: Writable<IProject> = writable(null);

export const timers: Writable<{ [key: string]: ITimer }> = writable({});

export const question: Writable<{
  title: string;
  question: string;
  answer: Function;
}> = writable(null);


export const message: Writable<{
  title: string;
  message: string;
  duration: number;
  type: string;
}> = writable(null);


export const overlay: Writable<boolean> = writable(false)

