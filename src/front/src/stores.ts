import { Writable, writable, get } from "svelte/store";
import type { IProject, ITag, ITask, ITimer } from "./types";

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
      return p;
    });

    window.electronAPI
      .saveSession(proj, get(currentProjectId))
      .then((_) => console.log("session saved!"));
    debouncer = null;
  }, 500);
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

// export const projID: Writable<number> = writable(null)

// function createDefaultDevProjects() {
//   const tags: Array<ITag> = [
//     {
//       id: "0",
//       name: "main",
//       description: "main activities",
//       color: { h: 100, s: 50, l: 50 },
//     },
//     {
//       id: "1",
//       name: "secondary",
//       description: "secondary activities",
//       color: { h: 200, s: 100, l: 50 },
//     },
//     {
//       id: "2",
//       name: "urgent",
//       description: "urgent activities",
//       color: { h: 0, s: 100, l: 50 },
//     },
//     {
//       id: "3",
//       name: "incomplete",
//       description: "Still some work to be done",
//       color: { h: 50, s: 90, l: 75 },
//     },
//     {
//       id: "4",
//       name: "uncertain",
//       description:
//         "There is some uncertainty regarding the duration of the task",
//       color: { h: 220, s: 90, l: 10 },
//     },
//   ];

//   const tasks: Array<ITask> = [
//     {
//       id: "0",
//       title: "project start",
//       description: "Working environment setup",
//       duration: 120,
//       tags_id: ["0"],
//       date: new Date().toISOString(),
//       created: new Date().toISOString(),
//       updated: new Date().toISOString(),
//       mode: "large-view",
//     },
//     {
//       id: "1",
//       title: "first meeting",
//       description: "Discussions on planning",
//       duration: 45,
//       tags_id: ["1"],
//       date: new Date().toISOString(),
//       created: new Date().toISOString(),
//       updated: new Date().toISOString(),
//       mode: "large-view",
//     },
//     {
//       id: "2",
//       title: "Proof of concept",
//       description:
//         "Proof of concept to showcase to the client created. Only features were implemented; no styling.",
//       duration: 12 * 60 + 30,
//       tags_id: ["0", "2", "3", "4"],
//       date: new Date().toISOString(),
//       created: new Date().toISOString(),
//       updated: new Date().toISOString(),
//       mode: "large-view",
//     },
//   ];

//   const projects: Array<IProject> = [
//     {
//       id: "0",
//       name: "First Project",
//       description: "My first client work",
//       filePath: "",
//       state: "saved",
//       tasks: tasks,
//       tags: tags,
//       timerLogs: [],
//       created: new Date().toISOString(),
//       updated: new Date().toISOString(),
//       stats: {
//         allocatedDuration: null,
//       },
//       ui: {
//         newTaskOpen: false,
//         newTagOpen: false,
//         taskPanelOpen: true,
//         tagPanelOpen: true,
//         timerPanelOpen: true,
//         statPanelOpen: true,
//       },
//     },
//   ];
//   return projects;
// }
