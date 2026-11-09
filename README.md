# DSA Quest: Code Academy

Learn it. Visualize it. Code it. Master it.

An independent, game-inspired learning space for UWI St. Augustine COMP 2611 — Data Structures, using C++.

## First release

- Command center with XP, a study streak, and saved progress.
- 14 topic tracks and 20 interactive lessons with code examples and retriable quiz checkpoints.
- Three visual labs: bubble sort, stack operations and binary search.
- Code Gym with seven sample-based C++ coding challenges, hints and instant feedback.
- C++ playground: source editor, stdin entry, stdout terminal, and an execution time limit.
- Virtual file workspace: create, edit, import and download files; save output; export and restore JSON project data.
- Responsive dark interface designed for desktop, tablet and mobile.

## Publish

Under the GitHub repository Settings → Pages, select Deploy from a branch, choose main and /(root), and Save. After Pages has been enabled and published, the expected URL is:

https://lano07.github.io/DSA-Quest_UWI/

Until Pages is enabled, that URL may not work. You can view index.html locally in a modern browser.

## C++ runner limits

The Run button uses the open-source JSCPP educational interpreter loaded from a CDN inside a Web Worker: https://github.com/felixhao28/JSCPP

Supported examples cover a subset of C++ such as simple arithmetic, arrays, loops, pointers, functions, recursion and standard input/output. A full compiler, modern STL, full standard libraries, fstream file access, multi-file builds and arbitrary OS filesystem operations are NOT supported yet. The terminal shows program output; it is not a full operating-system shell.

Virtual files live in browser local storage. They can be edited and downloaded, or their contents loaded as stdin. They are not available to C++ as actual files. The Code Gym currently checks sample output only, not a complete hidden test suite.

The interpreter requires a network connection to load. If the interpreter or Worker cannot load, the app reports an error. Progress is local to the browser, not synced across devices.

## Roadmap and references

The course map covers pointers and arrays, linked lists, stacks and queues, recursion, binary trees and search trees, heaps, hashing, graphs, graph algorithms, sorting and searching, complexity, and some additional mathematical theory. This release is a starting implementation rather than the full UWI course.

UWI COMP 2611 course information: https://sta.uwi.edu/fst/dcit/content/comp-2611

Planned later: deeper lesson packs, richer visualizers and editors, real sandboxed C++ project compilation, full file I/O and robust automated judge.

## Files

- index.html — page structure
- style.css — interface design
- app.js — content, visual labs, challenges and browser workspace

Independent project. Not affiliated with Codédex or The University of the West Indies.