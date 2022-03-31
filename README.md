# Task Monitor

## Roadmap

The following features should be implemented:

- mutlitple tabs, for mutliple projects
- a task object which has a date, a time, a duration, a title, a description, tags
- anything of a task can be edited
- default values must be provided for every thing except title, description and tags
- a tag has a name, a color, an optional description
- tags can be created on the fly when adding them to a task
- tags can be added by simply typing the first letters
- tags can be manage (deleted, renamed, color, description) in a separate sections
- tags can be imported from other projects and even copy past (with multi selection) from another project tab
- a project is defined with a title, an option description, an option total duration, a creation date and time, a last update date and time, total time spent, remaining time (if total duration is provided)
- a timer section with a timer (start, stop, reset, pause, timestamp), a log of all that happen, selection of one or more log items to add a new task with the duration of the selected log items.

Additional feature could be:

- adding comments to tasks
- stats by tags

## Code structure

A project has the following attributes:
- name
- description
- filePath
- state
- tasks
- tags
- timer

# Original boilerplate

## Development

Install all the dependencies:

```bash
yarn install
```

I run two shell in parrallel: one for the front end and another one for electron

Front end (svelte)

```bash
npm run dev-front
```

Electron

```bash
npm run dev-electron
```

## Distribute

```bash
npm run dist
```
