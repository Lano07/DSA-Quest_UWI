# Full C++ runner (optional)

**The GitHub Pages version works without this server**, using the JSCPP browser interpreter for basic C++. To compile full C++17, use the STL and read/write virtual workspace files with \`fstream\`, run this optional **local** service.

## Requirements

- Node.js 20 or newer
- Docker Desktop or Docker Engine
- Around 1 GB free disk space for the GCC image

## Start

From the repository root:

\`\`\`bash
docker pull gcc:14
node backend/server.mjs
\`\`\`

Open **http://127.0.0.1:8787**. The site automatically switches to the full C++ runner here. Your C++ files from the browser's virtual workspace are mounted into an isolated temporary directory. A program can read \`input.txt\` using \`std::ifstream\` and write \`result.txt\` using \`std::ofstream\`. After execution the server returns resulting text files to the workspace. Multiple \`.cpp\` files are compiled together with \`g++ -std=c++17\`.

This server **does not** give programs access to arbitrary files on your real computer. Files must first be added to the workspace using Import/New file. That protects your computer and is the intended behavior.

The local runner has a four-second program time limit, 384 MB container memory limit, disabled networking and a two-job concurrency cap. Compiler output and program output are limited. Docker containers reduce risk but are not a fully hardened sandbox. **Do not expose this server to the public internet**, including by forwarding the port or changing the host binding. For a hosted mobile/tablet full compiler, use a professionally managed, secured code-execution service instead. The public Piston endpoint now requires authorization and cannot be assumed available.

Use **Settings → C++ execution mode** in the playground to configure an alternative *trusted* HTTPS execution endpoint offering the same \`POST /api/run\` JSON contract if you set one up.
