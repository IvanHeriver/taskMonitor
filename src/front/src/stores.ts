import {Writable, writable} from "svelte/store"
import type { tmProject } from "./types"

export const projects: Writable<Array<tmProject>> = writable([])

// export const projID: Writable<number> = writable(null)

