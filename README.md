# DSA Quest: Code Academy

A game-inspired, responsive **C++ Data Structures & Algorithms academy** built for independent study alongside **UWI St. Augustine COMP 2611**. No payment, account or login is needed.

## What you can do

- Learn through **61 guided lessons** in **14 tracks**, from basic C++, pointers, linked lists and recursion to trees, BST/AVL trees, heaps, hashing, BFS/DFS, Dijkstra, sorting, matrices, algorithm analysis and proofs. Each lesson has an example, a question, feedback and XP.
- Explore **14 interactive visual labs**. Move one step at a time or use auto-play. Labs include pointer-based lists, queue operations, stack operations, recursion, heaps, hashing, trees, BFS/DFS, Dijkstra and sorting.
- Fight the **Code Hydra**, a ten-question boss battle drawing from all lesson tracks, with three hearts and a first-win XP reward.
- Work through **24 C++ coding missions** with hints, sample I/O, a code editor, an output terminal, automatic checks and extra cases for recent missions.
- Use the **Playground** to edit C++, provide standard input, maintain several virtual files, import text files, export a backup, and keep progress and XP in browser storage.
- Connect the **optional local full C++17 compiler** for STL, multiple .cpp files, and real `std::ifstream`/`std::ofstream` I/O with files in the virtual workspace.

## Start now

Open `index.html` in a browser, or use the GitHub Pages deployment when enabled:

**https://lano07.github.io/DSA-Quest_UWI/**

If the site returns 404, open **GitHub → Repository Settings → Pages → Build and deployment → Source: GitHub Actions**. The included deployment workflow publishes from the main branch. Wait for the "Publish DSA Quest to GitHub Pages" action to finish.

The browser interpreter is **JSCPP**, an educational subset of C++, loaded when you first run code. It does **not** compile general C++17, STL, multiple files or `fstream`. Do not confuse passing a small sample with a complete program correctness proof.

### Full C++17 and file I/O (optional)

Read [backend/README.md](backend/README.md). Install Docker and Node.js, then:

```bash
docker pull gcc:14
node backend/server.mjs
```

Visit **http://127.0.0.1:8787** for the full C++ playground. Virtual files are copied into an isolated temporary working directory and returned after execution; the program **cannot access arbitrary host files**. The server is local-only and should not be publicly exposed. GitHub Pages cannot run a server by itself.

## Quality checks

With Node.js 20+:

```bash
node --check app.js
node --check backend/server.mjs
node tests/smoke.mjs
```

These are structural smoke checks, not an end-to-end browser or Docker runtime test.

## Course mapping

Based on the public [UWI St. Augustine COMP 2611 course description](https://sta.uwi.edu/fst/dcit/content/comp-2611), which specifically names stacks, queues, linked lists, binary trees, heaps and graphs. Topics such as Dijkstra, AVL trees, advanced sorting and special matrices provide deeper study; use your current lecturer's notes and semester syllabus for exact assessment scope.

**Independent project:** not affiliated with Codédex or UWI. Its game-based format is original rather than a copy of Codédex's artwork, branding or assets.

## Privacy & data

Progress and workspace text are stored in the browser's localStorage, not on an account. Clearing browser storage removes them unless you export the project first. Code run by the in-browser interpreter stays local except that the interpreter script is fetched from the CDN. Full C++ code and virtual files are sent to the compiler endpoint you configure.
