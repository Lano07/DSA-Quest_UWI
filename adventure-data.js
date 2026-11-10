/* DSA Quest original interactive adventure course content */
window.DSAAdventureData = {
  "chapters": [
    {
      "id": "spark",
      "name": "The First Spark",
      "subtitle": "Make the console talk",
      "scene": "🌱",
      "tint": "#85e6c2",
      "items": [
        "hello",
        "sum",
        "parity",
        "digits"
      ]
    },
    {
      "id": "array",
      "name": "Array Orchard",
      "subtitle": "Every index hides a clue",
      "scene": "🍒",
      "tint": "#ffcf70",
      "items": [
        "maximum",
        "reverse",
        "array-sum",
        "left-rotate",
        "second-largest"
      ]
    },
    {
      "id": "memory",
      "name": "Memory Meadow",
      "subtitle": "Follow addresses and links",
      "scene": "🧩",
      "tint": "#c5a9ff",
      "items": [
        "ptr-value",
        "ptr-swap",
        "list-head",
        "list-traverse"
      ]
    },
    {
      "id": "recursion",
      "name": "Recursion Ruins",
      "subtitle": "A problem inside a problem",
      "scene": "🌀",
      "tint": "#a4cdfc",
      "items": [
        "factorial",
        "fibonacci",
        "power",
        "count"
      ]
    },
    {
      "id": "stack",
      "name": "Stack City",
      "subtitle": "Control the order of operations",
      "scene": "🏙️",
      "tint": "#ffadb7",
      "items": [
        "stack-push",
        "queue-peek",
        "queue-ops",
        "bracket-count"
      ]
    },
    {
      "id": "tree",
      "name": "Tree Temple",
      "subtitle": "Branch out, then find your way",
      "scene": "🌳",
      "tint": "#95e6a5",
      "items": [
        "tree-inorder",
        "heap-index",
        "heap-maximum"
      ]
    },
    {
      "id": "hash",
      "name": "Hash Harbor",
      "subtitle": "Find a home for every key",
      "scene": "⚓",
      "tint": "#ffd49d",
      "items": [
        "hash-buckets",
        "hash-collisions"
      ]
    },
    {
      "id": "search",
      "name": "Algorithm Arena",
      "subtitle": "Find, sort and optimize",
      "scene": "⚔️",
      "tint": "#ffb9e7",
      "items": [
        "linear",
        "binary-search",
        "gcd",
        "bubble-code",
        "selection-code"
      ]
    },
    {
      "id": "graph",
      "name": "Graph Gate",
      "subtitle": "Connect the scattered islands",
      "scene": "🪐",
      "tint": "#9adff9",
      "items": [
        "graph-degree",
        "edge-count",
        "graph-bfs"
      ]
    },
    {
      "id": "matrix",
      "name": "Matrix Observatory",
      "subtitle": "Read the grid as a structure",
      "scene": "🔭",
      "tint": "#b1d5ff",
      "items": [
        "matrix-diagonal"
      ]
    }
  ],
  "extras": [
    {
      "id": "ptr-value",
      "title": "The Secret Address",
      "category": "Pointers",
      "desc": "Change x from 8 to 21 through a pointer and print x.",
      "input": "",
      "expected": "21",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 8;\n  int* p = &x;\n  // TODO: change x to 21 using p\n  cout << x;\n  return 0;\n}\n",
      "hint": "Use *p to access the value stored at the address in p.",
      "tests": []
    },
    {
      "id": "ptr-swap",
      "title": "Switch the Portals",
      "category": "Pointers",
      "desc": "Read two integers. Use pointers to swap them, then print the numbers in their new order.",
      "input": "3 9",
      "expected": "9 3",
      "starter": "#include <iostream>\nusing namespace std;\n\nvoid swapValues(int* a, int* b) {\n  // TODO: swap the values using *a and *b\n}\nint main() {\n  int a, b; cin >> a >> b;\n  swapValues(&a, &b);\n  cout << a << \" \" << b;\n  return 0;\n}\n",
      "hint": "Store *a temporarily before assigning *a = *b.",
      "tests": [
        {
          "input": "-5 2",
          "expected": "2 -5"
        },
        {
          "input": "8 8",
          "expected": "8 8"
        }
      ]
    },
    {
      "id": "list-head",
      "title": "The New Head",
      "category": "Linked lists",
      "desc": "A list contains 4 → 7 → 9. Print 2 → 4 → 7 → 9 after inserting 2 at the head, using array-based node links.",
      "input": "",
      "expected": "2 4 7 9",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int value[4] = {4, 7, 9, 2};\n  int next[4] = {1, 2, -1, 0};\n  int head = 0;\n  // TODO: change head to the new node (index 3)\n  // TODO: traverse using next until -1\n  return 0;\n}\n",
      "hint": "Set head = 3; then use for(int i=head; i!=-1; i=next[i]) to traverse.",
      "tests": []
    },
    {
      "id": "list-traverse",
      "title": "Follow the Lanterns",
      "category": "Linked lists",
      "desc": "Given node values and next-index pointers, traverse from head 2 and print each value with a space between items.",
      "input": "",
      "expected": "30 10 20",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int value[3] = {10,20,30};\n  int next[3] = {1,-1,0};\n  int head = 2;\n  // TODO: follow next[] from head until -1\n  return 0;\n}\n",
      "hint": "Start at head=2, then follow next[2]=0, next[0]=1, next[1]=-1.",
      "tests": []
    },
    {
      "id": "stack-push",
      "title": "Last In, First Out",
      "category": "Stacks",
      "desc": "Read three integers pushed onto a stack. Pop and print them in reverse insertion order.",
      "input": "2 6 9",
      "expected": "9 6 2",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int stack[3];\n  for(int i=0;i<3;i++)cin>>stack[i];\n  // TODO: pop from the top (index 2) to the bottom\n  return 0;\n}\n",
      "hint": "A for loop with i=2; i>=0; i-- reads the stack from top to bottom.",
      "tests": [
        {
          "input": "4 0 -3",
          "expected": "-3 0 4"
        }
      ]
    },
    {
      "id": "queue-ops",
      "title": "The Waiting Line",
      "category": "Queues",
      "desc": "Read four numbers arriving in a queue. Dequeue the front item, and print the three remaining values in their original order.",
      "input": "5 7 9 11",
      "expected": "7 9 11",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int q[4]; for(int i=0;i<4;i++) cin>>q[i];\n  // TODO: remove front by advancing front index\n  return 0;\n}\n",
      "hint": "The front starts at index 0; after dequeue, it becomes index 1.",
      "tests": [
        {
          "input": "-1 3 6 8",
          "expected": "3 6 8"
        }
      ]
    },
    {
      "id": "tree-inorder",
      "title": "The Sorted Spell",
      "category": "Trees",
      "desc": "The BST has seven sorted keys: 1 2 3 4 5 6 7. Print the inorder traversal using the array representation (root index 0).",
      "input": "",
      "expected": "1 2 3 4 5 6 7",
      "starter": "#include <iostream>\nusing namespace std;\n\nvoid inorder(int a[],int i,int n) {\n  if(i>=n) return;\n  // TODO: visit left child, root, right child\n}\nint main() {\n  int tree[7]={4,2,6,1,3,5,7};\n  inorder(tree,0,7);\n  return 0;\n}\n",
      "hint": "For zero-based tree indexes: left=2*i+1, right=2*i+2. Visit left, print a[i], visit right.",
      "tests": []
    },
    {
      "id": "heap-index",
      "title": "The Parent Portal",
      "category": "Heaps",
      "desc": "Read the index of a heap node (at least 1). Print its parent's index in a zero-based array heap.",
      "input": "5",
      "expected": "2",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i; cin>>i;\n  // TODO: print the parent's index\n  return 0;\n}\n",
      "hint": "For zero-based indexing, parent = (i - 1) / 2 using integer division.",
      "tests": [
        {
          "input": "1",
          "expected": "0"
        },
        {
          "input": "14",
          "expected": "6"
        }
      ]
    },
    {
      "id": "heap-maximum",
      "title": "The Crown of the Heap",
      "category": "Heaps",
      "desc": "Read five values that form a valid max heap, and print the maximum. The root is at index 0.",
      "input": "30 17 24 4 8",
      "expected": "30",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int heap[5];\n  for(int i=0;i<5;i++) cin>>heap[i];\n  // TODO: print the largest value in a max heap\n  return 0;\n}\n",
      "hint": "The maximum is always at heap[0].",
      "tests": [
        {
          "input": "50 49 40 1 2",
          "expected": "50"
        }
      ]
    },
    {
      "id": "hash-collisions",
      "title": "Collision Alert!",
      "category": "Hashing",
      "desc": "Read four nonnegative keys. Hash them into seven buckets with key%7. Print how many keys collide with an earlier key.",
      "input": "3 10 8 17",
      "expected": "2",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int used[7]={0};\n  int collisions=0, key;\n  for(int i=0;i<4;i++){\n    cin>>key;\n    int bucket=key%7;\n    // TODO: count collisions and mark bucket used\n  }\n  cout<<collisions;\n  return 0;\n}\n",
      "hint": "If used[bucket] is already 1, increase collisions. Then set used[bucket]=1.",
      "tests": [
        {
          "input": "1 2 3 4",
          "expected": "0"
        },
        {
          "input": "0 7 14 21",
          "expected": "3"
        }
      ]
    },
    {
      "id": "graph-bfs",
      "title": "Cross the Islands",
      "category": "Graphs",
      "desc": "Traverse the fixed graph from vertex 0 with BFS and visit neighbors in increasing index order. Print each visited vertex.",
      "input": "",
      "expected": "0 1 2 3 4",
      "starter": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int adj[5][5]={{0,1,1,0,0},{1,0,0,1,0},{1,0,0,0,1},{0,1,0,0,0},{0,0,1,0,0}};\n  int visited[5]={0},queue[5],front=0,back=0;\n  visited[0]=1;queue[back++]=0;\n  // TODO: while queue not empty, visit front and enqueue unseen neighbors\n  return 0;\n}\n",
      "hint": "while(front<back), pop queue[front++] and scan neighbors v=0..4; mark visited before enqueueing.",
      "tests": []
    }
  ],
  "meta": {
    "hello": {
      "story": "An abandoned terminal waits for its first message.",
      "teach": "C++ sends text to the terminal through cout. A string literal is wrapped in double quotes. Finish the message, then press Run.",
      "snippet": "cout << \"DSA Quest\";",
      "task": "Make the terminal print exactly DSA Quest.",
      "tip": "Be careful about capitalization and extra words."
    },
    "sum": {
      "story": "Two code crystals need combining.",
      "teach": "Use cin to read values, and cout to print a calculation. C++ evaluates a+b before writing the result.",
      "snippet": "cin >> a >> b; cout << a+b;",
      "task": "Read two numbers, add them, and print the total.",
      "tip": "Use integers; you don't need extra formatting."
    },
    "parity": {
      "story": "The gate opens only for an even-numbered token.",
      "teach": "The remainder operator % gives what's left after division. If n%2==0, n is even. Otherwise it's odd.",
      "snippet": "if(n%2==0) cout << \"EVEN\";",
      "task": "Print EVEN or ODD in uppercase.",
      "tip": "The number zero is even; negative odd values remain odd."
    },
    "digits": {
      "story": "A vault counts digits, not the numeric value.",
      "teach": "Divide an integer by 10 repeatedly to remove one last digit per step. Zero needs special treatment: it contains one digit.",
      "snippet": "while(n!=0){digits++;n/=10;}",
      "task": "Print a number's decimal digit count.",
      "tip": "Handle negative values and 0 before counting."
    },
    "maximum": {
      "story": "Search the orchard for the biggest fruit.",
      "teach": "A single pass can maintain the largest value seen so far. Start from a[0] so negative arrays work correctly.",
      "snippet": "int best=a[0];",
      "task": "Read five integers and report the maximum.",
      "tip": "Starting best at 0 fails on all-negative arrays."
    },
    "reverse": {
      "story": "The orchard path must be read backward.",
      "teach": "Arrays use zero-based indexes. The last position of five items is 4; loop toward 0 to reverse their order.",
      "snippet": "for(int i=4;i>=0;i--) /*...*/",
      "task": "Print the five entries in reverse.",
      "tip": "Avoid an extra value or missing final element."
    },
    "array-sum": {
      "story": "Collect every crystal from the five slots.",
      "teach": "Accumulation uses a running total, starting at 0, and one addition per element. This takes O(n) time.",
      "snippet": "int total=0;",
      "task": "Read five integers and print their sum.",
      "tip": "Use a loop and add the latest input each time."
    },
    "left-rotate": {
      "story": "A carousel shifts its first seat to the end.",
      "teach": "Rotation differs from sorting: preserve relative order while moving the first element to the last position.",
      "snippet": "int first=a[0];",
      "task": "Perform one left rotation.",
      "tip": "Remember to save the value at index 0 before shifting."
    },
    "second-largest": {
      "story": "Only the runner-up earns the key.",
      "teach": "The largest and second-largest values can be tracked separately. This mission guarantees distinct integers, so no tie logic is needed.",
      "snippet": "// track first and second",
      "task": "Print the second-largest of five distinct integers.",
      "tip": "Negative values still count: don't initialize to zero."
    },
    "ptr-value": {
      "story": "A pointer is the key to another memory cell.",
      "teach": "The & operator obtains an address; * dereferences that address to access the value. Assigning *p changes x itself.",
      "snippet": "int *p=&x; *p=21;",
      "task": "Change x using the pointer, not by assigning x directly.",
      "tip": "The star in *p means 'the value at this address'."
    },
    "ptr-swap": {
      "story": "Two portals must exchange what they hold.",
      "teach": "Passing pointer parameters lets a function update values owned by its caller. Temporarily save one value before overwriting it.",
      "snippet": "int temp=*a;",
      "task": "Swap two integers by manipulating pointers.",
      "tip": "Remember to call swapValues(&a,&b)."
    },
    "list-head": {
      "story": "A lantern chain has a new first node.",
      "teach": "A linked list is connected by next links. In this exercise, integer indexes act like addresses, and -1 is the null link.",
      "snippet": "next[3]=head; head=3;",
      "task": "Attach node 3 before the old head.",
      "tip": "Traversal begins at head, not index 0."
    },
    "list-traverse": {
      "story": "Follow the lanterns; the numbers aren't stored in visit order.",
      "teach": "Each node holds a value and a link to the next node. Never assume array order matches linked-list order.",
      "snippet": "i=next[i];",
      "task": "Traverse until the null link -1.",
      "tip": "The head begins at index 2."
    },
    "factorial": {
      "story": "The tower of recursion rises one frame at a time.",
      "teach": "A recursive function must stop at a base case. Factorial uses n!=n×(n-1)! with 0!=1.",
      "snippet": "if(n<=1)return 1;",
      "task": "Write the recursive return expression.",
      "tip": "Each call waits for the next, so recursion uses stack memory."
    },
    "fibonacci": {
      "story": "The same small question appears again and again.",
      "teach": "Fibonacci adds the previous two terms. Recursion is a natural expression, though naive Fibonacci recalculates values and is slow for large n.",
      "snippet": "return fib(n-1)+fib(n-2);",
      "task": "Handle two base cases, then recurse.",
      "tip": "For n=0 and n=1, return n directly."
    },
    "power": {
      "story": "The altar multiplies a value repeatedly.",
      "teach": "b^0=1. For e>0, multiplying b by b^(e-1) reduces the problem size each call.",
      "snippet": "return b*power(b,e-1);",
      "task": "Calculate the exponent through recursion.",
      "tip": "An exponent of zero always returns 1, even if b is zero in this exercise."
    },
    "count": {
      "story": "The sensor only registers positive energy.",
      "teach": "Use a counter with a condition inside a loop. Test x>0, not x>=0.",
      "snippet": "if(x>0)count++;",
      "task": "Count only the positive integers.",
      "tip": "Zero is not positive."
    },
    "stack-push": {
      "story": "The most recently placed box must leave first.",
      "teach": "A stack follows LIFO: last in, first out. The top of a simple array stack is its last used index.",
      "snippet": "for(int i=top;i>=0;i--)",
      "task": "Print the popped sequence.",
      "tip": "Start from index 2 for three elements."
    },
    "queue-peek": {
      "story": "The oldest customer receives service first.",
      "teach": "Queues are FIFO: first in, first out. The front is the earliest inserted item, the rear the latest.",
      "snippet": "cout<<q[0]<<\" \"<<q[3];",
      "task": "Print the front and rear.",
      "tip": "This exercise doesn't actually remove an item."
    },
    "queue-ops": {
      "story": "One passenger leaves the station.",
      "teach": "Dequeue advances the front position, not the rear. In an array queue, you can simply skip the removed slot.",
      "snippet": "front++;",
      "task": "Print all items except the first.",
      "tip": "Keep the remaining three in arrival order."
    },
    "bracket-count": {
      "story": "The tunnel's nesting depth changes as you pass doors.",
      "teach": "A stack-like counter increases on '(' and decreases on ')'. If depth ever drops below zero, the expression is invalid.",
      "snippet": "depth++; // on '('",
      "task": "Print maximum nesting depth or -1.",
      "tip": "The final depth must be zero for a valid sequence."
    },
    "tree-inorder": {
      "story": "The ancient tree reveals sorted inscriptions.",
      "teach": "Inorder traversal visits left subtree, current node, then right subtree. In a binary search tree, that prints keys in order.",
      "snippet": "inorder(a,2*i+1,n);",
      "task": "Implement recursive inorder on an array-backed tree.",
      "tip": "Recursion needs an index bounds check."
    },
    "heap-index": {
      "story": "Every heap node has a parent except the root.",
      "teach": "A binary heap is stored compactly in an array. In zero-based indexing, the parent of i>0 is floor((i-1)/2).",
      "snippet": "(i-1)/2",
      "task": "Print the parent index.",
      "tip": "Integer division in C++ discards the fractional part."
    },
    "heap-maximum": {
      "story": "The crown sits at the root of a max heap.",
      "teach": "A max heap maintains parent ≥ children. Its maximum is always the root, which is array index zero.",
      "snippet": "cout<<heap[0];",
      "task": "Print the maximum without sorting.",
      "tip": "This relies on the input being a valid max heap."
    },
    "hash-buckets": {
      "story": "The harbor chooses a dock for each package.",
      "teach": "A simple hash function maps integer keys to bucket numbers. key%7 creates a bucket from 0 to 6; collisions are normal.",
      "snippet": "int bucket=key%7;",
      "task": "Compute every key's bucket index.",
      "tip": "Different keys can land at the same bucket."
    },
    "hash-collisions": {
      "story": "Multiple ships arrive at the same dock.",
      "teach": "Once a bucket has been used, another key mapping there creates a collision. A real table handles that with chaining or probing.",
      "snippet": "if(used[bucket]) collisions++;",
      "task": "Count repeated uses of the same bucket.",
      "tip": "Even the third key in an occupied bucket counts as another collision."
    },
    "linear": {
      "story": "A missing artifact could be anywhere in the list.",
      "teach": "Linear search checks each item from left to right. Its worst-case runtime is O(n); it doesn't require sorted input.",
      "snippet": "if(a[i]==target)",
      "task": "Return the index of the first match, or -1.",
      "tip": "Stop at the first match."
    },
    "binary-search": {
      "story": "The archive is already sorted, so use that advantage.",
      "teach": "Binary search compares the target with the middle, then discards half of the remaining values. It runs in O(log n).",
      "snippet": "mid=(left+right)/2;",
      "task": "Search the seven sorted values.",
      "tip": "When target>middle, set left=mid+1."
    },
    "gcd": {
      "story": "Two gears must lock into their largest shared tooth.",
      "teach": "Euclid's algorithm repeats (a,b) ← (b,a%b) until b becomes 0. Then a is their greatest common divisor.",
      "snippet": "int r=a%b; a=b; b=r;",
      "task": "Use remainders until the answer remains.",
      "tip": "Don't forget to update both values each loop."
    },
    "bubble-code": {
      "story": "Reorder scattered symbols by comparing neighbors.",
      "teach": "Bubble sort swaps adjacent out-of-order entries. After each full pass, the largest unsorted item settles at the end.",
      "snippet": "if(a[j]>a[j+1])",
      "task": "Sort five numbers in ascending order.",
      "tip": "Your inner loop gets shorter after each pass."
    },
    "selection-code": {
      "story": "Choose the smallest unclaimed token each round.",
      "teach": "Selection sort finds the minimum in the unsorted suffix and swaps it into the next sorted position. Worst case: O(n²).",
      "snippet": "int minIndex=i;",
      "task": "Sort five numbers by repeatedly selecting a minimum.",
      "tip": "Do not lose the minimum's index."
    },
    "graph-degree": {
      "story": "How many bridges reach the first island?",
      "teach": "An undirected graph's adjacency matrix stores a 1 for each edge. A vertex's degree equals its row sum.",
      "snippet": "degree += adj[0][j];",
      "task": "Count vertex zero's neighbors.",
      "tip": "Read the entire 4×4 matrix first."
    },
    "edge-count": {
      "story": "Each bridge appears twice in the map.",
      "teach": "For an undirected adjacency matrix, an edge appears in both a[i][j] and a[j][i]. Count one triangle to avoid duplicates.",
      "snippet": "if(i<j) ...",
      "task": "Count the number of undirected edges.",
      "tip": "Ignore the diagonal; the graph has no self-loops."
    },
    "graph-bfs": {
      "story": "A rescue team must visit the closest islands first.",
      "teach": "BFS uses a queue and marks neighbors visited before enqueueing. It explores vertices layer by layer.",
      "snippet": "while(front<back){...}",
      "task": "Implement BFS on the fixed five-vertex graph.",
      "tip": "Scan adjacency-matrix columns in ascending order."
    },
    "matrix-diagonal": {
      "story": "The telescope tracks a diagonal pattern.",
      "teach": "The main diagonal of a square matrix contains entries a[i][i]. Its sum takes one read per row: O(n).",
      "snippet": "sum+=a[i][i];",
      "task": "Sum the three diagonal entries.",
      "tip": "Ignore the off-diagonal numbers."
    }
  },
  "version": 2
};
