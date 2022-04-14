import { dialog } from "electron";
import fs from "fs";
import path from "path";
import type { IProject } from "../../front/src/types";

export async function saveProjectToFile(
  browserWindow,
  project: IProject
): Promise<{ canceled: boolean; success: boolean; project: IProject }> {
  let filePath = project.filePath;
  let canceled = false;
  if (filePath === "") {
    const res = await dialog.showSaveDialog(browserWindow, {filters:[{name: "Tatimo file", extensions: ["ttm"]}], defaultPath: project.name});
    canceled = res.canceled;
    filePath = res.filePath;
  }
  if (canceled) return { canceled: true, success: false, project };
  project.filePath = filePath;
  project.state = "saved";
  const res = await saveProject(project, project.filePath);
  return { canceled: false, success: res.success, project };
}

export async function saveProject(
  project: IProject,
  filePath: string
): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    fs.writeFile(filePath, JSON.stringify(project), "utf-8", (err) => {
      resolve({ success: !err });
    });
  });
}

export async function openProjectFromFile(
  browserWindow
): Promise<{ canceled: boolean; success: boolean; project: IProject }> {
  let filePath;
  let canceled = false;
  const res = await dialog.showOpenDialog(browserWindow);
  canceled = res.canceled;
  filePath = res.filePaths[0];
  if (canceled) return { canceled: false, success: false, project: null };
  const response = await openProject(filePath);
  if (response.success) response.project.filePath = filePath;
  return { canceled: false, ...response };
}

export async function openProject(
  filePath: string
): Promise<{ success: boolean; project: IProject }> {
  return new Promise((resolve) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      resolve({ success: !err, project: err ? null : JSON.parse(data) });
    });
  });
}

export function saveSession(
  projects: Array<IProject>,
  currentProjectId: string,
  userDataPath: string,
) {
  fs.writeFileSync(
    path.join(userDataPath, "last_session"),
    JSON.stringify({ projects, currentProjectId })
  );
}

export function retrieveSession(userDataPath) {
  const filePath = path.join(userDataPath, "last_session");
  if (fs.existsSync(filePath)) {
    const projectsJSON = fs.readFileSync(filePath, "utf8");
    const { projects, currentProjectId } = JSON.parse(projectsJSON);
    return { projects, currentProjectId };
  }
  return { projects: [], currentProjectId: null };
}
