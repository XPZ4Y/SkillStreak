"use client";

import { useState, useEffect } from 'react';
import './style.css';

const AudioPacks = {
  ding: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  thud: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  mc_achieve: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

const SoundEngine = {
  play(type: 'ding' | 'thud' | 'fanfare' | 'mc_achieve') {
    if (typeof window !== 'undefined') {
      try {
        const a = new Audio(AudioPacks[type]);
        a.volume = type === 'thud' ? 0.7 : type === 'mc_achieve' ? 0.8 : 0.4;
        a.play().catch(e => console.log('Audio playback blocked by browser', e));
      } catch (e) {
        console.error("Audio error:", e);
      }
    }
  }
};

// Judge0 CE public API for C/C++ execution
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
// Language IDs: C = 50, C++ = 54
const JUDGE0_LANG_IDS: Record<string, number> = { c: 50, cpp: 54 };

async function runWithJudge0(code: string, lang: 'c' | 'cpp'): Promise<{ stdout: string; stderr: string; compile_output: string }> {
  const langId = JUDGE0_LANG_IDS[lang];
  // Submit
  const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY', // User must supply their own RapidAPI key
    },
    body: JSON.stringify({ source_code: code, language_id: langId, stdin: '' })
  });
  const result = await submitRes.json();
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compile_output: result.compile_output || ''
  };
}

// --- DATA ---
const UNITS_PY: any[] = [
  {
    id: 1, name: 'Syntax & Structure',
    levels: [
      { id: 1, type: 'lesson', title: 'Welcome to Python', sub: 'The absolute basics', q: 'Python is a highly readable language. To output text to the screen, we use the print() function. Look at the example syntax below:', codeSnippet: 'print("Hello, World!")', reward: 50 },
      { id: 2, title: 'Output', sub: 'Your first line of Python', q: 'Which built-in outputs text to the terminal?', code: '<span class="cb">___</span>(<span class="cs">"Hello, World!"</span>)', opts: ['echo', 'print', 'write', 'log'], correct: 1, reward: 10 },
      { id: 3, type: 'lesson', title: 'Variables', sub: 'Binding names to values', q: 'Variables allow you to store data for later use. We use the equals sign "=" to assign a value to a name.', codeSnippet: 'score = 42\nname = "Shawn"', reward: 50 },
      { id: 4, title: 'Assigning', sub: 'Binding names', q: 'What operator assigns 42 to the variable score?', code: 'score <span class="cb">___</span> 42', opts: ['==', ':=', '=', '->'], correct: 2, reward: 15 },
      { id: 5, type: 'project', title: 'Module 1 Capstone', sub: 'Write it yourself', q: 'Create a variable called `message` and assign it the exact string `"Hello User"`.', code: 'message = ', validation: `assert 'message' in globals(), "You must define a variable named 'message'"\nassert message == "Hello User", "The message must be exactly 'Hello User'"`, solution: 'message = "Hello User"', reward: 100 },
    ]
  },
  {
    id: 2, name: 'Data Structures',
    levels: [
      { id: 6, type: 'lesson', title: 'Lists', sub: 'Ordered collections', q: 'Lists hold ordered collections of items. They are incredibly useful for grouping data. We create them using square brackets [].', codeSnippet: 'my_list = [1, 2, 3]\nempty_list = []', reward: 50 },
      { id: 7, title: 'List Syntax', sub: 'Creating a list', q: 'Which syntax creates an empty list?', code: 'items <span class="ck">=</span> <span class="cb">___</span>', opts: ['{}', '()', '[]', '<>'], correct: 2, reward: 20 },
      { id: 8, title: 'Length', sub: 'Measuring collections', q: 'Which function returns the number of items in a list?', code: 'count <span class="ck">=</span> <span class="cb">___</span>(items)', opts: ['size', 'count', 'length', 'len'], correct: 3, reward: 30 },
      { id: 9, type: 'project', title: 'Module 2 Capstone', sub: 'List Mastery', q: 'Create a list called `primes` containing exactly the numbers 2, 3, and 5. Then use the `.append()` method to add 7 to it.', code: '# Step 1: Create primes list\n\n# Step 2: Append 7\n', validation: `assert 'primes' in globals(), "You must define a variable 'primes'"\nassert type(primes) is list, "primes must be a list"\nassert primes == [2, 3, 5, 7], "primes must equal [2, 3, 5, 7] at the end"`, solution: 'primes = [2, 3, 5]\nprimes.append(7)', reward: 100 },
    ]
  },
  {
    id: 3, name: 'String Mastery',
    levels: [
      { id: 10, type: 'lesson', title: 'String Methods', sub: 'Manipulating text', q: 'Python strings come with powerful built-in methods. For instance, `.upper()` converts a string to uppercase.', codeSnippet: 'word = "hello"\nshout = word.upper() # "HELLO"', reward: 50 },
      { id: 11, title: 'Upper', sub: 'Changing case', q: 'What converts a string to all uppercase?', code: 'result <span class="ck">=</span> name.<span class="cb">___</span>()', opts: ['capitalize', 'upper', 'toUpper', 'toUpperCase'], correct: 1, reward: 20 },
      { id: 12, title: 'Strip', sub: 'Removing whitespace', q: 'Which removes leading and trailing whitespace?', code: 'clean <span class="ck">=</span> text.<span class="cb">___</span>()', opts: ['clean', 'trim', 'remove', 'strip'], correct: 3, reward: 25 },
      { id: 13, type: 'project', title: 'Module 3 Capstone', sub: 'Shouting Box', q: 'Create a variable `name` = "shawn". Then create a variable `shout` that equals `name` fully uppercased.', code: '# Write your code below\n', validation: `assert 'name' in globals(), "You must define 'name'"\nassert 'shout' in globals(), "You must define 'shout'"\nassert shout == "SHAWN", "shout must be 'SHAWN'"`, solution: 'name = "shawn"\nshout = name.upper()', reward: 100 },
    ]
  }
];

const UNITS_JS: any[] = [
  {
    id: 1, name: 'Syntax & Types',
    levels: [
      { id: 101, type: 'lesson', title: 'Welcome to JS', sub: 'The web language.', q: 'JavaScript powers the interactivity of the web. To print text, we use console.log().', codeSnippet: 'console.log("Hello Web!");', reward: 50 },
      { id: 102, title: 'Console', sub: 'Printing text', q: 'How do you print output in JS?', code: '<span class="cb">___</span>(<span class="cs">"Welcome"</span>);', opts: ['print', 'console.log', 'echo', 'out'], correct: 1, reward: 10 },
      { id: 103, type: 'lesson', title: 'Constants', sub: 'Immutable bindings', q: 'Use const to define variables that should not be reassigned. Use let for variables that will change.', codeSnippet: 'const maxScore = 100;\nlet current = 0;', reward: 50 },
      { id: 104, title: 'Let vs Const', sub: 'Declaration', q: 'Which keyword allows a variable to be reassigned later?', code: '<span class="cb">___</span> age = 21;', opts: ['final', 'const', 'let', 'var'], correct: 2, reward: 15 },
      { id: 105, type: 'project', title: 'Module 1 Capstone', sub: 'Declaring Data', q: 'Create a constant called `message` assigned to exactly `"Hello OS"`.', code: 'message = ', validation: `if(typeof message === 'undefined') throw new Error("message is not defined"); if(message !== "Hello OS") throw new Error("message must be 'Hello OS'");`, solution: 'const message = "Hello OS";', reward: 100 }
    ]
  },
  {
    id: 2, name: 'Arrays & Logic',
    levels: [
      { id: 106, type: 'lesson', title: 'Arrays', sub: 'Lists of data', q: 'Arrays hold ordered collections of items. They use zero-based indexing.', codeSnippet: 'const arr = [10, 20, 30];\nconsole.log(arr[0]); // Prints 10', reward: 50 },
      { id: 107, title: 'Pushing', sub: 'Adding to arrays', q: 'Which method adds an item to the end of an array in JS?', code: 'items.<span class="cb">___</span>(42);', opts: ['append', 'insert', 'add', 'push'], correct: 3, reward: 20 },
      { id: 108, type: 'project', title: 'Module 2 Capstone', sub: 'Array Building', q: 'Create an array called `nums` containing 1 and 2. Use `.push()` to add 3 to it.', code: '// Create nums and push 3\n', validation: `if(typeof nums === 'undefined') throw new Error("nums is not defined"); if(!Array.isArray(nums)) throw new Error("nums must be an array"); if(nums.length !== 3 || nums[2] !== 3) throw new Error("nums must equal [1, 2, 3]");`, solution: 'const nums = [1, 2];\nnums.push(3);', reward: 100 }
    ]
  }
];

// --- C CURRICULUM ---
const UNITS_C: any[] = [
  {
    id: 1, name: 'Foundations of C',
    levels: [
      {
        id: 201, type: 'lesson', title: 'Welcome to C', sub: 'The mother of languages', reward: 50,
        q: 'C is a powerful, low-level language that underpins most operating systems. Every C program starts with a main() function, and we use printf() to output text.',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
      },
      {
        id: 202, title: 'printf', sub: 'Printing output', reward: 10,
        q: 'Which function prints text to the terminal in C?',
        code: '#include &lt;stdio.h&gt;\nint main() {\n  <span class="cb">___</span>(<span class="cs">"Hello"</span>);\n  return 0;\n}',
        opts: ['print', 'cout', 'printf', 'echo'], correct: 2
      },
      {
        id: 203, type: 'lesson', title: 'Variables & Types', sub: 'Typed memory', reward: 50,
        q: 'In C, every variable must have a declared type. Common types include int (integer), float (decimal), and char (single character).',
        codeSnippet: 'int age = 25;\nfloat pi = 3.14;\nchar grade = \'A\';'
      },
      {
        id: 204, title: 'Declaring int', sub: 'Integer variables', reward: 15,
        q: 'Which keyword declares an integer variable in C?',
        code: '<span class="cb">___</span> score = 100;',
        opts: ['number', 'var', 'int', 'integer'], correct: 2
      },
      {
        id: 205, type: 'lesson', title: 'Format Specifiers', sub: 'Printing variables', reward: 50,
        q: 'To print a variable with printf, you use format specifiers. %d for integers, %f for floats, %s for strings, %c for characters.',
        codeSnippet: 'int x = 42;\nprintf("Value: %d\\n", x);\n// Output: Value: 42'
      },
      {
        id: 206, title: '%d Specifier', sub: 'Integer output', reward: 20,
        q: 'Which format specifier prints an integer in C?',
        code: 'printf(<span class="cs">"Score: <span class="cb">___</span>\\n"</span>, score);',
        opts: ['%s', '%c', '%f', '%d'], correct: 3
      },
      {
        id: 207, type: 'project', title: 'Module 1 Capstone', sub: 'Hello C World', reward: 100,
        q: 'Write a complete C program that prints exactly "Hello C" (no newline required). Include the stdio.h header and a proper main function.',
        code: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
        expectedOutput: 'Hello C',
        solution: '#include <stdio.h>\n\nint main() {\n    printf("Hello C");\n    return 0;\n}'
      }
    ]
  },
  {
    id: 2, name: 'Control Flow',
    levels: [
      {
        id: 208, type: 'lesson', title: 'if / else', sub: 'Branching logic', reward: 50,
        q: 'C uses if/else for conditional branching. The condition goes inside parentheses, and the body inside curly braces.',
        codeSnippet: 'int x = 10;\nif (x > 5) {\n    printf("Big\\n");\n} else {\n    printf("Small\\n");\n}'
      },
      {
        id: 209, title: 'Condition Syntax', sub: 'if statement', reward: 20,
        q: 'How do you write an if statement that checks if x equals 0?',
        code: '<span class="cb">___</span> (x == 0) {\n  printf("zero\\n");\n}',
        opts: ['when', 'check', 'if', 'else'], correct: 2
      },
      {
        id: 210, type: 'lesson', title: 'for Loops', sub: 'Repeating actions', reward: 50,
        q: 'The for loop in C has three parts: initialization, condition, and increment. It is the most common loop for counted iterations.',
        codeSnippet: 'for (int i = 0; i < 3; i++) {\n    printf("%d\\n", i);\n}\n// Prints: 0, 1, 2'
      },
      {
        id: 211, title: 'Loop Keyword', sub: 'for loop', reward: 25,
        q: 'Which keyword starts a counted loop in C?',
        code: '<span class="cb">___</span> (int i = 0; i < 5; i++) {\n  printf("%d\\n", i);\n}',
        opts: ['loop', 'repeat', 'while', 'for'], correct: 3
      },
      {
        id: 212, type: 'project', title: 'Module 2 Capstone', sub: 'Loop Counter', reward: 100,
        q: 'Write a C program that prints the numbers 1 through 5, each on its own line. Use a for loop.',
        code: '#include <stdio.h>\n\nint main() {\n    // Write your for loop here\n    \n    return 0;\n}',
        expectedOutput: '1\n2\n3\n4\n5',
        solution: '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}'
      }
    ]
  },
  {
    id: 3, name: 'Pointers & Memory',
    levels: [
      {
        id: 213, type: 'lesson', title: 'Pointers', sub: 'Memory addresses', reward: 50,
        q: 'A pointer stores the memory address of another variable. Use & to get an address, and * to dereference (get the value at that address).',
        codeSnippet: 'int x = 10;\nint *p = &x;  // p holds address of x\nprintf("%d\\n", *p); // prints 10'
      },
      {
        id: 214, title: 'Address-of', sub: '& operator', reward: 30,
        q: 'Which operator gives you the memory address of a variable?',
        code: 'int x = 5;\nint *p = <span class="cb">___</span>x;',
        opts: ['*', '#', '&', '@'], correct: 2
      },
      {
        id: 215, type: 'project', title: 'Module 3 Capstone', sub: 'Pointer Power', reward: 100,
        q: 'Write a C program that declares an int `val = 42`, creates a pointer `p` to it, and prints the value via the pointer using printf with %d.',
        code: '#include <stdio.h>\n\nint main() {\n    // Declare val and pointer p\n    \n    return 0;\n}',
        expectedOutput: '42',
        solution: '#include <stdio.h>\n\nint main() {\n    int val = 42;\n    int *p = &val;\n    printf("%d\\n", *p);\n    return 0;\n}'
      }
    ]
  }
];

// --- C++ CURRICULUM ---
const UNITS_CPP: any[] = [
  {
    id: 1, name: 'C++ Essentials',
    levels: [
      {
        id: 301, type: 'lesson', title: 'Welcome to C++', sub: 'C with superpowers', reward: 50,
        q: 'C++ extends C with object-oriented features. Instead of printf, C++ uses cout from the <iostream> library to output text.',
        codeSnippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}'
      },
      {
        id: 302, title: 'cout', sub: 'C++ output', reward: 10,
        q: 'Which object outputs text in C++?',
        code: '#include &lt;iostream&gt;\nusing namespace std;\nint main() {\n  <span class="cb">___</span> &lt;&lt; <span class="cs">"Hello"</span> &lt;&lt; endl;\n  return 0;\n}',
        opts: ['print', 'printf', 'cout', 'System.out'], correct: 2
      },
      {
        id: 303, type: 'lesson', title: 'Variables & Auto', sub: 'Modern type inference', reward: 50,
        q: 'C++ supports all C types, but also adds `auto` for type inference, letting the compiler deduce the type from the assigned value.',
        codeSnippet: 'int age = 25;\nauto name = std::string("Alice");\nauto pi = 3.14159;'
      },
      {
        id: 304, title: 'auto keyword', sub: 'Type inference', reward: 15,
        q: 'Which C++ keyword lets the compiler infer the variable type automatically?',
        code: '<span class="cb">___</span> score = 100;',
        opts: ['var', 'let', 'dynamic', 'auto'], correct: 3
      },
      {
        id: 305, type: 'lesson', title: 'std::string', sub: 'Text in C++', reward: 50,
        q: 'C++ has a powerful string type via <string>. Unlike C char arrays, std::string handles memory automatically and has many useful methods.',
        codeSnippet: '#include <string>\nstd::string name = "Alice";\ncout << name.length() << endl; // 5\ncout << name.substr(0, 3);     // Ali'
      },
      {
        id: 306, title: 'string length', sub: 'String methods', reward: 20,
        q: 'Which method returns the number of characters in a std::string?',
        code: 'std::string s = <span class="cs">"hello"</span>;\ncout &lt;&lt; s.<span class="cb">___</span>();',
        opts: ['size', 'len', 'count', 'length'], correct: 3
      },
      {
        id: 307, type: 'project', title: 'Module 1 Capstone', sub: 'Hello C++', reward: 100,
        q: 'Write a complete C++ program that outputs exactly "Hello C++" using cout. Include iostream and use namespace std.',
        code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
        expectedOutput: 'Hello C++',
        solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++";\n    return 0;\n}'
      }
    ]
  },
  {
    id: 2, name: 'OOP Fundamentals',
    levels: [
      {
        id: 308, type: 'lesson', title: 'Classes', sub: 'Blueprints for objects', reward: 50,
        q: 'C++ is an object-oriented language. A class is a blueprint for creating objects. It bundles data (fields) and behavior (methods) together.',
        codeSnippet: 'class Dog {\npublic:\n    string name;\n    void bark() {\n        cout << "Woof!" << endl;\n    }\n};'
      },
      {
        id: 309, title: 'class keyword', sub: 'Defining a class', reward: 25,
        q: 'Which keyword defines a class in C++?',
        code: '<span class="cb">___</span> Animal {\npublic:\n  string name;\n};',
        opts: ['struct', 'object', 'type', 'class'], correct: 3
      },
      {
        id: 310, type: 'lesson', title: 'Constructors', sub: 'Initializing objects', reward: 50,
        q: 'A constructor is a special method called when an object is created. It has the same name as the class and no return type.',
        codeSnippet: 'class Dog {\npublic:\n    string name;\n    Dog(string n) { name = n; }\n};\n\nDog d("Rex"); // creates a Dog named Rex'
      },
      {
        id: 311, title: 'Creating objects', sub: 'Instantiation', reward: 30,
        q: 'If Dog has a constructor taking a string, which line creates a Dog object named "Rex"?',
        code: 'Dog <span class="cb">___</span>;',
        opts: ['d = new Dog("Rex")', 'd("Rex")', 'd = Dog.new("Rex")', 'd("Rex")'], correct: 1
      },
      {
        id: 312, type: 'project', title: 'Module 2 Capstone', sub: 'Vector Explorer', reward: 100,
        q: 'Write a C++ program that creates a vector of ints containing 1, 2, 3, then prints each element on its own line using a for loop.',
        code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Create vector and print elements\n    \n    return 0;\n}',
        expectedOutput: '1\n2\n3',
        solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3};\n    for (int x : v) {\n        cout << x << endl;\n    }\n    return 0;\n}'
      }
    ]
  }
];

const BOTS = [{ name: 'Aiko', xp: 38000, av: 'bot1' }, { name: 'Renz', xp: 25000, av: 'bot2' }, { name: 'Nova', xp: 14000, av: 'bot3' }, { name: 'Zuko', xp: 8000, av: 'bot4' }];

const OB = [
  { g: '⌘', h: 'Skill<em>Streak</em>', p: 'The most refined way to master programming. One micro-lesson at a time.' },
  { g: '⌥', h: 'Guard Your <em>Hearts</em>', p: 'Every wrong answer breaks your streak and costs 1 Heart. Stay sharp.' },
];

// Language metadata
const LANG_META: Record<string, { label: string; icon: string; color: string }> = {
  py:  { label: 'Python',      icon: '🐍', color: '#3b82f6' },
  js:  { label: 'JavaScript',  icon: '⚡', color: '#f59e0b' },
  c:   { label: 'C',           icon: '⚙️', color: '#6366f1' },
  cpp: { label: 'C++',         icon: '🔷', color: '#0ea5e9' },
};

export default function Page() {
  const [S, setS] = useState<any>({
    streak: 0, gems: 100, xp: 0, best: 0, sel: null, hearts: 5, lastHeartLoss: null, projTries: 3,
    qi_py: 0, qi_js: 0, qi_c: 0, qi_cpp: 0, lang: null
  });
  
  const [onboarded, setOnboarded] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [view, setView] = useState('learn');
  const [challenge, setChallenge] = useState<any>(null);
  const [codeVal, setCodeVal] = useState<string>(''); 
  const [feedback, setFeedback] = useState<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [judge0ApiKey, setJudge0ApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [judge0Running, setJudge0Running] = useState(false);

  const [playCodeVal, setPlayCodeVal] = useState<string>('');
  const [playOut, setPlayOut] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [floaters, setFloaters] = useState<any[]>([]);
  const [toast, setToast] = useState<{title: string, desc: string, icon: string} | null>(null);

  const getUnitsForLang = (lang: string) => {
    if (lang === 'py') return UNITS_PY;
    if (lang === 'js') return UNITS_JS;
    if (lang === 'c') return UNITS_C;
    if (lang === 'cpp') return UNITS_CPP;
    return [];
  };

  const ACTIVE_UNITS = getUnitsForLang(S.lang || '');
  const ALL = ACTIVE_UNITS.flatMap(u => u.levels.map((l: any) => ({ ...l, unit: u })));
  const TOTAL = ALL.length;
  const currentQi = S[`qi_${S.lang}`] ?? 0;
  const done = TOTAL > 0 && currentQi >= TOTAL;

  const isCompiledLang = (lang: string) => lang === 'c' || lang === 'cpp';

  useEffect(() => {
    if (localStorage.getItem('ks_ob') === '1') {
      setOnboarded(true);
      boot();
    }

    if (typeof window !== 'undefined') {
      const initPy = async () => {
        try {
          (window as any).pyodideInstance = await (window as any).loadPyodide({
            stdout: (text: string) => {
              window.dispatchEvent(new CustomEvent('pyout', { detail: text + '\n' }));
            }
          });
          setPyReady(true);
        } catch (e) {
          console.error("Pyodide Load Failed", e);
        }
      };

      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = initPy;
        document.head.appendChild(script);
      } else if (!(window as any).pyodideInstance) {
        initPy();
      } else {
        setPyReady(true);
      }

      // Load saved Judge0 API key
      const savedKey = localStorage.getItem('ks_j0_key');
      if (savedKey) setJudge0ApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setPlayOut(prev => prev + e.detail);
    };
    window.addEventListener('pyout', handler);
    return () => window.removeEventListener('pyout', handler);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (S.hearts < 5 && S.lastHeartLoss) {
        const diffHrs = (Date.now() - S.lastHeartLoss) / 3600000;
        if (diffHrs >= 1) {
          const gained = Math.floor(diffHrs);
          const newH = Math.min(5, S.hearts + gained);
          const newS = { ...S, hearts: newH, lastHeartLoss: newH === 5 ? null : S.lastHeartLoss + (gained * 3600000) };
          setS(newS); save(newS);
        }
      }
    }, 10000);
    return () => clearInterval(iv);
  }, [S]);

  useEffect(() => {
    const defaults: Record<string, string> = {
      js: 'console.log("Welcome to JavaScript Sandbox!");',
      py: 'print("Welcome to Python Sandbox!")',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Welcome to C Sandbox!\\n");\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to C++ Sandbox!" << endl;\n    return 0;\n}'
    };
    if (S.lang && defaults[S.lang]) setPlayCodeVal(defaults[S.lang]);
  }, [S.lang]);

  const boot = () => {
    const savedState = {
      streak: +localStorage.getItem('ks_s')! || 0,
      gems: +localStorage.getItem('ks_g')! || 100,
      xp: +localStorage.getItem('ks_x')! || 0,
      qi_py: +localStorage.getItem('ks_q_py')! || 0,
      qi_js: +localStorage.getItem('ks_q_js')! || 0,
      qi_c: +localStorage.getItem('ks_q_c')! || 0,
      qi_cpp: +localStorage.getItem('ks_q_cpp')! || 0,
      best: +localStorage.getItem('ks_b')! || 0,
      hearts: localStorage.getItem('ks_h') ? +localStorage.getItem('ks_h')! : 5,
      lastHeartLoss: localStorage.getItem('ks_lhl') ? +localStorage.getItem('ks_lhl')! : null,
      lang: localStorage.getItem('ks_lang') || null,
      projTries: 3,
      sel: null
    };
    setS(savedState);
  };

  const save = (newState: any) => {
    localStorage.setItem('ks_s', newState.streak);
    localStorage.setItem('ks_g', newState.gems);
    localStorage.setItem('ks_x', newState.xp);
    localStorage.setItem('ks_q_py', newState.qi_py);
    localStorage.setItem('ks_q_js', newState.qi_js);
    localStorage.setItem('ks_q_c', newState.qi_c ?? 0);
    localStorage.setItem('ks_q_cpp', newState.qi_cpp ?? 0);
    localStorage.setItem('ks_b', newState.best);
    localStorage.setItem('ks_h', newState.hearts);
    if (newState.lang) localStorage.setItem('ks_lang', newState.lang);
    if (newState.lastHeartLoss) localStorage.setItem('ks_lhl', newState.lastHeartLoss);
    else localStorage.removeItem('ks_lhl');
  };

  const handleObNext = () => {
    const nextStep = obStep + 1;
    setObStep(nextStep);
  };

  const pickLang = (l: string) => {
    const nextS = { ...S, lang: l };
    setS(nextS); save(nextS);
    localStorage.setItem('ks_ob', '1');
    setOnboarded(true);
  };

  const openChallenge = (lv: any) => {
    if (lv.type !== 'lesson' && S.hearts === 0) {
      setFeedback({
        type: 'err', em: 'Out of Hearts.',
        body: `You have 0 Hearts remaining. Wait for regeneration or refill instantly.`,
        act: 'Refill Hearts (50 Gems)',
        isRefill: true
      });
      return;
    }
    setChallenge(lv);
    setS((prev: any) => ({ ...prev, sel: null, projTries: 3 }));
    if (lv.type === 'interactive' || lv.type === 'project') setCodeVal(lv.code || '');
  };

  const spawnFloater = (e: React.MouseEvent, text: string) => {
    if (!e) return;
    const id = Date.now() + Math.random();
    const dx = (Math.random() - 0.5) * 40;
    setFloaters(prev => [...prev, { id, text, x: e.clientX + dx - 20, y: e.clientY - 40 }]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const getUpdatedQiState = (inc = 1) => {
    const key = `qi_${S.lang}`;
    return { [key]: (S[key] ?? 0) + inc };
  };

  // Run C/C++ code via Judge0 and return trimmed stdout
  const runCompiledCode = async (code: string): Promise<{ output: string; error: string }> => {
    const key = judge0ApiKey || localStorage.getItem('ks_j0_key') || '';
    if (!key) {
      return { output: '', error: 'No Judge0 API key set. Please add your RapidAPI key in Settings.' };
    }
    try {
      const langId = JUDGE0_LANG_IDS[S.lang as 'c' | 'cpp'];
      const submitRes = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': key,
        },
        body: JSON.stringify({ source_code: code, language_id: langId, stdin: '' })
      });
      const result = await submitRes.json();
      const out = (result.stdout || '').trim();
      const err = (result.stderr || result.compile_output || '').trim();
      return { output: out, error: err };
    } catch (e: any) {
      return { output: '', error: e.message || 'Network error' };
    }
  };

  const onCheck = async (e?: React.MouseEvent) => {
    const lv = ALL[currentQi];
    if (!lv) return;

    if (lv.type === 'lesson') {
      SoundEngine.play('ding');
      const rwd = lv.reward || 50;
      if (e) spawnFloater(e, `+${rwd} XP`);
      const newState = { ...S, xp: S.xp + rwd, ...getUpdatedQiState() };
      setS(newState); save(newState);
      setFeedback({ type: 'ok', em: 'Lesson Complete.', body: `+${rwd} XP earned.`, act: currentQi + 1 >= TOTAL ? 'Finish Course →' : 'Continue →' });
      setChallenge(null);
      return;
    }

    if (lv.type === 'project' || lv.type === 'interactive') {
      if (!codeVal.trim()) return;
      let isCorrect = false;
      let errMsg = '';

      if (isCompiledLang(S.lang)) {
        // C / C++ — run via Judge0
        setJudge0Running(true);
        const { output, error } = await runCompiledCode(codeVal);
        setJudge0Running(false);
        if (error && !output) {
          errMsg = error;
          isCorrect = false;
        } else {
          const expected = (lv.expectedOutput || '').trim();
          const actual = output.trim();
          isCorrect = actual === expected;
          if (!isCorrect) errMsg = `Expected "${expected}" but got "${actual || '(no output)'}"`;
        }
      } else if (S.lang === 'py') {
        try {
          (window as any).pyodideInstance.runPython(codeVal + '\n' + lv.validation);
          isCorrect = true;
        } catch (err: any) {
          isCorrect = false;
          errMsg = err.message.split('\n').pop() || 'Execution failed';
        }
      } else {
        try {
          const fn = new Function(`${codeVal}\n${lv.validation}`);
          fn();
          isCorrect = true;
        } catch (err: any) {
          isCorrect = false;
          errMsg = err.message || 'Execution failed';
        }
      }

      if (isCorrect) {
        if (lv.type === 'project') {
          SoundEngine.play('mc_achieve');
          setToast({ title: 'Achievement Get!', desc: lv.title + ' Passed', icon: '🏆' });
          setTimeout(() => setToast(null), 4000);
        } else {
          SoundEngine.play(currentQi >= TOTAL - 1 ? 'fanfare' : 'ding');
        }
        if (e) spawnFloater(e, `+${lv.reward} Gems`);
        const newState = { ...S, gems: S.gems + lv.reward, xp: S.xp + lv.reward * 10, streak: S.streak + 1, best: Math.max(S.best, S.streak + 1), ...getUpdatedQiState() };
        setS(newState); save(newState);
        setFeedback({ type: 'ok', em: 'Passed!', body: `Amazing! +${lv.reward} gems earned.`, act: currentQi + 1 >= TOTAL ? 'Finish Course →' : 'Continue →' });
      } else {
        SoundEngine.play('thud');
        triggerShake();
        const newTries = Math.max(0, S.projTries - 1);
        const newState = { ...S, projTries: newTries };
        setS(newState); save(newState);

        if (newTries > 0) {
          setFeedback({ type: 'err', em: 'Test Failed.', body: `${errMsg}. You have ${newTries} tries left.`, act: 'Try Again' });
        } else {
          setFeedback({ type: 'err', em: 'Project Failed.', body: `${errMsg}. Out of tries. Study the solution to continue.`, act: 'Show Solution', isShowSolution: true });
        }
      }
      setChallenge(null);
      return;
    }

    // Multiple choice
    if (S.sel === null) return;
    const isCorrect = (S.sel === lv.correct);

    if (isCorrect) {
      SoundEngine.play(currentQi >= TOTAL - 1 ? 'fanfare' : 'ding');
      if (e) spawnFloater(e, `+${lv.reward} Gems`);
      const newState = {
        ...S, gems: S.gems + lv.reward, xp: S.xp + lv.reward * 10,
        streak: S.streak + 1, best: Math.max(S.best, S.streak + 1),
        ...getUpdatedQiState()
      };
      setS(newState); save(newState);
      setFeedback({ type: 'ok', em: 'Correct.', body: `+${lv.reward} gems earned. Streak: ${newState.streak}`, act: currentQi + 1 >= TOTAL ? 'View Results →' : 'Next Level →' });
    } else {
      SoundEngine.play('thud');
      triggerShake();
      const newH = Math.max(0, S.hearts - 1);
      const newState = { ...S, hearts: newH, streak: 0, lastHeartLoss: newH < 5 && S.hearts === 5 ? Date.now() : S.lastHeartLoss };
      setS(newState); save(newState);
      setFeedback({
        type: 'err', em: 'Wrong.', body: `Streak lost. −1 Heart. ${newH === 0 ? '(Out of hearts!)' : 'Try again.'}`,
        act: newH === 0 ? 'Refill Hearts (50 Gems)' : 'Try Again', isRefill: newH === 0
      });
    }
    setChallenge(null);
    setCodeVal('');
  };

  const handleFeedbackAck = () => {
    if (feedback.isRefill) {
      if (S.gems >= 50) {
        const ns = { ...S, gems: S.gems - 50, hearts: 5, lastHeartLoss: null };
        setS(ns); save(ns); setFeedback(null); SoundEngine.play('ding');
      } else {
        alert("Not enough gems to refill hearts!"); setFeedback(null);
      }
      return;
    }
    if (feedback.isShowSolution) {
      const lv = ALL[currentQi];
      setCodeVal(lv.solution);
      setS((prev: any) => ({ ...prev, projTries: 3 }));
      setFeedback(null); setChallenge(lv);
      return;
    }
    setFeedback(null);
  };

  const runPlayground = async () => {
    setPlayOut('');
    if (isCompiledLang(S.lang)) {
      const key = judge0ApiKey || localStorage.getItem('ks_j0_key') || '';
      if (!key) { setPlayOut('⚠️ No Judge0 API key. Set it via the ⚙️ button above.'); return; }
      setJudge0Running(true);
      setPlayOut('Running...');
      const { output, error } = await runCompiledCode(playCodeVal);
      setJudge0Running(false);
      setPlayOut(output || error || '(no output)');
    } else if (S.lang === 'py') {
      if (!pyReady) return;
      try { (window as any).pyodideInstance.runPython(playCodeVal); }
      catch (err: any) { setPlayOut(prev => prev + '\n' + err.message); }
    } else {
      const oldLog = console.log;
      let logs = "";
      console.log = (...args) => { logs += args.join(' ') + '\n'; };
      try {
        const fn = new Function(playCodeVal); fn();
        setPlayOut(logs || 'Finished (no output).');
      } catch (err: any) {
        setPlayOut(logs + '\nError: ' + err.message);
      } finally { console.log = oldLog; }
    }
  };

  // Onboarding
  if (!onboarded || !S.lang) {
    if (obStep < OB.length) {
      const o = OB[obStep];
      return (
        <div className="ob">
          <div className="ob-body">
            <div className="ob-glyph" dangerouslySetInnerHTML={{ __html: o.g }}></div>
            <div className="ob-h" dangerouslySetInnerHTML={{ __html: o.h }}></div>
            <div className="ob-p">{o.p}</div>
          </div>
          <div className="ob-foot">
            <div className="ob-dots">
              {OB.map((_, i) => <div key={i} className={`ob-dot ${i === obStep ? 'on' : ''}`}></div>)}
            </div>
            <button className="ob-btn" onClick={handleObNext}>
              {obStep === OB.length - 1 ? 'Start Learning →' : 'Continue'}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="ob">
          <div className="ob-body" style={{ justifyContent: 'center' }}>
            <div className="ob-h">Choose Your Path</div>
            <div className="ob-p">Which language do you want to master first?</div>
            <div className="lang-sel">
              {Object.entries(LANG_META).map(([key, meta]) => (
                <div className="lang-card" key={key} onClick={() => pickLang(key)}>
                  <div className="lang-ic">{meta.icon}</div>
                  <span>{meta.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  if (done) {
    return (
      <div className="done-screen on">
        <div className="done-glyph">✦</div>
        <div className="done-h">{LANG_META[S.lang]?.label} Mastery.</div>
        <div className="done-sub">You've finished all active modules. More content arriving soon.</div>
        <div className="done-stats">
          <div className="done-stat"><div className="done-val">{S.gems}</div><div className="done-lbl">Gems</div></div>
          <div className="done-stat"><div className="done-val">{S.best}</div><div className="done-lbl">Best</div></div>
          <div className="done-stat"><div className="done-val">{S.xp}</div><div className="done-lbl">XP</div></div>
        </div>
        <button className="done-restart" onClick={() => {
          const newState = { ...S, [`qi_${S.lang}`]: 0 };
          setS(newState); save(newState);
        }}>Play Again</button>
      </div>
    );
  }

  const pct = TOTAL === 0 ? 0 : Math.round((currentQi / TOTAL) * 100);
  const cycleLang = () => {
    const langs = Object.keys(LANG_META);
    const idx = langs.indexOf(S.lang);
    const next = langs[(idx + 1) % langs.length];
    pickLang(next);
  };

  return (
    <>
      {/* Judge0 API Key Modal */}
      {showApiKeyModal && (
        <div className="fb-ov on" style={{ zIndex: 300 }}>
          <div className="fb-sheet" style={{ borderTopColor: 'var(--gem)' }}>
            <div className="fb-em" style={{ color: 'var(--ink)', fontSize: '1.4rem' }}>⚙️ C/C++ Runtime Setup</div>
            <div className="fb-body">
              C and C++ require a free RapidAPI key for Judge0 CE to compile and run your code.{' '}
              <a href="https://rapidapi.com/judge0-official/api/judge0-ce" target="_blank" rel="noreferrer" style={{ color: 'var(--gem)' }}>
                Get your free key →
              </a>
            </div>
            <input
              type="text"
              placeholder="Paste your RapidAPI key here"
              value={judge0ApiKey}
              onChange={e => setJudge0ApiKey(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '1.5px solid var(--ghost)', fontFamily: 'var(--mono)',
                fontSize: '0.82rem', marginBottom: '12px', outline: 'none',
                background: 'var(--paper)', color: 'var(--ink)'
              }}
            />
            <button className="fb-act" style={{ background: 'linear-gradient(135deg,var(--gem),#be185d)', color: '#fff' }} onClick={() => {
              localStorage.setItem('ks_j0_key', judge0ApiKey);
              setShowApiKeyModal(false);
            }}>Save Key</button>
            <button onClick={() => setShowApiKeyModal(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: 'var(--mid)', cursor: 'pointer', fontSize: '0.88rem' }}>Cancel</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-achieve">
          <div className="toast-ic">{toast.icon}</div>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.desc}</div>
          </div>
        </div>
      )}
      {floaters.map(f => (
        <div key={f.id} className="floater" style={{ left: f.x, top: f.y }}>{f.text}</div>
      ))}
      <div className={`shell on ${isShaking ? 'shake' : ''}`}>
        <header className="topbar">
          <div className="wordmark">Skill<em>Streak</em></div>
          <div className="chips">
            <div className="chip" style={{ cursor: 'pointer', borderColor: LANG_META[S.lang]?.color || 'var(--gem)' }} onClick={cycleLang}>
              <div className="cdot g" style={{ background: LANG_META[S.lang]?.color || 'var(--gem)' }}></div>
              <span>{LANG_META[S.lang]?.icon} {LANG_META[S.lang]?.label} ▾</span>
            </div>
            {isCompiledLang(S.lang) && (
              <div className="chip" style={{ cursor: 'pointer' }} onClick={() => setShowApiKeyModal(true)}>
                <span>⚙️</span>
              </div>
            )}
            <div className="chip"><div className="cdot" style={{ background: '#e11d48' }}></div><span>{S.hearts}/5</span></div>
            <div className="chip"><div className="cdot f"></div><span>{S.streak}</span></div>
            <div className="chip"><div className="cdot g"></div><span>{S.gems}</span></div>
          </div>
        </header>

        <div className="main">
          {view === 'learn' && (
            <div className="view on">
              <div className="path-view">
                <div className="unit-hd">
                  <div className="unit-label">{LANG_META[S.lang]?.label} · Curriculum</div>
                  <div className="unit-name">{ACTIVE_UNITS[0]?.name || 'Course'}</div>
                  <div className="prog-row">
                    <div className="prog-track"><div className="prog-bar" style={{ width: `${pct}%` }}></div></div>
                    <div className="prog-num">{currentQi}/{TOTAL}</div>
                  </div>
                </div>
                <div className="levels">
                  {ACTIVE_UNITS.map((unit) => (
                    <div key={unit.id}>
                      <div className="unit-sep">
                        <span className="sep-label">Module {unit.id}</span>
                        <span className="sep-name">{unit.name}</span>
                        <div className="sep-line"></div>
                      </div>
                      {unit.levels.map((lv: any, i: number) => {
                        const gi = ALL.findIndex((l: any) => l.id === lv.id);
                        const state = gi < currentQi ? 'done' : gi === currentQi ? 'active' : 'locked';
                        let tag = state === 'done' ? 'complete' : state === 'active' ? 'current' : 'locked';
                        if (lv.type === 'lesson' && state !== 'done') tag = 'lesson';
                        if (lv.type === 'project' && state !== 'done') tag = 'project';

                        return (
                          <div className={`level-item ${state}`} key={lv.id}>
                            <div className="spine">
                              <div className="s-dot" style={lv.type === 'project' ? { borderRadius: '4px' } : {}}></div>
                              <div className="s-line"></div>
                            </div>
                            <div className={`lv-card ${state === 'active' ? 'tap' : ''}`} onClick={() => state === 'active' && openChallenge(lv)}>
                              <div className="lv-top">
                                <div className="lv-num">Step {i + 1}</div>
                                <div className="lv-tag" style={lv.type === 'project' && state === 'active' ? { background: '#f43f5e' } : lv.type === 'lesson' && state === 'active' ? { background: '#3f1d38' } : {}}>{tag}</div>
                              </div>
                              <div className="lv-title">{lv.title}</div>
                              <div className="lv-sub">{lv.sub}</div>
                              {state !== 'locked' && (
                                <div className="lv-footer">
                                  {lv.type !== 'lesson' && <div className="lv-gems"><div className="lv-gd"></div>{lv.reward} gems</div>}
                                  {lv.type === 'lesson' && <div className="lv-gems">+50 XP</div>}
                                  {state === 'active' && <div className="lv-arrow">→</div>}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'rank' && (
            <div className="view on">
              <Leaderboard xp={S.xp} />
            </div>
          )}

          {view === 'play' && (
            <div className="view play-view on">
              <div className="play-title">
                Playground {LANG_META[S.lang]?.icon}
                {isCompiledLang(S.lang) && !judge0ApiKey && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--err)', marginLeft: '10px', fontWeight: 600 }}>
                    ⚠️ API key required —{' '}
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowApiKeyModal(true)}>set it here</span>
                  </span>
                )}
              </div>
              <textarea
                className="play-code"
                value={playCodeVal}
                onChange={(e) => setPlayCodeVal(e.target.value)}
                spellCheck={false}
                placeholder={`// Write any ${LANG_META[S.lang]?.label} code here`}
              />
              <div className="play-run" onClick={runPlayground}>
                {judge0Running ? 'Compiling...' : S.lang === 'py' && !pyReady ? 'Loading Python...' : 'Run Code ▶'}
              </div>
              <div className="play-out">
                {playOut || `Ready for ${LANG_META[S.lang]?.label} output...`}
              </div>
            </div>
          )}
        </div>

        <nav className="botnav">
          <button className={`nav-btn ${view === 'learn' ? 'on' : ''}`} onClick={() => setView('learn')}>
            <div className="nav-ic">⊞</div><span>Learn</span>
          </button>
          <button className={`nav-btn ${view === 'play' ? 'on' : ''}`} onClick={() => setView('play')}>
            <div className="nav-ic">💻</div><span>Sandbox</span>
          </button>
          <button className={`nav-btn ${view === 'rank' ? 'on' : ''}`} onClick={() => setView('rank')}>
            <div className="nav-ic">◈</div><span>Rank</span>
          </button>
        </nav>

        {challenge && (
          <div className="overlay on">
            <div className="sheet">
              <div className="sh-handle"><div className="sh-bar"></div></div>
              <div className="sh-hd">
                <div className="sh-fname">step_{challenge.id}.{S.lang === 'cpp' ? 'cpp' : S.lang}</div>
                {challenge.type !== 'lesson' && <div className="sh-reward">+{challenge.reward} gems</div>}
                <button className="sh-close" onClick={() => setChallenge(null)}>✕</button>
              </div>
              <div className="sh-body">
                {challenge.type === 'lesson' ? (
                  <>
                    <div><div className="brief-lbl">Lesson</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">example</div></div>
                      <div className="code-inner">{challenge.codeSnippet}</div>
                    </div>
                  </>
                ) : challenge.type === 'project' ? (
                  <>
                    <div>
                      <div className="brief-lbl">Capstone Project • {S.projTries} Tries Left</div>
                      <div className="brief-q">{challenge.q}</div>
                      {isCompiledLang(S.lang) && challenge.expectedOutput && (
                        <div style={{ marginTop: '8px', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--mid)' }}>
                          Expected output: <code style={{ color: 'var(--ok)' }}>{challenge.expectedOutput}</code>
                        </div>
                      )}
                    </div>
                    <div className="code-wrap" style={{ background: 'transparent', padding: 0 }}>
                      <textarea
                        className="interactive-terminal"
                        value={codeVal}
                        onChange={(e) => setCodeVal(e.target.value)}
                        spellCheck={false}
                        placeholder="Write your code here"
                      />
                    </div>
                    {isCompiledLang(S.lang) && !judge0ApiKey && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--err)', textAlign: 'center' }}>
                        ⚠️ Set your Judge0 API key to submit C/C++ code.{' '}
                        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setChallenge(null); setShowApiKeyModal(true); }}>Configure</span>
                      </div>
                    )}
                    {S.lang === 'py' && !pyReady && <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>Loading Python Runtime...</div>}
                  </>
                ) : challenge.type === 'interactive' ? (
                  <>
                    <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap" style={{ background: 'transparent', padding: 0 }}>
                      <textarea
                        className="interactive-terminal"
                        value={codeVal}
                        onChange={(e) => setCodeVal(e.target.value)}
                        spellCheck={false}
                        placeholder="Write code here"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">{S.lang}</div></div>
                      <div className="code-inner" dangerouslySetInnerHTML={{ __html: challenge.code }}></div>
                    </div>
                    <div>
                      <div className="opts-lbl">Pick the correct answer</div>
                      <div className="opts-grid">
                        {challenge.opts.map((o: string, i: number) => (
                          <button key={i} className={`opt ${S.sel === i ? 'on' : ''}`} onClick={() => setS((prev: any) => ({ ...prev, sel: i }))}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="sh-ft">
                {challenge.type === 'lesson' ? (
                  <button className="check-btn" onClick={(e) => onCheck(e)}>Complete Lesson</button>
                ) : (
                  <button
                    className="check-btn"
                    disabled={
                      (challenge.type === 'interactive' || challenge.type === 'project')
                        ? (!codeVal.trim() || (S.lang === 'py' && !pyReady) || judge0Running)
                        : S.sel === null
                    }
                    onClick={(e) => onCheck(e)}
                  >
                    {judge0Running ? 'Compiling & Running...' :
                      S.lang === 'py' && !pyReady ? 'Downloading Python...' :
                        challenge.type === 'project' ? 'Submit Project' : 'Check Answer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="fb-ov on">
            <div className={`fb-sheet ${feedback.type}`}>
              <div className="fb-em">{feedback.em}</div>
              <div className="fb-body">{feedback.body}</div>
              <button className="fb-act" onClick={handleFeedbackAck}>{feedback.act}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const Leaderboard = ({ xp }: { xp: number }) => {
  const me = { name: 'You', xp, av: 'Alpha', me: true };
  const all = [...BOTS, me].sort((a, b) => b.xp - a.xp);
  const rank = all.findIndex(u => u.me) + 1;
  const rc = ['g', 's', 'b'];

  return (
    <div className="lb-view">
      <div className="lb-title">Rankings</div>
      <div className="lb-sub">Weekly · Global</div>
      <div className="lb-you">
        <div className="lb-you-rank">#{rank}</div>
        <img className="lb-av" src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=You" alt="" />
        <div className="lb-you-name">You</div>
        <div className="lb-you-xp">{xp.toLocaleString()} XP</div>
      </div>
      <div className="lb-rows">
        {all.map((u, i) => (
          <div className="lb-row" key={u.name}>
            <div className={`lb-rrank ${rc[i] || ''}`}>{['①', '②', '③'][i] || `#${i + 1}`}</div>
            <img className="lb-av" src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.av || u.name}`} alt="" />
            <div className="lb-rname">{u.name}</div>
            <div className="lb-rxp">{u.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};