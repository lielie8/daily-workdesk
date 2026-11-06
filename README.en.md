# Daily Workbench

**One thing at a time. A little room for everyday life.**

[中文说明](README.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

Daily Workbench is a small, local-first personal dashboard for study, tasks, rewards, and everyday life. The interface currently uses Chinese. It runs as a static website with plain HTML, CSS, and JavaScript—no package installation or build step required.

## What is inside

- **Today:** energy selection, a current task with a finish line and a resume point, two daily items, one-off or recurring errands, and upcoming deadlines within seven days.
- **This Week:** three weekly outcomes, an editable workload budget, tasks with priority/date/effort/next action, all important dates, and an inbox.
- **Rewards:** collect things you want to do, add notes, pick one at random, and mark it enjoyed. No points or streak requirements.
- **Projects:** goals, milestones, next actions, dates, results, and up to two active projects.
- **Roadmap:** editable stages for longer-term direction.
- **Wellbeing:** optional sleep, energy, activity, stress, and support notes.
- **Review:** three weekly reflection questions plus an optional monthly check-in.
- **Completion history:** automatic entries from completed tasks, checked-off errands and enjoyed rewards, plus manual notes and a seven-day overview.

## Themes

Swiss Signal, Bauhaus Play, Paper Editorial, 日常散步 (Everyday Stroll), and 蓝色来信 (Blue Letter). Theme selection is saved locally and applies across the dashboard.

## Run locally

```sh
git clone https://github.com/lielie8/daily-workdesk.git
cd daily-workdesk
python -m http.server 4173 --directory dist
```

Open [localhost:4173](http://localhost:4173). The example server requires Python; any static server can serve `dist/` instead.

## Storage and limitations

All app records use browser `localStorage`. There is no backend, account system, cloud synchronization, automatic backup, or in-app import/export. Clearing site data removes your records. Data is separate for each browser and origin, including different domains and ports. Your records are not uploaded to GitHub or the project author.

The app loads fonts from Google Fonts; system fonts are used as fallbacks. New installations do not include the author's personal exam dates or application timeline. The original storage key, `hui-workbench-v1`, remains for compatibility with existing users.

## Deploy

Publish the contents of `dist/` on any static host. The included `.openai/hosting.json` identifies the author's existing Sites project: create your own deployment configuration rather than reusing its project ID. A public code repository does not make the author's personal hosted dashboard publicly accessible.

## Design references

Everyday Stroll draws inspiration from the everyday atmosphere of [Hirayasumi](https://hirayasumi-anime.jp/). Blue Letter explores the cobalt color, italic typography, and paper-like composition of [Tonami & Ayano's wedding website](https://wedding.tonami-komuro.com/). Their illustrations, photography, logos, and source code are not included. This project is not affiliated with those websites. Fonts have their own licenses.

The source filenames `workdesk.js` and `workdesk.css` are retained from earlier versions. The project name is **Daily Workbench**.

## License

[MIT](LICENSE) · Created by [lielie8](https://github.com/lielie8).
