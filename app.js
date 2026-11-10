(function () {
'use strict';
const $ = s => document.querySelector(s);
const app = $('#app');
const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storeKey = 'dsa-quest-uwi-v1';
const defaultCode = '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DSA Quest!" << endl;\n    return 0;\n}\n';
let state;
try {state = JSON.parse(localStorage.getItem(storeKey)) || {};} catch (_) {state = {};}
state.xp = Number(state.xp) || 0;
state.done = state.done && typeof state.done === 'object' ? state.done : {};
state.solved = state.solved && typeof state.solved === 'object' ? state.solved : {};
state.files = state.files && typeof state.files === 'object' ? state.files : {'main.cpp':defaultCode,'input.txt':'5\n','output.txt':''};
state.files['main.cpp'] = typeof state.files['main.cpp'] === 'string' ? state.files['main.cpp'] : defaultCode;
state.activeFile = state.files[state.activeFile] == null ? 'main.cpp' : state.activeFile;
state.stdin = typeof state.stdin === 'string' ? state.stdin : '';
state.lastDay = state.lastDay || '';
state.streak = Number(state.streak) || 0;
state.practiceCode = state.practiceCode && typeof state.practiceCode === 'object' ? state.practiceCode : {};
function save(){try{localStorage.setItem(storeKey,JSON.stringify(state));}catch(_){toast('Browser storage is full. Export your work.');} updateHUD();}
function dayKey(d){return d.toLocaleDateString('en-CA');}
function award(points){const today=dayKey(new Date());if(state.lastDay!==today){const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);state.streak=state.lastDay===dayKey(yesterday)?state.streak+1:1;state.lastDay=today;}state.xp+=points;save();toast('+'+points+' XP earned ✦');}
function updateHUD(){$('#xpTop').textContent=state.xp;$('#streakTop').textContent=state.streak;}
let toastTimer;
function toast(msg){const e=$('#toast');e.textContent=msg;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2600);}
const modules=[
{id:'foundations',name:'C++ foundations',icon:'01',tag:'START HERE',blurb:'Variables, loops, arrays and the building blocks of algorithmic thinking.'},
{id:'memory',name:'Pointers & memory',icon:'02',tag:'CORE',blurb:'Addresses, pointers, heap memory, new and delete.'},
{id:'lists',name:'Linked lists',icon:'03',tag:'CORE',blurb:'Nodes, traversal, insertion and deletion.'},
{id:'recursion',name:'Recursion',icon:'04',tag:'CORE',blurb:'Base cases, recursive steps and the call stack.'},
{id:'stacks',name:'Stacks & queues',icon:'05',tag:'CORE',blurb:'LIFO, FIFO and their array and linked implementations.'},
{id:'trees',name:'Binary trees',icon:'06',tag:'CORE',blurb:'Roots, leaves, height and traversal orders.'},
{id:'bst',name:'Binary search trees',icon:'07',tag:'CORE',blurb:'Search, insertion, deletion and complexity.'},
{id:'heaps',name:'Heaps',icon:'08',tag:'CORE',blurb:'Priority queues, heapify and heap sort.'},
{id:'hash',name:'Hash tables',icon:'09',tag:'CORE',blurb:'Hash functions, collision handling and load factors.'},
{id:'graphs',name:'Graphs',icon:'10',tag:'CORE',blurb:'Representations, BFS and DFS.'},
{id:'paths',name:'Graph algorithms',icon:'11',tag:'ADVANCED',blurb:'Shortest paths, minimum spanning trees and Floyd.'},
{id:'sorting',name:'Sorting & searching',icon:'12',tag:'CORE',blurb:'Bubble, insertion, merge, quick and binary search.'},
{id:'complexity',name:'Algorithm analysis',icon:'13',tag:'THEORY',blurb:'Big-O, runtimes, invariants and proofs.'},
{id:'extras',name:'Matrices & theory',icon:'14',tag:'EXTENSION',blurb:'Sparse and special matrices, isomorphism and induction.'}
];
const lessons = [
['first','foundations','Meet the array','An array gives many values one name.','Think of an array as lockers in a corridor. Every locker has an index, beginning at 0. Accessing a known index takes constant time, O(1).','int a[4] = {3, 7, 2, 9};\ncout << a[1] << endl;','What does a[1] print?',['3','7','2','9'],1,'C++ indexes arrays starting at zero, so index 1 holds 7.'],
['loops','foundations','Walk the array','Use a loop to visit values.','An array traversal visits each element exactly once. If it has n elements, the work grows linearly: O(n).','int a[4] = {3, 7, 2, 9};\nfor (int i=0; i<4; i++) cout << a[i] << " ";','What is the time cost of visiting n items?',['O(1)','O(log n)','O(n)','O(n²)'],2,'One visit per item means n steps.'],
['memory1','memory','Pointers are addresses','Learn what a pointer stores.','A pointer stores the memory address of an object. The & operator gets an address; * dereferences a pointer to read or write the object it points to.','int x = 12;\nint* p = &x;\ncout << *p << endl;','What does *p evaluate to?',['The address of x','12','0','A new pointer'],1,'p stores &x while *p accesses x itself.'],
['memory2','memory','Dynamic allocation','Create and release memory.','new obtains dynamic storage; delete releases a single dynamically allocated object. Using a pointer after deletion causes undefined behavior.','int* p = new int(42);\ncout << *p << endl;\ndelete p;\np = nullptr;','Which statement releases allocated memory?',['new int','nullptr','delete p','&p'],2,'delete p releases the allocation. Set p to nullptr afterward.'],
['lists1','lists','Build a linked list','Each node points to the next.','A singly linked list stores a value and a pointer to the next node. Inserting at the head takes O(1). Searching for a value takes O(n) in the worst case.','struct Node { int data; Node* next; };\nNode* head = nullptr;','How long does a head insertion take?',['O(1)','O(n)','O(log n)','O(n²)'],0,'A new head needs only a fixed number of pointer changes.'],
['lists2','lists','Follow the links','Understand traversal.','Start at head, visit the current node, then follow next until nullptr. Always check for nullptr before dereferencing.','Node* current = head;\nwhile (current != nullptr) {\n  cout << current->data;\n  current = current->next;\n}','What marks the end of a singly linked list?',['head','nullptr','index -1','length'],1,'The last node points to nullptr.'],
['recur1','recursion','The base case','Make recursion stop.','A recursive function calls itself on a smaller problem. The base case is the simplest instance and prevents infinite recursion.','int sum(int n) {\n  if (n == 0) return 0;\n  return n + sum(n-1);\n}','What is sum(3)?',['3','6','9','0'],1,'sum(3) = 3 + 2 + 1 + 0 = 6.'],
['stacks1','stacks','Push, pop, peek','Last in, first out.','A stack acts like a pile of plates. push adds the top item; pop removes it. Stack operations are typically O(1).','// Push: 4, then 8, then 2\n// Pop removes the last item.','After pushing 4, 8 and 2, what is popped first?',['4','8','2','Nothing'],2,'The most recently pushed value is removed first.'],
['queues1','stacks','The queue','First in, first out.','Queues add at the back and remove at the front. With a correct array or linked implementation, enqueue and dequeue run in O(1).','// Enqueue: 4, then 8, then 2\n// Dequeue removes the front.','What is dequeued first?',['2','4','8','None'],1,'The oldest entry leaves first.'],
['trees1','trees','Visit the tree','Preorder, inorder, postorder.','For a binary tree: preorder is root-left-right, inorder is left-root-right, and postorder is left-right-root. Each traversal visits n nodes, so it runs in O(n).','// Root 8, left 3, right 10\n// Inorder: 3, 8, 10','Inorder visits the root...',['First','Between left and right','Last','Never'],1,'Inorder means left subtree, then root, then right subtree.'],
['bst1','bst','BST decisions','Every comparison chooses a branch.','In a binary search tree, smaller values go left and larger values go right. A balanced tree can search in O(log n), but a badly skewed tree takes O(n).','// Search for 7:\n// at 10: go left\n// at 5: go right\n// at 7: found','If target is smaller than a BST node, go...',['Left','Right','Up','Anywhere'],0,'The left subtree contains smaller keys.'],
['heaps1','heaps','The max heap','Keep the maximum at the root.','A max heap is a complete binary tree where each parent is at least as large as its children. Insertion and removal of the maximum usually cost O(log n).','// Heap: [9, 7, 6, 2, 4]\n// Root = maximum = 9','Which property must a max heap satisfy?',['Sorted array','Parent ≥ children','Left < right always','Each leaf is 0'],1,'Heap order compares parent to children, not siblings.'],
['hash1','hash','Hash a key','Turn a key into a bucket.','A hash function maps a key to an array index. Collisions happen when multiple keys map to the same index; chaining and probing are common solutions.','int bucket = 27 % 10;\ncout << bucket << endl;','Where does 27 go with key % 10?',['2','7','10','27'],1,'The remainder when 27 is divided by 10 is 7.'],
['graphs1','graphs','Meet the graph','Vertices linked by edges.','A graph is a set of vertices and edges. Adjacency lists usually use O(V+E) storage. BFS explores by distance in edges; DFS follows one branch deeply first.','// A -- B -- C\n// |         |\n// D --------E','Which structure does BFS use?',['Stack','Queue','Heap','Hash table'],1,'BFS uses a queue to explore vertices by layers.'],
['paths1','paths','Shortest paths','Follow the cheapest route.','Dijkstra finds shortest paths when edge weights are nonnegative. Repeatedly take the unsettled vertex with smallest tentative distance and relax its outgoing edges.','// A --2--> B --3--> C\n// A ------7------> C','What is the shortest A to C cost?',['7','2','5','3'],2,'A→B→C costs 2+3=5, beating direct cost 7.'],
['sorting1','sorting','Bubble sort','Swap neighbors out of order.','Bubble sort repeatedly compares adjacent elements and swaps them when needed. Its usual worst-case time cost is O(n²).','int a[3] = {3,1,2};\nif (a[0] > a[1]) swap(a[0], a[1]);','After swapping the first pair, the array is...',['3,1,2','1,3,2','1,2,3','2,1,3'],1,'3 and 1 switch places; 2 remains at the end.'],
['sorting2','sorting','Binary search','Halve the search interval.','Binary search works on sorted data. Compare the middle item with the target and discard half the remaining interval each step: O(log n).','// [2,4,6,8,10]\n// target 8: middle=6, go right','What must be true before binary search?',['Array is sorted','Array is huge','Array has duplicates','Array is reversed'],0,'Binary search depends on a known sorted order.'],
['complexity1','complexity','Big-O intuition','Describe how work grows.','O(1) stays constant, O(log n) grows slowly, O(n) grows with input size and O(n²) often comes from nested full-length loops. Ignore constant factors for asymptotic analysis.','for (int i=0; i<n; i++)\n  for (int j=0; j<n; j++)\n    cout << i+j;','Two full nested loops usually give...',['O(log n)','O(n)','O(n²)','O(1)'],2,'n operations repeated n times gives n² operations.'],
['extras1','extras','Sparse matrices','Store only what matters.','Most entries in a sparse matrix are zero. Instead of storing every zero, a coordinate list can store just each nonzero row, column and value.','// 5x5 matrix, only two nonzeros:\n// (0,2,8), (4,1,3)','Why use sparse storage?',['To preserve every zero','To save memory when few entries are nonzero','To sort a matrix','To remove rows'],1,'Sparse formats can avoid storing thousands of zero entries.'],
['extras2','extras','Prove a structure','An induction mindset.','Structural induction proves a statement for recursively defined structures. Show the simplest structure works, then show the property holds after applying the construction step.','// Base case: empty list\n// Step: add a node to a smaller list','What belongs in a proof by induction?',['Only examples','Base case and inductive step','Only a conclusion','A runtime bound'],1,'You need a base case and a valid inductive step.'],
["exp-foundations-1","foundations","C++ functions and references","Reuse logic safely","A function groups reusable statements. A reference parameter changes the original variable. Passing by const reference avoids a copy while blocking changes.","void doubleIt(int& x){ x*=2; }","What does int& x allow?",["Changing the caller’s x","Creating a separate int","Deleting x","Returning two values"],0,"A non-const reference aliases the original variable."],
["exp-foundations-2","foundations","2D arrays","Think in rows and columns","A matrix stored as a rectangular C++ array uses row and column indexes. With int a[2][3], valid rows are 0–1 and valid columns are 0–2.","int a[2][3]={{1,2,3},{4,5,6}};","What is a[1][0]?",["1","3","4","6"],2,"Row 1 is {4,5,6}; column 0 holds 4."],
["exp-foundations-3","foundations","Structs and nodes","Keep related data together","A struct groups related fields. A node for a linked list commonly stores data and a pointer to the next node.","struct Node { int value; Node* next; };","What does next store?",["A node count","A memory address","An array index only","A boolean"],1,"Node* points to another Node object or nullptr."],
["exp-memory-1","memory","The address-of operator","Find where data lives","Every stored object occupies a location in memory. &x produces the address of x; int* p stores an address. Printing *p accesses the value.","int x=9; int* p=&x; *p=13;","What is x after *p=13?",["9","13","0","Undefined"],1,"Writing through *p modifies the referenced integer."],
["exp-memory-2","memory","Null and dangling pointers","Avoid invalid memory access","A null pointer points to no object. A dangling pointer refers to memory whose lifetime ended. Dereferencing either is unsafe. Prefer nullptr and scope-bound ownership.","int* p=nullptr; if(p) cout<<*p;","Which condition safely checks a pointer before dereference?",["if(*p)","if(p)","if(&p)","if(delete p)"],1,"A pointer is false when it is nullptr."],
["exp-memory-3","memory","Pointers versus arrays","Understand contiguous storage","Array elements sit next to each other in memory. For an array a, a+i points i elements forward. *(a+i) and a[i] mean the same element when i is valid.","int a[]={4,8,12}; cout<<*(a+2);","What is printed?",["4","8","12","An address"],2,"Pointer arithmetic steps by the element size."],
["exp-lists-1","lists","Insert at the head","Rewire two pointers","To prepend a node, point newNode->next to the old head, then make head equal newNode. Do these operations in that order or you can lose the list.","newNode->next=head; head=newNode;","Which pointer changes first?",["head","newNode->next","tail","nullptr"],1,"Attach the new node to the old list before replacing head."],
["exp-lists-2","lists","Delete a node","Preserve the rest of the list","Deleting a non-head node requires reconnecting the previous node to the deleted node’s successor. Then free the removed node. Beware empty and one-element lists.","prev->next=curr->next; delete curr;","Why reconnect prev->next?",["To sort nodes","To avoid losing the following nodes","To add memory","To change data type"],1,"The link must skip the removed node."],
["exp-lists-3","lists","Doubly linked lists","Travel in either direction","A doubly linked node keeps next and prev pointers. It costs extra memory but, given a node, can support removal without searching for its predecessor.","struct Node {int x; Node* next; Node* prev;};","What is the extra pointer called?",["top","tail","prev","root"],2,"prev points to the previous node."],
["exp-recursion-1","recursion","Trace a call stack","Follow the returns","Each recursive call gets its own local variables. Calls stack until the base case; then results return in reverse call order.","int f(int n){if(n==0)return 1; return n*f(n-1);}","What is f(4)?",["10","16","24","1"],2,"4·3·2·1 = 24."],
["exp-recursion-2","recursion","Recursive complexity","Count all calls","For T(n)=T(n-1)+O(1), each invocation reduces n by one, so there are O(n) calls. For two calls on half-size input, a different recurrence applies.","void down(int n){if(n==0)return;down(n-1);}","What is the recursion depth of down(n)?",["O(1)","O(log n)","O(n)","O(n²)"],2,"The chain contains n pending calls."],
["exp-stacks-1","stacks","Balance parentheses","Match open and close","Push each opening bracket. On a closing bracket, compare it with the top. A mismatch, premature close or leftover opening bracket means the expression is invalid.","// Push on open; pop on matching close","Which structure fits bracket matching?",["Queue","Stack","Binary heap","Hash set"],1,"The most recently opened bracket must close first."],
["exp-stacks-2","stacks","Circular queues","Reuse freed array slots","A circular queue wraps front and rear indexes modulo capacity. With a count variable, enqueue/dequeue can both be O(1) without shifting every element.","rear=(rear+1)%capacity;","When capacity is 5 and rear is 4, the next rear is…",["5","0","1","4"],1,"(4+1)%5 = 0."],
["exp-stacks-3","stacks","Deque and priority queue","Choose by removal rule","A deque supports operations at both ends. A priority queue removes a highest-priority item before lower-priority items, regardless of insertion order.","// deque: front and back operations","What determines priority-queue removal?",["Arrival time only","Priority","Memory address","Always the last item"],1,"A priority queue orders removal by priority."],
["exp-trees-1","trees","Tree terminology","Count edges and levels","A rooted tree has a root, parents, children and leaves. A node’s depth counts edges from the root. The height of a node is the longest downward path in edges.","// root depth = 0","What is the depth of the root?",["-1","0","1","Number of leaves"],1,"Depth counts edges on the path from the root."],
["exp-trees-2","trees","Inorder traversal","Left → root → right","Inorder recursively visits the left subtree, current node, then right subtree. For a binary search tree with distinct keys, inorder prints values in increasing order.","void inorder(Node* n){ if(!n)return; inorder(n->left); cout<<n->key; inorder(n->right);}","For a BST, inorder yields…",["Reverse insertion order","Ascending keys","Random keys","Only leaves"],1,"The BST ordering property makes inorder sorted."],
["exp-trees-3","trees","Postorder traversal","Left → right → root","Postorder visits children before their parent, making it suitable for deleting a tree bottom-up or evaluating expression-tree operations.","// postorder: left, right, root","What is visited last in postorder?",["Root","Leftmost leaf","Rightmost leaf","Every leaf"],0,"The root is processed after its subtrees."],
["exp-bst-1","bst","BST insertion","Walk before attaching","Compare the new key to the current node. Go left for smaller and right for larger keys until finding a vacant child. A skewed tree can degrade to O(n) search.","// Insert 6 into BST rooted at 10: go left","A skewed BST can have height…",["0","1","O(log n) always","O(n)"],3,"An unbalanced BST may form a chain."],
["exp-bst-2","bst","Three BST deletion cases","Remove without breaking order","A leaf can be removed. A node with one child is replaced by its child. A node with two children can swap key with its inorder successor, then delete that successor.","// successor = minimum of right subtree","For two children, a common replacement is…",["Any leaf","Inorder successor","The root always","Maximum of right subtree"],1,"The right-subtree minimum preserves ordering."],
["exp-bst-3","bst","AVL rotations","Keep height under control","AVL trees rebalance after changes using single or double rotations. The balance factor is left-subtree height minus right-subtree height, limited to -1, 0, or 1.","// LL imbalance → right rotation","What balance factor is invalid in an AVL node?",["-1","0","1","2"],3,"A magnitude above one requires rebalancing."],
["exp-heaps-1","heaps","Heap array indexing","Navigate without pointers","With zero-based indexing, parent(i)=floor((i-1)/2), left(i)=2i+1 and right(i)=2i+2. A heap’s shape is complete, not fully sorted.","int left=2*i+1, right=2*i+2;","For i=2, what is left child index?",["3","4","5","6"],2,"2·2+1 = 5."],
["exp-heaps-2","heaps","Heapify downward","Repair the heap property","When a node is smaller than a child in a max heap, swap it with the larger child and continue downward. Heapify requires O(log n) in the worst case.","// compare with largest child, swap, repeat","What is worst-case max-heapify time?",["O(1)","O(log n)","O(n)","O(n²)"],1,"The element moves down at most the tree height."],
["exp-heaps-3","heaps","Build heap and heap sort","Sort with a heap","Build-max-heap starts from the last non-leaf node and heapifies backward in O(n). Heap sort repeatedly swaps the root with the last active slot and heapifies in O(n log n).","// build heap then repeatedly extract max","What is the time to build a heap?",["O(1)","O(log n)","O(n)","O(n²)"],2,"Bottom-up heap construction is O(n)."],
["exp-hash-1","hash","Collisions and chaining","A bucket can hold several keys","Hash collisions are expected. Separate chaining keeps multiple keys in a bucket, often as a linked list. Expected average lookup can be O(1) with controlled load.","int bucket=key%capacity;","Keys 7 and 17 with capacity 10 map to…",["Different buckets","The same bucket","Invalid keys","A sorted array"],1,"7%10 and 17%10 both equal 7."],
["exp-hash-2","hash","Open addressing","Probe for the next opening","Linear probing checks the next bucket until an available one appears. Removing entries needs a tombstone marker so later searches do not stop too early.","int i=(hash+step)%capacity;","Why use tombstones after deletion?",["To increase capacity","To preserve probing chains","To sort keys","To reset hashing"],1,"Stopping at an empty-looking deleted slot could hide later entries."],
["exp-hash-3","hash","Load factor","Watch table occupancy","Load factor α = entries / buckets. A large α makes collisions more frequent. Resizing and rehashing can restore fast expected operations.","double alpha=(double)n/capacity;","If 9 keys occupy 12 buckets, α equals…",["0.25","0.50","0.75","1.33"],2,"9/12 = 0.75."],
["exp-graphs-1","graphs","Represent a graph","Matrix or adjacency list","An adjacency matrix takes O(V²) space. An adjacency list takes O(V+E), which usually suits sparse graphs. Pick the representation based on operations and density.","// adj[u] contains u’s neighbors","Which is often smaller for sparse graphs?",["Adjacency list","Adjacency matrix","Both always equal","A binary heap"],0,"List storage tracks actual edges."],
["exp-graphs-2","graphs","Breadth-first search","Explore layer by layer","BFS uses a queue, visits neighbors of the current vertex, and finds shortest distances in an unweighted graph. Its time with adjacency lists is O(V+E).","// enqueue source; pop; enqueue unseen neighbors","What structure powers BFS?",["Stack","Queue","Heap","BST"],1,"FIFO order processes vertices by distance layers."],
["exp-graphs-3","graphs","Depth-first search","Follow one path deeply","DFS uses recursion or an explicit stack. It is useful for connectivity, cycle detection, topological ordering and traversal.","// visit(u); recursively visit unvisited neighbors","What structure models recursive DFS?",["Queue","Call stack","Priority queue","Hash function"],1,"Recursive calls form a stack."],
["exp-paths-1","paths","Dijkstra limits","Watch for negative weights","Dijkstra relies on nonnegative edge weights. With a min-priority queue, a common implementation runs in O((V+E) log V) for adjacency lists.","// choose unsettled vertex with smallest distance","Can standard Dijkstra handle negative edges reliably?",["Yes, always","No","Only if the graph is a tree","Only for undirected graphs"],1,"Negative edges can invalidate settled distances."],
["exp-paths-2","paths","Minimum spanning tree","Connect all vertices cheaply","Prim and Kruskal construct minimum spanning trees of connected weighted undirected graphs. Kruskal sorts edges and uses disjoint sets to prevent cycles.","// Kruskal: take cheapest edge not making a cycle","How many edges does a tree with V vertices have?",["V","V-1","V+1","2V"],1,"Any tree with V vertices has V−1 edges."],
["exp-paths-3","paths","Floyd–Warshall","All-pairs shortest paths","Floyd–Warshall checks if routing through an intermediate vertex makes a path shorter. It uses three nested loops over V vertices, so time is O(V³).","d[i][j]=min(d[i][j],d[i][k]+d[k][j]);","Floyd–Warshall runs in…",["O(log V)","O(V)","O(V²)","O(V³)"],3,"Three nested vertex loops give cubic time."],
["exp-sorting-1","sorting","Merge sort","Split and combine","Merge sort recursively divides data into halves, then merges sorted halves. It takes O(n log n) time and typically O(n) extra space for arrays.","// split, sort halves, merge","Worst-case merge sort time is…",["O(n)","O(log n)","O(n log n)","O(n²)"],2,"There are log n levels with O(n) work each."],
["exp-sorting-2","sorting","Quick sort","Partition around a pivot","Quick sort partitions items around a pivot and recurses. Its expected time is O(n log n), but consistently poor pivots can lead to O(n²).","// partition; quicksort(left); quicksort(right);","Worst-case quicksort time?",["O(1)","O(n)","O(n log n)","O(n²)"],3,"Highly unbalanced partitions cause quadratic work."],
["exp-sorting-3","sorting","Stable sorting","Preserve equal-key order","A stable sort keeps equal-key records in their original relative order. Merge sort is usually stable when merging ties from the left first; heapsort generally is not.","// Equal keys retain their prior order","Which property defines stability?",["Minimum memory","Equal items keep their relative order","Always O(n)","In-place recursion"],1,"Stability concerns the ordering of equal keys."],
["exp-complexity-1","complexity","Nested loop analysis","Count iterations, not lines","Two independent loops each running n times give n² operations. A loop that repeatedly halves its input instead runs about log₂ n iterations.","for(int i=0;i<n;i++)for(int j=0;j<n;j++)work();","What is the nested-loop complexity?",["O(1)","O(log n)","O(n)","O(n²)"],3,"Each of n outer runs contains n inner runs."],
["exp-complexity-2","complexity","Invariants","Prove correctness step by step","A loop invariant must be true before the first iteration, stay true after each iteration, and imply the result on termination. This structures an algorithm correctness proof.","// invariant: prefix [0..i) is sorted","Which is NOT a required invariant property?",["Initialization","Maintenance","Termination use","Randomization"],3,"Initialization, maintenance and termination are the three parts."],
["exp-complexity-3","complexity","Master theorem intuition","Analyze divide and conquer","A recurrence T(n)=2T(n/2)+n models algorithms that solve two half-size problems and combine in linear time. It gives O(n log n).","// T(n) = 2*T(n/2) + n","What is the growth rate?",["O(log n)","O(n)","O(n log n)","O(n²)"],2,"At each of log n levels, total work is O(n)."],
["exp-extras-1","extras","Triangular matrices","Store only necessary entries","A lower triangular n×n matrix only has values at or below the diagonal. It has n(n+1)/2 potentially nonzero positions. Packed storage saves space.","// lower triangular: j <= i","For n=4, count lower-triangle positions.",["4","6","10","16"],2,"4·5/2 = 10."],
["exp-extras-2","extras","Counting sort","Use frequencies for bounded integers","Counting sort tallies how often each integer key occurs. With n items and key range k, its time and extra memory are O(n+k). It is not comparison-based.","// count[key]++ for each input","What affects counting-sort cost besides n?",["Tree height","Key range k","Graph diameter","Pointer size"],1,"The count array has size tied to key range."],
["exp-extras-3","extras","Graph isomorphism","Same structure, new labels","Two graphs are isomorphic if a one-to-one vertex mapping preserves adjacency. A drawing or vertex labels alone cannot establish different structures.","// map vertices and verify every edge","What must an isomorphism preserve?",["Vertex labels","Edge adjacency","Screen positions","Traversal output only"],1,"Corresponding vertices must share the same adjacency relationships."]
].map(a=>({id:a[0],module:a[1],title:a[2],subtitle:a[3],body:a[4],code:a[5],question:a[6],options:a[7],answer:a[8],why:a[9]}));
const challenges=[
{id:'hello',category:'Beginner',title:'Say hello',desc:'Print the exact text: DSA Quest',input:'',expected:'DSA Quest',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    // Print the required message here\n    return 0;\n}\n',hint:'Use cout and a string literal.'},
{id:'sum',category:'Beginner',title:'Add two numbers',desc:'Read two integers a and b and print their sum.',input:'7 12',expected:'19',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    int a,b;\n    cin >> a >> b;\n    // Print the sum\n    return 0;\n}\n',hint:'Use cout << a + b;'},
{id:'maximum',category:'Arrays',title:'Maximum of five',desc:'Read five integers and print the largest.',input:'8 3 16 1 7',expected:'16',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    int a[5];\n    for(int i=0;i<5;i++) cin >> a[i];\n    // Find and print the largest\n    return 0;\n}\n',hint:'Set the maximum to a[0]; compare a[1] through a[4].'},
{id:'reverse',category:'Arrays',title:'Reverse an array',desc:'Read five integers and print them in reverse order separated by spaces.',input:'1 2 3 4 5',expected:'5 4 3 2 1',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    int a[5];\n    for(int i=0;i<5;i++) cin >> a[i];\n    // Print from last to first\n    return 0;\n}\n',hint:'Start the index at 4 and decrease it until 0.'},
{id:'linear',category:'Algorithms',title:'Linear search',desc:'Read five integers followed by a target. Print the index of its first occurrence, or -1.',input:'4 9 2 9 1 2',expected:'2',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    int a[5], target;\n    for(int i=0;i<5;i++) cin >> a[i];\n    cin >> target;\n    // Search and print its index\n    return 0;\n}\n',hint:'Loop from 0 to 4 and return the first matching index.'},
{id:'factorial',category:'Recursion',title:'Recursive factorial',desc:'Read n (0–10) and print n! using a recursive function.',input:'5',expected:'120',starter:'#include <iostream>\nusing namespace std;\nint fact(int n) {\n    // Base case, then recursive case\n    return 0;\n}\nint main() {\n    int n; cin >> n;\n    cout << fact(n);\n    return 0;\n}\n',hint:'fact(0)=1. Otherwise fact(n)=n*fact(n-1).'},
{id:'count',category:'Algorithms',title:'Count positives',desc:'Read six integers and print how many are strictly greater than zero.',input:'-2 0 6 5 -1 3',expected:'3',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    int count = 0;\n    // Read six integers and count positives\n    cout << count;\n    return 0;\n}\n',hint:'Use a loop. Increase count whenever x > 0.'},
{"id":"parity","category":"Beginner","title":"Even or odd?","desc":"Read an integer and print EVEN or ODD.","input":"8","expected":"EVEN","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int n; cin>>n; // print EVEN or ODD\n  return 0;\n}\n","hint":"The remainder n%2 is 0 for even numbers.","tests":[{"input":"-5","expected":"ODD"},{"input":"0","expected":"EVEN"}]},
{"id":"digits","category":"Beginner","title":"Count the digits","desc":"Read an integer and print its decimal digit count, ignoring the minus sign. Zero has one digit.","input":"0","expected":"1","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int n; cin>>n; // handle zero, then divide by 10\n  return 0;\n}\n","hint":"For zero, answer is 1. For a negative number, make it positive before the loop.","tests":[{"input":"90025","expected":"5"},{"input":"-38","expected":"2"}]},
{"id":"array-sum","category":"Arrays","title":"Sum five values","desc":"Read five integers and print their sum.","input":"1 2 3 4 5","expected":"15","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // read all 5, accumulate\n  return 0;\n}\n","hint":"Start sum at 0 and add every item.","tests":[{"input":"-2 1 0 5 2","expected":"6"},{"input":"0 0 0 0 0","expected":"0"}]},
{"id":"second-largest","category":"Arrays","title":"Second largest (distinct)","desc":"Read five distinct integers. Print the second largest.","input":"9 4 13 2 7","expected":"9","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // track top two values\n  return 0;\n}\n","hint":"Use two passes or track largest and runner-up carefully.","tests":[{"input":"-5 -2 -8 -1 -3","expected":"-2"},{"input":"10 99 9 8 7","expected":"10"}]},
{"id":"left-rotate","category":"Arrays","title":"Rotate left","desc":"Read five integers; rotate once to the left and print them space-separated.","input":"1 2 3 4 5","expected":"2 3 4 5 1","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // move first to the back\n  return 0;\n}\n","hint":"Store the first value, shift elements left, then put it at index 4.","tests":[{"input":"5 4 3 2 1","expected":"4 3 2 1 5"}]},
{"id":"binary-search","category":"Algorithms","title":"Find it by halving","desc":"Read seven sorted integers and then a target. Print the index or -1.","input":"1 3 5 7 9 11 13 9","expected":"4","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[7],key; // implement binary search\n  return 0;\n}\n","hint":"Keep left and right indexes. At each step, discard half the range.","tests":[{"input":"2 4 6 8 10 12 14 5","expected":"-1"},{"input":"-9 -3 0 4 6 8 11 -9","expected":"0"}]},
{"id":"gcd","category":"Algorithms","title":"Euclid’s GCD","desc":"Read two positive integers and print their greatest common divisor.","input":"54 24","expected":"6","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a,b;cin>>a>>b; // repeated remainder\n  return 0;\n}\n","hint":"Repeat a%b, then assign a=b and b=remainder, until b is zero.","tests":[{"input":"17 13","expected":"1"},{"input":"48 64","expected":"16"}]},
{"id":"fibonacci","category":"Recursion","title":"Fibonacci return value","desc":"Read n (0–15). Print the nth Fibonacci number, with F(0)=0 and F(1)=1. Use recursion.","input":"7","expected":"13","starter":"#include <iostream>\nusing namespace std;\nint fib(int n) {\n  // TODO: implement recursive Fibonacci\n  return 0;\n}\nint main() {\n  int n; cin >> n;\n  cout << fib(n);\n  return 0;\n}\n","hint":"Use F(n)=F(n-1)+F(n-2), with base cases n<=1.","tests":[{"input":"0","expected":"0"},{"input":"10","expected":"55"}]},
{"id":"power","category":"Recursion","title":"Recursive exponent","desc":"Read integer base b and nonnegative exponent e (0–10). Print b^e using recursion.","input":"2 5","expected":"32","starter":"#include <iostream>\nusing namespace std;\nint power(int b, int e) {\n  // TODO: implement recursive exponentiation\n  return 0;\n}\nint main() {\n  int b, e; cin >> b >> e;\n  cout << power(b, e);\n  return 0;\n}\n","hint":"A power with exponent 0 returns 1; otherwise b*power(b,e-1).","tests":[{"input":"7 0","expected":"1"},{"input":"3 3","expected":"27"}]},
{"id":"bracket-count","category":"Stacks","title":"Stack depth","desc":"Read a string of parentheses containing only ( and ). Print its maximum nesting depth, or -1 if invalid.","input":"(()(()))","expected":"3","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  char brackets[256];cin>>brackets;\n  // TODO: track depth and the greatest depth reached\n  return 0;\n}\n","hint":"Increase depth for (; decrease for ). Never allow negative depth; require depth 0 at end.","tests":[{"input":"()()","expected":"1"},{"input":"(()","expected":"-1"}]},
{"id":"queue-peek","category":"Stacks","title":"The queue order","desc":"Read four integers in arrival order. Print the first and last items separated by a space.","input":"8 4 2 9","expected":"8 9","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[4]; // read arrivals; print front and back\n  return 0;\n}\n","hint":"FIFO means the first item is at the front and last at the rear.","tests":[{"input":"-1 0 1 3","expected":"-1 3"}]},
{"id":"hash-buckets","category":"Hashing","title":"Compute hash buckets","desc":"Read five nonnegative integers. Print their bucket numbers using h(k)=k%7, separated by spaces.","input":"7 8 14 22 6","expected":"0 1 0 1 6","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // output a[i] % 7\n  return 0;\n}\n","hint":"Two different keys can share a bucket; this is a collision.","tests":[{"input":"0 1 2 3 4","expected":"0 1 2 3 4"}]},
{"id":"graph-degree","category":"Graphs","title":"Count the neighbors","desc":"Read a 4×4 adjacency matrix of an undirected simple graph. Print the degree of vertex 0.","input":"0 1 1 0 1 0 0 1 1 0 0 1 0 1 1 0","expected":"2","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int adj[4][4]; // read and sum row 0\n  return 0;\n}\n","hint":"The degree is the count of 1 entries in a vertex’s row.","tests":[{"input":"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0","expected":"0"}]},
{"id":"edge-count","category":"Graphs","title":"How many edges?","desc":"Read a 3×3 adjacency matrix of an undirected simple graph. Print the total edge count.","input":"0 1 1 1 0 0 1 0 0","expected":"2","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int adj[3][3]; // sum only entries above diagonal\n  return 0;\n}\n","hint":"Each undirected edge occurs twice; count i<j.","tests":[{"input":"0 1 1 1 0 1 1 1 0","expected":"3"}]},
{"id":"bubble-code","category":"Sorting","title":"Bubble-sort five","desc":"Read five integers and print them ascending after implementing bubble sort.","input":"8 1 5 3 2","expected":"1 2 3 5 8","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // nested loops, swap adjacent elements\n  return 0;\n}\n","hint":"After each pass, the largest remaining item settles to the right.","tests":[{"input":"5 4 3 2 1","expected":"1 2 3 4 5"},{"input":"-2 0 -9 8 3","expected":"-9 -2 0 3 8"}]},
{"id":"selection-code","category":"Sorting","title":"Selection-sort five","desc":"Read five integers and print ascending order after implementing selection sort.","input":"6 1 8 4 2","expected":"1 2 4 6 8","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[5]; // select minimum suffix item each pass\n  return 0;\n}\n","hint":"Find the smallest item in the remaining suffix and swap it into place.","tests":[{"input":"1 2 3 4 5","expected":"1 2 3 4 5"}]},
{"id":"matrix-diagonal","category":"Matrices","title":"Diagonal sum","desc":"Read nine integers as a 3×3 matrix and print the main diagonal sum.","input":"1 2 3 4 5 6 7 8 9","expected":"15","starter":"#include <iostream>\nusing namespace std;\nint main(){\n  int a[3][3]; // sum positions [i][i]\n  return 0;\n}\n","hint":"Main diagonal cells are (0,0), (1,1) and (2,2).","tests":[{"input":"9 0 0 0 8 0 0 0 7","expected":"24"}]}
];
let page='home',moduleId='foundations',lessonId=null,challengeId=null,challengeFilter='All',labMode='array',labStep=0,runBusy=false,consoleText='Ready. Press Run to execute supported C++ code.',consoleStatus='READY';
const lessonFor=id=>lessons.find(l=>l.id===id);
const challengeFor=id=>challenges.find(l=>l.id===id);
const totalDone=()=>Object.keys(state.done).filter(k=>state.done[k]).length;
const totalSolved=()=>Object.keys(state.solved).filter(k=>state.solved[k]).length;
const titleMap={home:'Welcome, adventurer',quest:'The adventure',learn:'Theory library',lab:'Visual labs',practice:'Code challenges',boss:'Boss arena',playground:'C++ playground',roadmap:'COMP 2611 roadmap'};
function navigate(to,params){if(to!=='lab'&&typeof stopLabAuto==='function')stopLabAuto();page=to;if(window.history&&window.history.replaceState&&location.hash!=='#'+to)window.history.replaceState(null,'','#'+to);if(params){if(params.module)moduleId=params.module;if(params.lesson!==undefined)lessonId=params.lesson;if(params.challenge!==undefined)challengeId=params.challenge;}render();window.scrollTo({top:0,behavior:'instant'});document.body.classList.remove('menu-open');}
function render(){updateHUD();document.querySelectorAll('[data-page]').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===page));$('#crumbCurrent').textContent=titleMap[page]||'The adventure';const enhanced=window.DSAAdventure&&window.DSAAdventure.renderPage(page);app.innerHTML=enhanced!==null&&enhanced!==undefined?enhanced:(page==='home'?renderHome():page==='learn'?renderLearn():page==='lab'?renderLab():page==='practice'?renderPractice():page==='boss'?renderBoss():page==='playground'?renderPlayground():renderRoadmap());document.body.classList.toggle('aq-mission-active',Boolean(page==='quest'&&window.DSAAdventure&&window.DSAAdventure.activeMission()));document.body.classList.toggle('aq-home-active',page==='home');}

let bossState=null;
function startBoss(){
  const questions=[...lessons];
  for(let i=questions.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[questions[i],questions[j]]=[questions[j],questions[i]];}
  bossState={questions:questions.slice(0,10),index:0,hearts:3,selected:null,ended:false,win:false};
  navigate('boss');
}
function renderBoss(){
  if(!bossState)return '<div class="page"><div class="eyebrow">FINAL CHALLENGE / ARCADE</div><div class="boss-hero"><div class="boss-icon">⚔</div><span class="tag pink">BOSS BATTLE</span><h1>Face the <span class="highlight">Code Hydra.</span></h1><p>Answer ten questions from across the COMP 2611 syllabus. You have three hearts. Read the explanation after every move and fight your way to the final question.</p><div class="boss-prize">✦ +150 XP for your first victory</div><button class="btn" data-action="boss-start">Start battle →</button></div></div>';
  if(bossState.ended)return '<div class="page"><div class="boss-hero"><div class="boss-icon">'+(bossState.win?'🏆':'♡')+'</div><span class="tag '+(bossState.win?'green':'pink')+'">'+(bossState.win?'VICTORY':'TRY AGAIN')+'</span><h1>'+(bossState.win?'Hydra defeated.':'The Hydra wins this round.')+'</h1><p>'+(bossState.win?'You survived ten questions. Keep training and your next battle will feel easier.':'Review the explanations, head back to your lessons, and return for another attempt.')+'</p><div class="actions" style="justify-content:center"><button class="btn" data-action="boss-start">Fight again →</button><button class="btn alt" data-page="learn">Back to lessons</button></div></div></div>';
  const q=bossState.questions[bossState.index],selected=bossState.selected;
  return '<div class="page lesson-panel"><div class="eyebrow">BOSS BATTLE / CODE HYDRA</div><div class="boss-hud"><span class="tag green">QUESTION '+(bossState.index+1)+' / 10</span><span class="boss-hearts">'+('♥ '.repeat(bossState.hearts))+'<span class="muted">'+('♡ '.repeat(3-bossState.hearts))+'</span></span></div><div class="progress-track"><div class="progress-fill" style="width:'+((bossState.index+1)*10)+'%"></div></div><div class="question boss-question"><div class="question-label">'+escapeHTML(modules.find(m=>m.id===q.module).name.toUpperCase())+'</div><h1>'+escapeHTML(q.question)+'</h1><div class="options">'+q.options.map((o,i)=>'<button class="option '+(selected!==null?(i===q.answer?'correct':i===selected?'wrong':''):'')+'" data-boss-answer="'+i+'" '+(selected!==null?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+escapeHTML(o)+'</button>').join('')+'</div>'+(selected!==null?'<div class="feedback">'+(selected===q.answer?'✓ Correct. ':'✕ Incorrect. ')+escapeHTML(q.why)+'</div>':'')+'</div><div class="actions"><button class="btn" data-action="boss-next" '+(selected===null?'disabled':'')+'>'+(bossState.hearts===0||bossState.index===9?'See result →':'Next round →')+'</button><button class="btn alt" data-page="learn">Review lessons</button></div></div>';
}

function renderHome(){const pct=Math.round(totalDone()/lessons.length*100);return '<div class="page"><div class="eyebrow">YOUR QUEST STARTS HERE · LEVEL '+(Math.floor(state.xp/250)+1)+'</div><section class="hero"><div><div class="tag green">✦ YOUR PERSONAL C++ ACADEMY</div><h1>Learn to think<br><span class="highlight">like an algorithm.</span></h1><p>Short lessons. Real code. Visual experiments. Play your way through Data Structures at UWI St. Augustine.</p><div class="actions"><button class="btn" data-action="start-learning">Continue learning →</button><button class="btn alt" data-page="lab">Try a visual lab ◎</button></div></div><div class="hero-art"><div class="node-graph"><div class="graph-line l1"></div><div class="graph-line l2"></div><div class="graph-line l3"></div><div class="graph-node n1">8</div><div class="graph-node n2">3</div><div class="graph-node n3">10</div><div class="graph-node n4">1</div></div></div></section><div class="stats"><div class="stat"><div class="lbl">XP EARNED</div><div class="value">✦ '+state.xp+'</div></div><div class="stat"><div class="lbl">LESSONS COMPLETE</div><div class="value">'+totalDone()+' <span class="muted" style="font-size:15px">/ '+lessons.length+'</span></div></div><div class="stat"><div class="lbl">CHALLENGES SOLVED</div><div class="value">'+totalSolved()+' <span class="muted" style="font-size:15px">/ '+challenges.length+'</span></div></div><div class="stat"><div class="lbl">STUDY STREAK</div><div class="value">⚡ '+state.streak+' <span class="muted" style="font-size:15px">days</span></div></div></div><div class="section-title"><h2>Your learning adventure</h2><span class="sub">'+pct+'% of current lessons complete</span></div><div class="progress-track"><div class="progress-fill" style="width:'+pct+'%"></div></div><div class="section-title"><h2>Choose your next move</h2></div><div class="cards"><article class="card click" data-page="learn"><div class="card-icon">▦</div><span class="tag green">61 INTERACTIVE LESSONS</span><h3 style="margin-top:15px">Learn the fundamentals</h3><p>Small lessons with examples, checkpoints and instant explanations.</p></article><article class="card click" data-page="lab"><div class="card-icon">◎</div><span class="tag">STEP-BY-STEP</span><h3 style="margin-top:15px">Watch algorithms move</h3><p>Manipulate arrays, stacks and binary search, one step at a time.</p></article><article class="card click" data-page="practice"><div class="card-icon">⚔</div><span class="tag pink">CODE CHALLENGES</span><h3 style="margin-top:15px">Get your hands dirty</h3><p>Write C++, test output and earn XP by solving missions.</p></article></div><div class="section-title"><h2>Boss battle</h2></div><div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><h3>⚔ Face the Code Hydra</h3><p>Ten mixed questions. Three hearts. Earn 150 XP for your first victory.</p></div><button class="btn purple" data-page="boss">Enter arena →</button></div><div class="section-title"><h2>Your C++ workbench</h2></div><div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><h3>⌘ Open the playground</h3><p>Try code, supply standard input and keep virtual project files.</p></div><button class="btn purple" data-page="playground">Launch editor →</button></div></div>';}
function renderLearn(){if(lessonId)return renderLesson();if(moduleId && state.showModule)return renderModule();return '<div class="page"><div class="eyebrow">CHAPTER SELECT</div><h1>Choose your <span class="highlight">path.</span></h1><p class="desc">14 topic tracks, organized from C++ basics to data structures and algorithm analysis. Includes '+lessons.length+' guided lessons with quick checks, code examples and explanations.</p><div class="path-grid">'+modules.map((m,i)=>{const ls=lessons.filter(l=>l.module===m.id),complete=ls.filter(l=>state.done[l.id]).length;return '<article class="card click path-card" data-module="'+m.id+'"><span class="path-number">'+m.icon+'</span><div class="path-meta"><div class="module-num">'+m.tag+' · '+complete+'/'+ls.length+' LESSONS</div><h3>'+escapeHTML(m.name)+'</h3><p>'+escapeHTML(m.blurb)+'</p><div class="progress-track"><div class="progress-fill" style="width:'+Math.round(100*complete/Math.max(1,ls.length))+'%"></div></div></div><span class="arrow">→</span></article>';}).join('')+'</div></div>';}
function renderModule(){const m=modules.find(x=>x.id===moduleId)||modules[0],ls=lessons.filter(x=>x.module===m.id);return '<div class="page"><div class="lesson-top"><button class="back-button" data-action="all-modules">← All tracks</button><span class="tag">'+m.tag+'</span></div><div class="eyebrow">TRACK '+m.icon+'</div><h1>'+escapeHTML(m.name)+'</h1><p class="desc">'+escapeHTML(m.blurb)+'</p><div class="module-lessons">'+ls.map((l,i)=>'<div class="lesson-row" data-lesson="'+l.id+'"><div class="step-dot '+(state.done[l.id]?'complete':'')+'">'+(state.done[l.id]?'✓':i+1)+'</div><div class="lesson-main"><strong>'+escapeHTML(l.title)+'</strong><small>'+escapeHTML(l.subtitle)+'</small></div><span class="tag green">'+(state.done[l.id]?'COMPLETE':'30 XP')+'</span><span class="arrow">→</span></div>').join('')+'</div></div>';}
function renderLesson(){const l=lessonFor(lessonId);if(!l){lessonId=null;return renderLearn();}const selected=state.answerSelections&&state.answerSelections[l.id];return '<div class="page lesson-panel"><div class="lesson-top"><button class="back-button" data-action="back-module">← '+escapeHTML(modules.find(m=>m.id===l.module).name)+'</button><span class="tag green">'+(state.done[l.id]?'✓ COMPLETED':'✦ 30 XP')+'</span></div><div class="eyebrow">FIELD GUIDE / '+escapeHTML(l.module.toUpperCase())+'</div><h1>'+escapeHTML(l.title)+'</h1><p class="desc">'+escapeHTML(l.subtitle)+'</p><div class="text-block"><h3>💡 The idea</h3><p>'+escapeHTML(l.body)+'</p><div class="callout"><strong>Try this:</strong> Read the code line by line. Predict what changes after each instruction before checking the answer.</div><div class="code-sample">'+escapeHTML(l.code)+'</div></div><div class="question"><div class="question-label">◈ KNOWLEDGE CHECK</div><h3>'+escapeHTML(l.question)+'</h3><div class="options">'+l.options.map((o,i)=>'<button class="option '+(selected!==undefined?(i===l.answer?'correct':i===selected?'wrong':''):'')+'" data-answer="'+i+'" '+(selected!==undefined?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+escapeHTML(o)+'</button>').join('')+'</div>'+(selected!==undefined?'<div class="feedback">'+(selected===l.answer?'✅ Correct. ':'💡 Keep going. ')+escapeHTML(l.why)+'</div>':'')+'</div><div class="actions"><button class="btn alt" data-page="lab">Explore visual lab ◎</button><button class="btn" data-action="next-lesson" '+(selected===undefined?'disabled':'')+'>Next lesson →</button></div></div>';}
function framesFor(mode){
 
if(mode==='linked'){
  const data=[[],[8],[8,3],[8,3,5],[3,5],[3,5,9]];
  return data.map((array,i)=>({array,focus:i?Math.min(array.length-1,Math.max(0,i-1)):-1,explain:['Start with an empty head pointer.','Insert 8 at the head.','Append 3 after 8.','Append 5 after 3.','Delete the head node 8; head now points to 3.','Append 9 and update the last next pointer.'][i]}));
}
if(mode==='queue'){
  const data=[[],[2],[2,4],[2,4,8],[4,8],[4,8,6]];
  return data.map((array,i)=>({array,focus:array.length-1,explain:['Queue begins empty.','enqueue(2): front and rear are 2.','enqueue(4): 2 remains the front.','enqueue(8): 8 becomes the rear.','dequeue(): remove front 2.','enqueue(6): 6 joins the rear.'][i]}));
}
if(mode==='tree'){
  const seq=[1,3,6,8,10,14];
  return [{array:[8,3,10,1,6,14],active:null,explain:'Inorder traversal: recursively visit left, then node, then right.'},...seq.map((active,i)=>({array:[8,3,10,1,6,14],active,visited:seq.slice(0,i+1),explain:'Visit '+active+'. Inorder so far: '+seq.slice(0,i+1).join(', ')}))];
}
if(mode==='heap'){
  const steps=[
    [[9,7,6,3,4],0,'Start with a valid max heap: every parent is ≥ its children.'],
    [[9,7,6,3,4,8],5,'Insert 8 at the next free leaf position.'],
    [[9,7,8,3,4,6],2,'8 is larger than its parent 6. Swap upward.'],
    [[6,7,8,3,4],0,'Extract max 9, then move the last item 6 to the root. Heap property now needs repair.'],
    [[8,7,6,3,4],0,'Heapify by swapping 6 with larger child 8. Done.']
  ];return steps.map(x=>({array:x[0],focus:x[1],explain:x[2]}));
}
if(mode==='hash'){
  const keys=[14,20,6,13],buckets=[[],[],[],[],[],[],[]],steps=[{buckets:buckets.map(x=>[...x]),explain:'Insert keys using h(key) = key % 7; each bucket uses chaining.'}];
  for(const key of keys){const b=key%7;buckets[b].push(key);steps.push({buckets:buckets.map(x=>[...x]),active:b,explain:'Hash '+key+' → '+b+'. '+(buckets[b].length>1?'Collision! Add to bucket '+b+' chain.':'Bucket '+b+' receives '+key+'.')});}
  return steps;
}
if(mode==='graph'||mode==='dfs'){
  const order=mode==='graph'?['A','B','C','D','E']:['A','B','D','C','E'];
  const method=mode==='graph'?'Breadth-first (queue)':'Depth-first (stack)';
  return [{visited:[],active:null,explain:method+' begins at A.'},...order.map((active,i)=>({visited:order.slice(0,i+1),active,explain:'Visit '+active+'. Order so far: '+order.slice(0,i+1).join(' → ')}))];
}
if(mode==='dijkstra'){
  const states=[
    ['A',{A:0,B:'∞',C:'∞',D:'∞',E:'∞'},'Initialize source A with distance 0. Others are infinity.'],
    ['A',{A:0,B:4,C:1,D:'∞',E:'∞'},'Relax edges from A: B=4, C=1.'],
    ['C',{A:0,B:3,C:1,D:6,E:'∞'},'Settle C. Relax C→B: 1+2=3, C→D: 1+5=6.'],
    ['B',{A:0,B:3,C:1,D:4,E:'∞'},'Settle B. B→D gives 3+1=4.'],
    ['D',{A:0,B:3,C:1,D:4,E:7},'Settle D. D→E gives 4+3=7.'],
    ['E',{A:0,B:3,C:1,D:4,E:7},'Settle E. Shortest path A→C→B→D→E costs 7.']
  ];return states.map(x=>({active:x[0],dist:x[1],explain:x[2]}));
}
if(mode==='recursion'){
  const data=[['sum(4)'],['sum(4)','sum(3)'],['sum(4)','sum(3)','sum(2)'],['sum(4)','sum(3)','sum(2)','sum(1)'],['sum(4)','sum(3)','sum(2)','sum(1)','sum(0)'],['sum(4)','sum(3)','sum(2)'],['sum(4)','sum(3)'],['sum(4)'],[]];
  return data.map((stack,i)=>({stack,explain:['Call sum(4).','sum(4) waits for sum(3).','sum(3) waits for sum(2).','sum(2) waits for sum(1).','Base case sum(0)=0; no more calls.','Return 1 to sum(2).','Return 3 to sum(3).','Return 6 to sum(4).','Return 10. Call stack is empty.'][i]}));
}
if(mode==='merge'){
  const data=[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,7],[1,2,3,4,7,8]];
  return data.map((array,i)=>({array,focus:i-1,explain:i?'Take next smallest remaining item: '+array[array.length-1]+'.':'Merge sorted halves [1,4,8] and [2,3,7] into one result.'}));
}
if(mode==='quick'){
  const steps=[
   [[7,2,9,5,1],3,'Choose 5 as pivot. Partition smaller keys left, larger keys right.'],
   [[2,7,9,5,1],0,'Move 2 into the left partition.'],
   [[2,1,9,5,7],1,'Move 1 into the left partition.'],
   [[2,1,5,9,7],2,'Place pivot 5 at its final index.'],
   [[1,2,5,7,9],2,'Recursively sort both partitions. Done.']
  ];return steps.map(x=>({array:x[0],focus:x[1],explain:x[2]}));
}

if(mode==='stack'){const items=[[],[4],[4,8],[4,8,2],[4,8],[4,8,9],[4,8]];const labels=['Empty stack — nothing to pop.','push(4) — 4 becomes the top.','push(8) — 8 becomes the top.','push(2) — 2 becomes the top.','pop() — remove 2.','push(9) — 9 becomes the top.','pop() — remove 9.'];return items.map((a,i)=>({array:a,focus:a.length-1,explain:labels[i]}));}
if(mode==='binary'){const arr=[2,4,6,8,10,12,14,16,18],out=[],target=14;let left=0,right=arr.length-1;while(left<=right){let mid=Math.floor((left+right)/2);out.push({array:arr,focus:mid,explain:'Range ['+left+'..'+right+']. Middle index '+mid+' holds '+arr[mid]+'. '+(arr[mid]===target?'Target found!':arr[mid]<target?'Go right.':'Go left.')});if(arr[mid]===target)break;if(arr[mid]<target)left=mid+1;else right=mid-1;}return out;}
let a=[7,3,9,1,5],steps=[{array:[...a],focus:-1,explain:'Bubble sort: compare adjacent items and swap those out of order.'}];for(let i=0;i<a.length-1;i++){let changed=false;for(let j=0;j<a.length-1-i;j++){steps.push({array:[...a],focus:j,focus2:j+1,explain:'Compare '+a[j]+' and '+a[j+1]+'. '+(a[j]>a[j+1]?'Swap them.':'Keep the order.')});if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];changed=true;steps.push({array:[...a],focus:j,focus2:j+1,explain:'Swapped! The larger value moves right.'});}}if(!changed)break;}steps.push({array:[...a],focus:-1,explain:'Sorted! Bubble sort has worst-case O(n²) time.'});return steps;
}

const labLabels={array:'Bubble sort',stack:'Stack operations',binary:'Binary search',linked:'Linked list',queue:'Queue operations',tree:'Tree traversal',heap:'Heap operations',hash:'Hash collisions',graph:'Graph BFS',dfs:'Graph DFS',dijkstra:'Dijkstra paths',recursion:'Recursion stack',merge:'Merge sort',quick:'Quick sort'};
let labTimer=null;
function stopLabAuto(){if(labTimer!==null){clearInterval(labTimer);labTimer=null;}}
function labSVG(mode,fr){
  const tree=mode==='tree'||mode==='heap';
  const nodes=tree?fr.array.map((v,i)=>({v:String(v),x:i===0?300:i===1?160:i===2?440:i===3?90:i===4?230:i===5?370:510,y: i===0?45:i<3?118:195})):
    [{v:'A',x:105,y:110},{v:'B',x:250,y:45},{v:'C',x:250,y:180},{v:'D',x:405,y:62},{v:'E',x:505,y:180}];
  const edges=tree?nodes.slice(1).map((_,i)=>[Math.floor((i+1-1)/2),i+1,'']):
    [[0,1,'4'],[0,2,'1'],[1,2,'2'],[1,3,'1'],[2,3,'5'],[3,4,'3']];
  const lines=edges.map(([a,b,w])=>'<line x1="'+nodes[a].x+'" y1="'+nodes[a].y+'" x2="'+nodes[b].x+'" y2="'+nodes[b].y+'" stroke="#44627e" stroke-width="3"/>'+(mode==='dijkstra'?'<text x="'+((nodes[a].x+nodes[b].x)/2)+'" y="'+((nodes[a].y+nodes[b].y)/2-8)+'" fill="#a8f063" font-size="13">'+w+'</text>':'')).join('');
  const circles=nodes.map(n=>{const isActive=tree?(fr.active===Number(n.v)||fr.focus===fr.array.indexOf(Number(n.v))):fr.active===n.v;const visited=fr.visited&&fr.visited.includes(tree?Number(n.v):n.v);return '<g><circle cx="'+n.x+'" cy="'+n.y+'" r="24" fill="'+(isActive?'#a8f063':visited?'#275c58':'#1a2a43')+'" stroke="'+(isActive?'#caff91':'#6886aa')+'" stroke-width="2"/><text x="'+n.x+'" y="'+(n.y+6)+'" text-anchor="middle" font-family="monospace" font-size="18" font-weight="bold" fill="'+(isActive?'#102414':'#eaf2ff')+'">'+n.v+'</text></g>';}).join('');
  const distances=mode==='dijkstra'&&fr.dist?'<text x="300" y="250" text-anchor="middle" fill="#bfcde2" font-size="14">Distances: '+Object.entries(fr.dist).map(([k,v])=>k+'='+v).join('  ·  ')+'</text>':'';
  return '<svg class="viz-svg" role="img" aria-label="'+(tree?'Binary tree diagram':'Graph diagram')+'" viewBox="0 0 600 265">'+lines+circles+distances+'</svg>';
}
function labVisual(fr,mode){
  if(mode==='tree'||mode==='heap'||mode==='graph'||mode==='dfs'||mode==='dijkstra')return labSVG(mode,fr);
  if(mode==='hash')return '<div class="hash-grid">'+fr.buckets.map((bucket,i)=>'<div class="hash-row '+(fr.active===i?'focus':'')+'"><span class="hash-index">h = '+i+'</span><span>'+(bucket.length?bucket.join(' → '):'empty')+'</span></div>').join('')+'</div>';
  if(mode==='recursion')return '<div class="stack-frame">'+(fr.stack.length?fr.stack.slice().reverse().map((v,i)=>'<div class="stack-call '+(i===0?'focus':'')+'">'+v+'</div>').join(''):'<span class="muted">Stack empty. sum(4) returns 10.</span>')+'</div>';
  if(mode==='linked'||mode==='queue')return fr.array.length?'<div class="linked-stage">'+fr.array.map((v,i)=>'<div class="linked-block"><span class="linked-label">'+(mode==='queue'?(i===0?'FRONT':i===fr.array.length-1?'REAR':'NODE '+i):(i===0?'HEAD':'NODE '+i))+'</span><div class="linked-cell '+(i===fr.focus?'focus':'')+'">'+v+'</div></div>'+(i<fr.array.length-1?'<div class="linked-arrow">→</div>':'<div class="linked-arrow">→ ∅</div>')).join('')+'</div>':'<span class="muted">Empty '+(mode==='queue'?'queue':'list')+'</span>';
  return fr.array.length?fr.array.map((v,i)=>'<div class="array-node '+(i===fr.focus||i===fr.focus2?'focus':'')+'">'+v+'<span>'+(mode==='stack'?(i===fr.array.length-1?'TOP':'node '+i):'['+i+']')+'</span></div>').join(''):'<span class="muted">Empty</span>';
}
function renderLab(){
  const frames=framesFor(labMode),fr=frames[Math.min(labStep,frames.length-1)];
  return '<div class="page"><div class="eyebrow">INTERACTIVE VISUALIZERS</div><h1>See the <span class="highlight">logic.</span></h1><p class="desc">Step through C++ data structures and algorithms. Follow changes in memory, ordering and graph visits.</p><div class="lab-layout"><div class="lab-panel"><h3>Choose an experiment</h3><div class="lab-select">'+Object.keys(labLabels).map((k,i)=>'<button class="lab-mode '+(labMode===k?'active':'')+'" data-lab="'+k+'"><span class="lab-num">'+String(i+1).padStart(2,'0')+'</span> '+labLabels[k]+'</button>').join('')+'</div><div class="note">Tip: predict the next change before pressing Next step. Use Auto play to watch the operation unfold.</div></div><div class="lab-panel"><div class="challenge-head"><h2>'+labLabels[labMode]+'</h2><span class="tag green">STEP '+(labStep+1)+' / '+frames.length+'</span></div><div class="viz-stage">'+labVisual(fr,labMode)+'</div><div class="viz-explain">'+escapeHTML(fr.explain)+'</div><div class="progress-track"><div class="progress-fill" style="width:'+Math.round((labStep+1)/frames.length*100)+'%"></div></div><div class="viz-controls" style="margin-top:18px"><button class="btn alt" data-action="lab-prev" '+(labStep===0?'disabled':'')+'>← Previous</button><button class="btn" data-action="lab-next" '+(labStep>=frames.length-1?'disabled':'')+'>Next step →</button><button class="btn outline" data-action="lab-auto">'+(labTimer===null?'▶ Auto play':'⏸ Pause')+'</button><button class="btn outline" data-action="lab-reset">↻ Reset</button></div><div class="note">Highlighted values mark the current operation; colored graph vertices show visits.</div></div></div></div>';
}
function renderPractice(){if(challengeId)return renderChallenge();const categories=['All',...new Set(challenges.map(c=>c.category))],filtered=challenges.filter(c=>challengeFilter==='All'||challengeFilter===c.category);return '<div class="page"><div class="eyebrow">SKILL BUILDER / CODE GYM</div><h1>Prove it with <span class="highlight">code.</span></h1><p class="desc">Write C++ yourself and check the output against a sample case. Passing a sample is a milestone; new missions also check extra hidden cases.</p><div class="filter-tabs">'+categories.map(c=>'<button data-filter="'+c+'" class="tab-button '+(challengeFilter===c?'active':'')+'">'+c+'</button>').join('')+'</div><div class="challenge-list">'+filtered.map((c,i)=>'<article class="challenge-item" data-challenge="'+c.id+'"><div><div class="tag '+(state.solved[c.id]?'green':'')+'">'+(state.solved[c.id]?'✓ SOLVED':'✦ 50 XP')+'</div><h3 style="margin-top:11px">'+escapeHTML(c.title)+'</h3><p>'+escapeHTML(c.desc)+'</p></div><div style="text-align:right;flex:none"><span class="tag">'+c.category.toUpperCase()+'</span><div style="color:var(--lime);font-size:25px;margin-top:8px">→</div></div></article>').join('')+'</div></div>';}
function renderChallenge(){const c=challengeFor(challengeId);if(!c){challengeId=null;return renderPractice();}const code=state.practiceCode[c.id]===undefined?c.starter:state.practiceCode[c.id];return '<div class="page"><div class="lesson-top"><button class="back-button" data-action="back-practice">← All challenges</button><span class="tag pink">'+c.category.toUpperCase()+'</span></div><div class="eyebrow">CODE MISSION / '+(challenges.findIndex(x=>x.id===c.id)+1).toString().padStart(2,'0')+'</div><h1>'+escapeHTML(c.title)+'</h1><div class="challenge-brief"><h3>Your mission</h3><p>'+escapeHTML(c.desc)+'</p><div class="kv">SAMPLE INPUT</div><pre>'+escapeHTML(c.input||'(none)')+'</pre><div class="kv">EXPECTED OUTPUT</div><pre>'+escapeHTML(c.expected)+'</pre><details style="margin-top:18px"><summary class="muted" style="cursor:pointer">Need a hint?</summary><p>'+escapeHTML(c.hint)+'</p></details></div>'+editorMarkup(code,true)+'<p class="note">The judge checks the sample and, where included, extra test cases. The browser interpreter supports a C++ subset; use the optional local compiler for full C++.</p></div>';}
function editorMarkup(code,isChallenge){return '<div class="editor-grid"><section class="editor-box"><div class="editor-top"><span><span class="file-dot"></span>'+(isChallenge?'solution.cpp':'main.cpp')+'</span><span class="muted">C++ · '+(fullRunnerUrl()?'full compiler':'browser interpreter')+'</span></div><textarea class="editor" id="codeEditor" spellcheck="false" aria-label="C++ code editor">'+escapeHTML(code)+'</textarea><div class="editor-tools"><span class="muted" style="font:11px var(--mono)">Ctrl/⌘ + Enter to run</span><div class="actions" style="margin:0"><button class="btn alt small" data-action="reset-code">↻ Reset</button><button class="btn small" data-action="run-code" id="runButton">▶ '+(isChallenge?'Run & check':'Run code')+'</button></div></div></section><section class="terminal-box"><div class="terminal-head"><span>⌁ TERMINAL / OUTPUT</span><span class="status" id="runnerStatus">'+consoleStatus+'</span></div><pre class="terminal-output" id="runnerOutput">'+escapeHTML(consoleText)+'</pre><div style="padding:0 14px 16px"><label for="stdin" class="form-label">STANDARD INPUT (stdin)</label><textarea class="field" id="stdin" rows="2" placeholder="Enter input separated by spaces or lines...">'+escapeHTML(isChallenge?challengeFor(challengeId).input:state.stdin)+'</textarea>'+(isChallenge?'':'<div class="actions" style="margin-top:9px"><button class="btn alt small" data-action="load-input">Load input.txt</button><button class="btn alt small" data-action="save-output">Save output.txt</button></div>')+'</div></section></div>';}

state.runnerUrl = typeof state.runnerUrl === 'string' ? state.runnerUrl : '';
state.browserOnly = Boolean(state.browserOnly);
function fullRunnerUrl(){
  if(state.browserOnly)return '';
  if(state.runnerUrl)return state.runnerUrl.replace(/\/+$/,'');
  if((location.hostname==='localhost'||location.hostname==='127.0.0.1')&&location.port==='8787')return location.origin;
  return '';
}
function renderRunnerSettings(){
  const url=fullRunnerUrl();
  return '<section class="card runner-settings"><div class="challenge-head"><div><h3>⚙ C++ execution mode</h3><p class="muted">Default: in-browser C++ subset. For STL, multiple source files and real fstream read/write, start the optional sandbox server described in README.</p></div><span class="tag '+(url?'green':'')+'">'+(url?'FULL C++ ENDPOINT':'BROWSER INTERPRETER')+'</span></div><label class="form-label" for="runnerEndpoint">FULL C++ SERVER URL (OPTIONAL)</label><div class="runner-setting-row"><input class="field" id="runnerEndpoint" type="url" placeholder="http://localhost:8787" value="'+escapeHTML(state.runnerUrl)+'"><button class="btn small" data-action="save-runner-url">Save URL</button><button class="btn alt small" data-action="clear-runner-url">Use browser</button></div><p class="note">Remote websites need an HTTPS compiler endpoint. Code sent to a configured server is processed there. Do not enter a server you do not trust.</p></section>';
}

function renderPlayground(){const filenames=Object.keys(state.files),active=state.files[state.activeFile]===undefined?'main.cpp':state.activeFile;return '<div class="page"><div class="eyebrow">YOUR OWN SPACE / CREATIVE MODE</div><h1>The <span class="highlight">playground.</span></h1><p class="desc">Experiment with supported C++ code and maintain a virtual collection of text files. The browser runner supports an educational C++ subset. Connect the optional full compiler server to compile multiple .cpp files and use virtual files with fstream.</p>'+editorMarkup(state.files['main.cpp'],false)+renderRunnerSettings()+'<div class="workspace-files card"><div class="challenge-head"><h2>▤ Virtual file workspace</h2><div class="actions" style="margin:0"><button class="btn alt small" data-action="add-file">+ New file</button><button class="btn alt small" data-action="import-file">↑ Import</button><input type="file" id="fileImport" accept=".txt,.cpp,.h,.hpp,.csv,.json,text/plain" hidden></div></div><p class="muted" style="font-size:13px">Files persist in this browser only, not on your device\'s actual disk.</p><div class="file-list">'+filenames.map(name=>'<button class="file-tab '+(active===name?'selected':'')+'" data-file="'+escapeHTML(name)+'">'+escapeHTML(name)+'</button>').join('')+'</div><label for="virtualFile" class="form-label">EDIT '+escapeHTML(active)+'</label><textarea class="editor field" style="min-height:160px" id="virtualFile" data-filename="'+escapeHTML(active)+'">'+escapeHTML(state.files[active])+'</textarea><div class="actions"><button class="btn alt small" data-action="download-file">↓ Download file</button><button class="btn alt small" data-action="delete-file" '+(active==='main.cpp'?'disabled':'')+'>Delete file</button><button class="btn alt small" data-action="export-project">↓ Backup files + XP</button><button class="btn alt small" data-action="import-project">↑ Restore backup</button><input type="file" id="projectImport" accept=".json" hidden></div><div class="note"><strong>Current runner limits:</strong> educational C++ subset (loops, arrays, pointers, functions, basic I/O). No full STL, fstream or multi-file compilation in browser mode. The optional isolated local backend mounts this virtual workspace for ordinary C++ file I/O. It never grants access to your device’s other files.</div></div></div>';}
function renderRoadmap(){return '<div class="page"><div class="eyebrow">COMP 2611 · THE BIG PICTURE</div><h1>Know where <span class="highlight">you’re going.</span></h1><p class="desc">A practical study roadmap for Data Structures at UWI St. Augustine. Topics are organized for learning and should be checked against the syllabus and lecture materials for your particular semester.</p>'+modules.map((m,i)=>'<div class="roadmap-line"><span class="tag">'+m.icon+'</span> <strong>'+escapeHTML(m.name)+'</strong><p>'+escapeHTML(m.blurb)+'</p><button class="btn alt small" style="margin-top:12px" data-module="'+m.id+'">Open lessons →</button></div>').join('')+'<div class="note">Learning activities, quizzes and algorithm visualizers are an independent study aid. This first release does not cover every assessment detail or offer fully validated C++ execution.</div></div>';}
function setOutput(output,status){consoleText=output;consoleStatus=status||'READY';const o=$('#runnerOutput'),s=$('#runnerStatus');if(o)o.textContent=consoleText;if(s)s.textContent=consoleStatus;}
const runnerUrl='https://cdn.jsdelivr.net/gh/felixhao28/JSCPP@gh-pages/dist/JSCPP.es5.min.js';

async function executeCPP(code,input,files){
  const remote=fullRunnerUrl();
  if(remote){
    const ac=new AbortController(),t=setTimeout(()=>ac.abort(),20000);
    try{
      const response=await fetch(remote+'/api/run',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({code,stdin:input||'',files:files||{'main.cpp':code}}),
        signal:ac.signal
      });
      const data=await response.json();
      if(!response.ok)throw Error(data.error||'Compiler service returned HTTP '+response.status);
      return {output:data.stdout||'',stderr:data.stderr||'',exitCode:data.exitCode,files:data.files||{},compiler:'g++'};
    }catch(err){
      if(err.name==='AbortError')throw Error('Compiler service timed out.');
      throw Error('Full compiler: '+err.message);
    }finally{clearTimeout(t);}
  }
  return new Promise((resolve,reject)=>{
    const workerCode='self.onmessage=function(e){try{importScripts('+JSON.stringify(runnerUrl)+');if(!self.JSCPP)throw Error("C++ interpreter unavailable");var output="";var rc=self.JSCPP.run(e.data.code,e.data.input,{stdio:{write:function(s){output+=s;if(output.length>100000)throw Error("Output limit reached")}}});self.postMessage({ok:true,output:output,exitCode:rc});}catch(err){self.postMessage({ok:false,error:String(err.message||err)})}};';
    let worker,url,timeout,finished=false;
    const done=(error,data)=>{if(finished)return;finished=true;clearTimeout(timeout);if(worker)worker.terminate();if(url)URL.revokeObjectURL(url);error?reject(error):resolve(data);};
    try{url=URL.createObjectURL(new Blob([workerCode],{type:'text/javascript'}));worker=new Worker(url);worker.onmessage=e=>{const d=e.data;d.ok?done(null,d):done(new Error(d.error));};worker.onerror=()=>done(new Error('Browser interpreter failed to load. Check internet connectivity.'));timeout=setTimeout(()=>done(new Error('Stopped after 5 seconds. Check for an infinite loop.')),5000);worker.postMessage({code,input});}catch(e){done(e);}
  });
}
function download(name,content,type){const blob=new Blob([content],{type:type||'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}

async function runEditor(){
  if(runBusy)return;
  const editor=$('#codeEditor'),stdin=$('#stdin');if(!editor)return;
  const code=editor.value,input=stdin?stdin.value:'';
  if(page==='playground'){state.files['main.cpp']=code;state.stdin=input;save();}
  if(page==='practice'){state.practiceCode[challengeId]=code;save();}
  runBusy=true;
  const btn=$('#runButton');if(btn)btn.disabled=true;
  setOutput('Running C++…','RUNNING');
  try{
    const inPlayground=page==='playground';
    const workingFiles=inPlayground?{...state.files}:{'main.cpp':code};
    const result=await executeCPP(code,input,workingFiles);
    const out=String(result.output||'');
    const err=String(result.stderr||'');
    const exit=Number(result.exitCode)||0;
    if(inPlayground){
      if(result.files&&result.compiler==='g++'){
        for(const [name,value] of Object.entries(result.files)){
          if(/^[\w.-]{1,64}$/.test(name)&&typeof value==='string'&&name!=='main.cpp')state.files[name]=value;
        }
      }
      if(result.compiler==='g++'){state.files['stdout.txt']=out;}else{state.files['output.txt']=out;}save();
      setOutput((out||'(no stdout)')+(err?'\n\nstderr:\n'+err:'')+'\n\n[process exited: '+exit+']',exit===0?'FINISHED':'EXIT '+exit);
    }else{
      const c=challengeFor(challengeId);
      const norm=s=>String(s||'').trim().replace(/\s+/g,' ');
      if(exit!==0||norm(out)!==norm(c.expected)){
        setOutput((out||'(no output)')+(err?'\n\n'+err:'')+'\n\n✕ Sample failed. Expected: '+c.expected,'TRY AGAIN');return;
      }
      const tests=Array.isArray(c.tests)?c.tests:[];
      for(let i=0;i<tests.length;i++){
        setOutput('Sample passed. Checking extra case '+(i+1)+' of '+tests.length+'…','TESTING');
        const t=tests[i],result2=await executeCPP(code,t.input,{'main.cpp':code});
        if(Number(result2.exitCode)!==0||norm(result2.output)!==norm(t.expected)){
          setOutput('Sample passed.\n✕ Extra test '+(i+1)+' failed.\nInput: '+t.input+'\nExpected: '+t.expected+'\nGot: '+(result2.output||'(no output)')+(result2.stderr?'\n'+result2.stderr:''),'TRY AGAIN');return;
        }
      }
      if(!state.solved[c.id]){state.solved[c.id]=true;award(50);}
      setOutput((out||'(no output)')+'\n\n✓ Passed sample'+(tests.length?' + '+tests.length+' extra tests':'')+'! +50 XP for your first solve.','PASSED');
    }
  }catch(e){setOutput('Error: '+e.message+'\n\nUse the browser C++ subset or configure the optional sandbox compiler.','ERROR');}
  finally{runBusy=false;if(btn)btn.disabled=false;}
}
app.addEventListener('click',async e=>{
const nav=e.target.closest('[data-page]');if(nav){navigate(nav.dataset.page);return;}
const module=e.target.closest('[data-module]');if(module){moduleId=module.dataset.module;lessonId=null;state.showModule=true;navigate('learn');return;}
const lesson=e.target.closest('[data-lesson]');if(lesson){lessonId=lesson.dataset.lesson;state.showModule=true;navigate('learn');return;}
const ch=e.target.closest('[data-challenge]');if(ch){challengeId=ch.dataset.challenge;consoleText='Write a solution, then run the sample test.';consoleStatus='READY';navigate('practice');return;}
const mode=e.target.closest('[data-lab]');if(mode){stopLabAuto();labMode=mode.dataset.lab;labStep=0;render();return;}
const filter=e.target.closest('[data-filter]');if(filter){challengeFilter=filter.dataset.filter;render();return;}
const file=e.target.closest('[data-file]');if(file){state.activeFile=file.dataset.file;save();render();return;}
const bossAns=e.target.closest('[data-boss-answer]');
if(bossAns&&bossState&&!bossState.ended&&bossState.selected===null){
  const q=bossState.questions[bossState.index],n=Number(bossAns.dataset.bossAnswer);
  bossState.selected=n;
  if(n!==q.answer)bossState.hearts=Math.max(0,bossState.hearts-1);
  render();return;
}
const ans=e.target.closest('[data-answer]');if(ans&&lessonId){const l=lessonFor(lessonId);state.answerSelections=state.answerSelections||{};if(state.answerSelections[l.id]!==undefined)return;const answer=Number(ans.dataset.answer);if(answer!==l.answer){toast('Not quite. Hint: '+l.why);return;}state.answerSelections[l.id]=answer;if(!state.done[l.id]){state.done[l.id]=true;award(30);}save();render();return;}
const btn=e.target.closest('[data-action]');if(!btn)return;const a=btn.dataset.action;
if(a==='boss-start')startBoss();
if(a==='boss-next'&&bossState&&bossState.selected!==null){
  if(bossState.hearts===0||bossState.index>=9){
    bossState.ended=true;bossState.win=bossState.hearts>0;
    if(bossState.win&&!state.bossVictories){state.bossVictories=1;award(150);}
    else if(bossState.win){state.bossVictories=(state.bossVictories||0)+1;save();}
  }else{bossState.index++;bossState.selected=null;}
  render();
}
if(a==='start-learning'){const next=lessons.find(l=>!state.done[l.id])||lessons[0];moduleId=next.module;lessonId=next.id;state.showModule=true;navigate('learn');}
if(a==='all-modules'){state.showModule=false;lessonId=null;render();}
if(a==='back-module'){lessonId=null;state.showModule=true;render();}
if(a==='next-lesson'){const index=lessons.findIndex(l=>l.id===lessonId),next=lessons[index+1];if(next){lessonId=next.id;moduleId=next.module;render();window.scrollTo(0,0);}else{lessonId=null;state.showModule=false;render();}}
if(a==='lab-next'){stopLabAuto();labStep=Math.min(labStep+1,framesFor(labMode).length-1);render();}
if(a==='lab-prev'){stopLabAuto();labStep=Math.max(labStep-1,0);render();}
if(a==='lab-reset'){stopLabAuto();labStep=0;render();}
if(a==='lab-auto'){
  if(labTimer!==null){stopLabAuto();render();}
  else{
    if(labStep>=framesFor(labMode).length-1)labStep=0;
    labTimer=setInterval(()=>{
      if(page!=='lab'){stopLabAuto();return;}
      labStep++;
      if(labStep>=framesFor(labMode).length-1){labStep=framesFor(labMode).length-1;stopLabAuto();}
      render();
    },1000);
    render();
  }
}
if(a==='back-practice'){challengeId=null;render();}
if(a==='run-code')await runEditor();
if(a==='save-runner-url'){
  let url=($('#runnerEndpoint')?.value||'').trim().replace(/\/+$/,'');
  if(url&&(!/^https?:\/\/[\w.-]+(?::\d+)?(?:\/[\w./-]*)?$/.test(url)|| (location.protocol==='https:'&&!url.startsWith('https://')))){
    toast('Enter a valid HTTPS endpoint, or run the site locally with the compiler server.');return;
  }
  state.runnerUrl=url;state.browserOnly=!url;save();render();toast(url?'Full C++ endpoint saved.':'Browser runner selected.');
}
if(a==='clear-runner-url'){state.runnerUrl='';state.browserOnly=true;save();render();toast('Browser runner selected.');}
if(a==='reset-code'){if(page==='playground'){state.files['main.cpp']=defaultCode;}else{state.practiceCode[challengeId]=challengeFor(challengeId).starter;}save();render();toast('Starter code restored.');}
if(a==='load-input'){$('#stdin').value=state.files['input.txt']||'';state.stdin=$('#stdin').value;save();toast('Loaded input.txt into stdin.');}
if(a==='save-output'){state.files['output.txt']=consoleText.split('\n\n[process exited:')[0];save();toast('Output saved to virtual file.');}
if(a==='add-file'){const name=prompt('New file name (e.g. notes.txt):');if(name===null)return;if(!/^[\w.-]{1,64}$/.test(name)||name==='.'||name==='..'){toast('Use letters, numbers, underscores, dots or hyphens.');return;}if(Object.prototype.hasOwnProperty.call(state.files,name)){toast('File already exists.');return;}state.files[name]='';state.activeFile=name;save();render();}
if(a==='download-file'){download(state.activeFile,state.files[state.activeFile]);}
if(a==='delete-file'){if(state.activeFile==='main.cpp')return;if(!confirm('Delete '+state.activeFile+' from browser storage?'))return;delete state.files[state.activeFile];state.activeFile='main.cpp';save();render();}
if(a==='import-file')$('#fileImport').click();
if(a==='export-project')download('dsa-quest-backup.json',JSON.stringify({version:3,files:state.files,progress:{xp:state.xp,done:state.done,solved:state.solved,answerSelections:state.answerSelections||{},practiceCode:state.practiceCode,lastDay:state.lastDay,streak:state.streak,bossVictories:state.bossVictories||0,questDone:state.questDone||{},questCode:state.questCode||{},questHints:state.questHints||{},questRevealed:state.questRevealed||{},questActive:state.questActive||null}},null,2),'application/json');
if(a==='import-project')$('#projectImport').click();
});
app.addEventListener('input',e=>{
if(e.target.id==='codeEditor'){if(page==='playground'){state.files['main.cpp']=e.target.value;save();}else if(page==='practice'){state.practiceCode[challengeId]=e.target.value;save();}}
if(e.target.id==='virtualFile'){state.files[e.target.dataset.filename]=e.target.value;if(e.target.dataset.filename==='main.cpp'&&$('#codeEditor'))$('#codeEditor').value=e.target.value;save();}
if(e.target.id==='stdin'&&page==='playground'){state.stdin=e.target.value;save();}
});
app.addEventListener('change',async e=>{
if(e.target.id==='fileImport'&&e.target.files[0]){const f=e.target.files[0];if(f.size>500000){toast('File is too large (max 500 KB).');return;}state.files[f.name]=await f.text();state.activeFile=f.name;save();render();toast('File imported.');}
if(e.target.id==='projectImport'&&e.target.files[0]){try{const d=JSON.parse(await e.target.files[0].text());if(!d.files||typeof d.files['main.cpp']!=='string')throw Error('Invalid project');const files={};for(const [k,v] of Object.entries(d.files)){if(/^[\w.-]{1,64}$/.test(k)&&typeof v==='string'&&v.length<500000)files[k]=v;}state.files=files;state.activeFile='main.cpp';
if(d.progress&&typeof d.progress==='object'){
  const p=d.progress;
  state.xp=Number.isFinite(p.xp)?Math.max(0,Math.min(p.xp,10000000)):state.xp;
  state.done=p.done&&typeof p.done==='object'?p.done:state.done;
  state.solved=p.solved&&typeof p.solved==='object'?p.solved:state.solved;
  state.answerSelections=p.answerSelections&&typeof p.answerSelections==='object'?p.answerSelections:{};
  state.practiceCode=p.practiceCode&&typeof p.practiceCode==='object'?p.practiceCode:state.practiceCode;
  state.lastDay=typeof p.lastDay==='string'?p.lastDay:state.lastDay;
  state.streak=Number.isInteger(p.streak)&&p.streak>=0?p.streak:state.streak;
  state.bossVictories=Number.isInteger(p.bossVictories)&&p.bossVictories>=0?p.bossVictories:(state.bossVictories||0);
  state.questDone=p.questDone&&typeof p.questDone==='object'?p.questDone:(state.questDone||{});
  state.questCode=p.questCode&&typeof p.questCode==='object'?p.questCode:(state.questCode||{});
  state.questHints=p.questHints&&typeof p.questHints==='object'?p.questHints:(state.questHints||{});
  state.questRevealed=p.questRevealed&&typeof p.questRevealed==='object'?p.questRevealed:(state.questRevealed||{});
  state.questActive=typeof p.questActive==='string'?p.questActive:null;
}
save();render();toast('Project and available learning progress restored.');}catch(err){toast('Could not restore this project.');}}
});
app.addEventListener('keydown',e=>{if(e.target.id==='codeEditor'){if(e.key==='Tab'){e.preventDefault();const t=e.target,start=t.selectionStart;t.setRangeText('  ',start,t.selectionEnd,'end');t.dispatchEvent(new Event('input',{bubbles:true}));}if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runEditor();}}});
document.addEventListener('click',e=>{const n=e.target.closest('.sidebar [data-page]');if(n)navigate(n.dataset.page);});
$('#menuToggle').addEventListener('click',()=>document.body.classList.toggle('menu-open'));
window.addEventListener('hashchange',()=>{const hash=location.hash.replace('#','');if(titleMap[hash])navigate(hash);});
if(titleMap[location.hash.replace('#','')])page=location.hash.replace('#','');
window.DSAQuestBridge={state,chapters:modules,lessons,challenges,award,save,toast,navigate,render,executeCPP,escapeHTML,fullRunnerUrl,openLab:(mode)=>{stopLabAuto();labMode=mode;labStep=0;navigate('lab');}};
render();
})();