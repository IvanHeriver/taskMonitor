import { Writable, writable, get } from "svelte/store";
import type { IDurationItem, IProject, ITag, ITask, ITimer } from "./types";
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
      loadedProject.tasks = loadedProject.tasks.map(task=>{
        if (Array.isArray(task.duration)) {
          console.warn("Already done", task.duration)
        } else {
          task.duration = [{id: uuid(), date: new Date().toISOString(), duration: task.duration}]
        }
        loadedProject.version = 2
        return task
      })
    }
    loadedProject.ui.statPanelOpen = true
    return loadedProject;
  }

export function createNewProject(): IProject {
   const newProject: IProject = {
        version: 2,
        id: uuid(),
        name: "untitle",
        description: "",
        filePath: "",
        state: "unsaved",
        tasks: [],
        tags: [],
        timerLogs: [],
        todos: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        stats: {
          allocatedDuration: null,
        },
        ui: {
          newTagOpen: false,
          newTaskOpen: false,
          newTodoOpen: false,
          taskPanelOpen: true,
          tagPanelOpen: true,
          timerPanelOpen: true,
          statPanelOpen: false,
          todoPanelOpen: true,
        },
      };
    return newProject
}

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

export const draggedDurationItem: Writable<IDurationItem> = writable(null)

export interface IMessage {
  title: string;
  message: string;
  duration: number;
  type: "info" | "warning" | "error";
  id?: string;
}
export const messages: Writable<Array<IMessage>> = writable([])
export function addMessage(message: IMessage) {
  message.id = uuid()
  if (message.duration > 0) {
    setTimeout(()=>{
      messages.update(messages=>messages.filter(m=>m.id!==message.id))
    }, message.duration)
  }
  messages.update(messages=>[...messages, message])
}