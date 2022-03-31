
export interface tmProject {
  id: string,
  name: string
  description: string
  filePath: string
  state: "unsaved" | "saved"
  tasks: Array<tmTask>
  tags: Array<tmTag>
  timer: tmTimer
  created: Date,
  updated: Date,
}

export interface tmTask {
  id: string,
  dateTime: Date,
  duration: number
  title: string;
  description: string,
  tags_id: Array<number>
}

export interface tmTag {
  id: string,
  name: string,
  description: string,
  color: string
}

export interface tmTimer {
  state: "stoped" | "started" | "paused"
  startDateTime: Date,
  startTime: number,
  currentTime: number,
  history: Array<tmTimerHistoryItem>
}

export interface tmTimerHistoryItem {
  startDateTime: Date
  endDateTime: Date
  duration: number
}