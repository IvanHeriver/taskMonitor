import { Writable, writable } from "svelte/store";
import type { tmProject, tmTag, tmTask, tmTimer } from "./types";

export const projects: Writable<Array<tmProject>> = writable(
  createDefaultDevProjects()
);

// export const projID: Writable<number> = writable(null)

function createDefaultDevProjects() {
  const tags: Array<tmTag> = [
    {
      id: "0",
      name: "main",
      description: "main activities",
      color: { h: 100, s: 50, l: 50 },
    },
    {
      id: "1",
      name: "secondary",
      description: "secondary activities",
      color: { h: 200, s: 100, l: 50 },
    },
    {
      id: "2",
      name: "urgent",
      description: "urgent activities",
      color: { h: 0, s: 100, l: 50 },
    },
    {
      id: "3",
      name: "incomplete",
      description: "Still some work to be done",
      color: { h: 50, s: 90, l: 75 },
    },
    {
      id: "4",
      name: "uncertain",
      description:
        "There is some uncertainty regarding the duration of the task",
      color: { h: 220, s: 90, l: 10 },
    },
  ];

  const tasks: Array<tmTask> = [
    {
      id: "0",
      title: "project start",
      description: "Working environment setup",
      duration: 120,
      tags_id: ["0"],
      date: new Date(),
      created: new Date(),
      updated: new Date(),
    },
    {
      id: "1",
      title: "first meeting",
      description: "Discussions on planning",
      duration: 45,
      tags_id: ["1"],
      date: new Date(),
      created: new Date(),
      updated: new Date(),
    },
    {
      id: "2",
      title: "Proof of concept",
      description:
        "Proof of concept to showcase to the client created. Only features were implemented; no styling.",
      duration: 12 * 60 + 30,
      tags_id: ["0", "2", "3", "4"],
      date: new Date(),
      created: new Date(),
      updated: new Date(),
    },
  ];

  const timers: Array<tmTimer> = [
    {
      state: "stopped",
      startDateTime: new Date(),
      startTime: 0,
      currentTime: 0,
      history: [],
    },
  ];
  //   state: "stoped" | "started" | "paused";
  //   startDateTime: Date;
  //   startTime: number;
  //   currentTime: number;
  //   history: Array<tmTimerHistoryItem>;
  const projects: Array<tmProject> = [
    {
      id: "0",
      name: "First Project",
      description: "My first client work",
      filePath: "",
      state: "saved",
      tasks: tasks,
      tags: tags,
      timer: timers[0],
      created: new Date(),
      updated: new Date(),
    },
  ];
  return projects;
}

//   id: string;
//   name: string;
//   description: string;
//   filePath: string;
//   state: "unsaved" | "saved";
//   tasks: Array<tmTask>;
//   tags: Array<tmTag>;
//   timer: tmTimer;
//   created: Date;
//   updated: Date;
