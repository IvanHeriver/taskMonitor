export interface IProject {
  id: string;
  name: string;
  description: string;
  filePath: string;
  state: "unsaved" | "saved";
  tasks: Array<ITask>;
  tags: Array<ITag>;
  timerLogs: Array<ITimerLog>;
  created: string;
  updated: string;
  stats: IStats;
  ui: IUi;
}

export interface ITask {
  id: string;
  date: string;
  duration: number;
  title: string;
  description: string;
  tags_id: Array<string>;
  created: string;
  updated: string;
  mode: "large-view" | "small-view" | "edit";
}

export interface ITag {
  id: string;
  name: string;
  description: string;
  color: { h: number; s: number; l: number };
}

export interface ITimer {
  started: boolean;
  startDateTime: Date;
  startTime: number;
  currentTime: number;
  offsetTime: number;
}

export interface ITimerLog {
  id: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  used: boolean;
}

export interface IUi {
  newTaskOpen: boolean;
  newTagOpen: boolean;
  taskPanelOpen: boolean;
  tagPanelOpen: boolean;
  timerPanelOpen: boolean;
  statPanelOpen: boolean;
}

export interface IStats {
  allocatedDuration: number;
}

declare global {
  interface Window {
    electronAPI: {
      shoudUseDarkMode: Function;
      onSetDarkMode: Function;
      // toggleDarkMode: Function;
      onSaveProject: Function;
      onLoadProject: Function;
      saveProject: Function;
      loadProject: Function;
      saveSession: Function;
      retrieveSession: Function;
      onResize: Function;
      isNormal: Function;
      minimize: Function;
      maximize: Function;
      restore: Function;
      close: Function;
      openMainMenue: Function;
    }; // 👈️ turn off type checking
  }
}
