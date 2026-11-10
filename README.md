# DSA Quest · The Structure Isles

An original illustrated C++ adventure for independent study alongside **UWI St. Augustine COMP 2611**.

**Play:** https://lano07.github.io/DSA-Quest_UWI/

Meet Pip, a hummingbird guide, and restore the beacons of ten floating islands. The home screen is the playable chapter map. There are no accounts, payments, artificial time limits on learning, or locked chapters.

The pixel-world update replaces the inherited sidebar with a compact horizontal navigation bar. On phones the tabs stay in one swipeable row with 48-pixel touch targets. Original 16-bit-style scenery, ten detailed island sprites, pixel characters, stepped animation and game panels carry through the map, missions, guardians and visualizers. Selecting an island on a narrow screen brings its missions into view, with a return-to-island control.

## The adventure

- **35 missions**, each with three short steps: Discover → Predict → Build. Each has a distinct checkpoint, hints, reference solution, C++ editor, stdin and terminal.
- **Run code** experiments with your input without grading. **Check mission** runs the sample plus any extra cases, awards **40 XP once**, lights the beacon, and enables the next mission.
- **10 guardian battles** with three rounds, shield damage, hearts, explanations, replay, and a **100 XP first-victory reward**. Win all three rounds to collect the relic. The original ten-question Code Hydra remains available from Guardians.
- **20 collectibles:** ten chapter badges and ten guardian relics. The map shows completion and the collection shelf shows what remains.
- **Tinker Grove:** manipulate arrays, linked lists, stacks, queues, BSTs, max heaps, hash tables, graphs and bubble sort. Load your values, insert/remove, undo, toggle graph edges and step through BFS/DFS or sorting. The original **14 guided algorithm tours** remain available.
- **Practice arena:** all **24 coding challenges** remain available with a separate first-solve reward.
- **Field guide:** all **61 theory lessons across 14 tracks**, plus the course roadmap, are retained.
- **Independent playground:** experiment outside the course, maintain virtual files, import/download text files, and back up or restore progress and projects.

Every island is a keyboard-accessible button. Mobile layouts use a two-column island trail and stacked lesson/editor panels; a compact list view is also available. Controls have focus indicators, editors allow Tab to leave, feedback uses status announcements, and motion respects `prefers-reduced-motion`.

## C++ execution: what is actually available

The public GitHub Pages site runs a **bundled JSCPP interpreter in a Web Worker**. It does **not** host GCC, a compiler API, or Docker. No code is sent to a third-party execution service in browser mode.

| Browser mode, available on the public site | Optional local compiler |
| --- | --- |
| Educational C++ subset: basic I/O, functions, arrays, pointers, loops | Native C++17 with GCC in Docker |
| One source file; no general STL, `fstream`, or multi-file build | STL, multiple `.cpp` files, `ifstream`/`ofstream` |
| Virtual files are browser text records; `input.txt` can be loaded into stdin | Imported virtual files are copied into a temporary compilation workspace |
| 10-second worker deadline; 100,000-character output cap | Four-second program deadline, restricted container resources |

JSCPP is not a standards-complete compiler. Some numeric edge cases, including negative integer division, differ from native C++. The provided reference solutions are checked against both JSCPP and native C++17. Use native C++ when exact language behavior matters.

Passing a finite set of output checks is not proof of algorithmic correctness. The judge does not enforce a particular data structure or detect hard-coded outputs. Linked-list and tree browser missions deliberately use array-based links; pointer-based nodes and dynamic allocation are taught in the field guide and can be explored with the full compiler.

To use the full compiler, follow [backend/README.md](backend/README.md):

```sh
docker pull gcc:14
node backend/server.mjs
```

Open **http://127.0.0.1:8787**. The app selects the local compiler on that address. Docker is required for compilation but not for serving the pages; choose **Use browser** to run JSCPP there without Docker. The server binds only to loopback and must not be published to the internet. Programs see only imported virtual files, not arbitrary host files.

The public playground can also use a trusted HTTPS endpoint implementing the documented API. No such endpoint is supplied or deployed with this project.

## Save and resume

Files, code, checkpoints, XP, badges and relics are stored in this browser under the existing `dsa-quest-uwi-v1` key. Existing progress is preserved. Nothing syncs between devices or origins. Clearing browser data removes progress unless you export a backup first.

Use **Playground → Backup files + XP** before moving devices or clearing storage, then **Restore backup** on the destination. The backup includes the new mission steps and guardian victories. Code sent to a configured full compiler is processed at that endpoint.

## Run and test

Use Node 20.11+ (Node 22 in CI). Serve over HTTP; opening `index.html` as a `file://` URL cannot start the interpreter worker.

```sh
node tests/smoke.mjs
node tests/adventure-smoke.mjs
node tests/studio.mjs
node tests/cpp-missions.mjs
node tests/runner.mjs
node tests/backend.mjs
node tests/native-cpp.mjs
```

The native test requires `g++` on PATH and writes ignored artifacts to `.test-work/`. Tests exercise real interpreter output and C++17 compilation, Run versus Check, sample/extra-case failure, repeat rewards, checkpoint progression, restored progress, stale execution, guardian wins/losses, structure invariants, input validation, worker limits, and local HTTP asset delivery. These are automated model/HTTP tests, not a replacement for browser layout or assistive-technology testing. Docker execution/file I/O requires a separate environment with Docker installed.

## Publishing

`.github/workflows/pages.yml` runs the checks and publishes only the static website and bundled interpreter on pushes to `main`. The backend and test sources are excluded from the Pages artifact. Select **GitHub Actions** as the Pages source if setting up a fresh fork.

The deployed [`version.json`](https://lano07.github.io/DSA-Quest_UWI/version.json) reports the exact source commit. A successful source push alone is not deployment verification; check the Pages workflow and this manifest.

## Course and design references

The [public COMP 2611 description](https://sta.uwi.edu/fst/dcit/content/comp-2611) names stacks, queues, linked lists, binary trees, heaps and graphs. Additional material is enrichment; use your lecturer’s current syllabus for assessment scope.

The public [Codédex course experience](https://www.codedex.io/python) and [public product update](https://www.codedex.io/blog/codedex-update-december-2024) informed the illustrated world, exercise-first pacing and immediate feedback. Pip, the islands, guardians, story and interface artwork are original. The landscape and island atlas were generated specifically for this project; the character sprites and interface use SVG/CSS. See [artwork notes](assets/README.md). No Codédex logos, artwork or protected lesson text are included.

Independent project, not affiliated with UWI or Codédex. JSCPP is MIT-licensed; its unmodified distribution, revision, checksum and license are documented in [vendor/README.md](vendor/README.md).
