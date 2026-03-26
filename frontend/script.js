const quests = [
    {
        id: 1,
        title: "Hello World",
        desc: "Print 'Hello Tracker' to the screen.",
        code: `<span class="hl-func">___</span>(<span class="hl-string">"Hello Tracker"</span>)`,
        options: ["echo", "print", "console.log", "printf"],
        correct: 1, 
        reward: 10
    },
    {
        id: 2,
        title: "Variables",
        desc: "Bind integer 5 to variable x.",
        code: `x ___ 5`,
        options: ["==", ":=", "=", "->"],
        correct: 2,
        reward: 15
    },
    {
        id: 3,
        title: "If Statement",
        desc: "Check if gems are sufficient.",
        code: `<span class="hl-keyword">___</span> gems > 0:
    <span class="hl-func">print</span>(<span class="hl-string">"Rich!"</span>)`,
        options: ["if", "when", "check", "while"],
        correct: 0,
        reward: 20
    },
    {
        id: 4,
        title: "For Loops",
        desc: "Loop 5 times exactly.",
        code: `<span class="hl-keyword">for</span> i <span class="hl-keyword">in</span> <span class="hl-func">range</span>(___):
    <span class="hl-func">print</span>(i)`,
        options: ["1, 5", "5", "0 to 5", "item"],
        correct: 1,
        reward: 25
    },
    {
        id: 5,
        title: "Functions",
        desc: "Define a usable function.",
        code: `<span class="hl-keyword">___</span> <span class="hl-func">login</span>():
    <span class="hl-keyword">return</span> <span class="hl-string">"Yes"</span>`,
        options: ["func", "function", "def", "let"],
        correct: 2,
        reward: 50
    }
];

const mockLeaderboard = [
    { id: '1', name: 'ZuckBot', score: 1450, avatar: 'Milo' },
    { id: '2', name: 'CodeNinja', score: 1200, avatar: 'Max' },
    { id: 'user', name: 'You', score: 0, avatar: 'Alpha' },
    { id: '4', name: 'NoobMaster69', score: 50, avatar: 'Oscar' }
];

let state = {
    streak: parseInt(localStorage.getItem('streak'), 10) || 0,
    gems: parseInt(localStorage.getItem('gems'), 10) || 100,
    xp: parseInt(localStorage.getItem('xp'), 10) || 0,
    activeQuestIndex: parseInt(localStorage.getItem('activeQuest'), 10) || 0,
    selectedOptionIndex: null
};

// UI Map
const ui = {};

function init() {
    // Map UI
    ui.app = document.getElementById('main-app');
    ui.obsOverlay = document.getElementById('onboarding-overlay');
    ui.obsBtn = document.getElementById('obs-next-btn');
    ui.streakCount = document.getElementById('streak-count');
    ui.gemCount = document.getElementById('gem-count');
    ui.pathContainer = document.getElementById('path-container');
    ui.progressFill = document.getElementById('unit-progress-fill');
    
    // Modal
    ui.modal = document.getElementById('challenge-modal');
    ui.closeBtn = document.getElementById('close-modal');
    ui.ideFilename = document.getElementById('ide-filename');
    ui.rewardAmount = document.getElementById('reward-amount');
    ui.cDesc = document.getElementById('challenge-desc');
    ui.cCode = document.getElementById('challenge-code');
    ui.cOptions = document.getElementById('challenge-options');
    ui.submitBtn = document.getElementById('submit-answer');
    
    // Feedback & Game Over
    ui.fdOverlay = document.getElementById('feedback-overlay');
    ui.fdPanel = document.getElementById('feedback-panel');
    ui.fdTitle = document.getElementById('feedback-title');
    ui.fdMsg = document.getElementById('feedback-msg');
    ui.fdBtn = document.getElementById('feedback-btn');
    ui.fdIcon = document.getElementById('feedback-icon');
    ui.gameOverScreen = document.getElementById('game-over');
    ui.restartBtn = document.getElementById('restart-btn');
    
    // Views
    ui.vLb = document.getElementById('view-leaderboard');
    ui.vQ = document.getElementById('view-quests');
    ui.lbList = document.getElementById('leaderboard-list');
    ui.lbUserCard = document.getElementById('lb-current-user-card');
    ui.navLBtn = document.getElementById('nav-leaderboard');
    ui.navQBtn = document.getElementById('nav-quests');

    checkOnboarding();
    setupNavigation();
    setupModalEvents();
}

function checkOnboarding() {
    if (localStorage.getItem('killstreak_onboarded') !== 'true') {
        ui.obsOverlay.classList.remove('hidden');
        let step = 1;
        const totalSteps = 3; // Reduced to 3 for brevity
        
        ui.obsBtn.addEventListener('click', () => {
            const currentStepEl = document.getElementById(`obs-${step}`);
            if (currentStepEl) currentStepEl.classList.add('hidden');
            
            const dots = document.querySelectorAll('.dot');
            if(dots[step-1]) dots[step-1].classList.remove('active');
            
            step++;
            if(step > totalSteps) {
                localStorage.setItem('killstreak_onboarded', 'true');
                ui.obsOverlay.classList.add('hidden');
                startApp();
            } else {
                const nextStepEl = document.getElementById(`obs-${step}`);
                if (nextStepEl) {
                    nextStepEl.classList.remove('hidden');
                    nextStepEl.classList.add('fade-in');
                }
                if (dots[step-1]) dots[step-1].classList.add('active');
                if(step === totalSteps) ui.obsBtn.textContent = "Start Coding";
            }
        });
    } else {
        ui.obsOverlay.classList.add('hidden');
        startApp();
    }
}

function startApp() {
    ui.app.classList.remove('hidden-initial');
    
    if(state.activeQuestIndex >= quests.length) {
        showGameOver();
    } else {
        updateStats();
        renderPath();
    }
}

function updateStats() {
    ui.streakCount.textContent = state.streak;
    ui.gemCount.textContent = state.gems;
    const progress = Math.min((state.activeQuestIndex / quests.length) * 100, 100);
    ui.progressFill.style.width = `${progress}%`;
}

function saveData() {
    localStorage.setItem('streak', state.streak.toString());
    localStorage.setItem('gems', state.gems.toString());
    localStorage.setItem('xp', state.xp.toString());
    localStorage.setItem('activeQuest', state.activeQuestIndex.toString());
}

function setupNavigation() {
    ui.navLBtn.addEventListener('click', () => {
        ui.navQBtn.classList.remove('active');
        ui.navLBtn.classList.add('active');
        ui.vQ.classList.add('hidden');
        ui.vLb.classList.remove('hidden');
        renderLeaderboard();
        window.scrollTo(0, 0);
    });
    
    ui.navQBtn.addEventListener('click', () => {
        ui.navLBtn.classList.remove('active');
        ui.navQBtn.classList.add('active');
        ui.vLb.classList.add('hidden');
        ui.vQ.classList.remove('hidden');
        window.scrollTo(0, 0);
    });
}

function renderPath() {
    ui.pathContainer.innerHTML = '';
    
    quests.forEach((q, i) => {
        const group = document.createElement('div');
        group.className = 'node-group';
        
        const node = document.createElement('button');
        node.className = 'path-node';
        
        if (i < state.activeQuestIndex) {
            node.classList.add('completed');
            node.innerHTML = '★';
        } else if (i === state.activeQuestIndex) {
            node.classList.add('active');
            node.innerHTML = '🐍';
            const ring = document.createElement('div');
            ring.className = 'node-ring';
            node.appendChild(ring);
            node.addEventListener('click', () => openChallenge(q));
        } else {
            node.classList.add('locked');
            node.innerHTML = '🔒';
        }
        
        group.appendChild(node);
        ui.pathContainer.appendChild(group);
    });
}

function openChallenge(q) {
    if (!q) return;
    state.selectedOptionIndex = null;
    ui.submitBtn.disabled = true;
    
    ui.ideFilename.innerHTML = `mission_${q.id}.py`;
    ui.rewardAmount.textContent = q.reward;
    ui.cDesc.textContent = q.desc;
    ui.cCode.innerHTML = q.code;
    
    ui.cOptions.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `> ${opt}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.selectedOptionIndex = idx;
            ui.submitBtn.disabled = false;
        });
        ui.cOptions.appendChild(btn);
    });
    
    ui.modal.classList.remove('hidden');
}

function setupModalEvents() {
    ui.closeBtn.addEventListener('click', () => {
        ui.modal.classList.add('hidden');
    });
    
    ui.submitBtn.addEventListener('click', () => {
        const q = quests[state.activeQuestIndex];
        if(!q) return;
        
        if (state.selectedOptionIndex === q.correct) {
            handleVictory(q);
        } else {
            handleDefeat();
        }
    });

    ui.restartBtn.addEventListener('click', () => {
        state.activeQuestIndex = 0;
        state.xp = 0;
        saveData();
        ui.gameOverScreen.classList.add('hidden');
        startApp();
    });
}

function handleVictory(q) {
    ui.modal.classList.add('hidden');
    ui.fdOverlay.classList.remove('hidden');
    ui.fdPanel.className = 'feedback-panel success';
    
    ui.fdIcon.textContent = '🚀';
    ui.fdTitle.textContent = "Success!";
    ui.fdMsg.textContent = `+${q.reward} Gems. Streak kept alive!`;
    ui.fdBtn.textContent = "Continue";
    
    state.gems += q.reward;
    state.xp += q.reward * 10;
    state.streak += 1;
    state.activeQuestIndex += 1;
    saveData();
    updateStats();
    
    ui.fdBtn.onclick = () => {
        ui.fdOverlay.classList.add('hidden');
        if (state.activeQuestIndex >= quests.length) {
            showGameOver();
        } else {
            renderPath();
        }
    };
}

function handleDefeat() {
    const editor = document.querySelector('.ide-editor');
    if(editor) {
        editor.classList.remove('shake');
        void editor.offsetWidth;
        editor.classList.add('shake');
    }
    
    setTimeout(() => {
        ui.modal.classList.add('hidden');
        ui.fdOverlay.classList.remove('hidden');
        ui.fdPanel.className = 'feedback-panel error';
        
        ui.fdIcon.textContent = '💀';
        ui.fdTitle.textContent = "Incorrect Syntax";
        ui.fdMsg.textContent = "You lost 5 Gems. Streak broken.";
        ui.fdBtn.textContent = "Try Again";
        
        state.gems = Math.max(0, state.gems - 5);
        state.streak = 0;
        saveData();
        updateStats();
        
        ui.fdBtn.onclick = () => {
            ui.fdOverlay.classList.add('hidden');
            openChallenge(quests[state.activeQuestIndex]);
        };
    }, 400); // Wait for shake to almost finish
}

function showGameOver() {
    ui.gameOverScreen.classList.remove('hidden');
    ui.app.classList.remove('hidden-initial'); // Ensure background is visible
    updateStats();
}

function renderLeaderboard() {
    const userEntry = mockLeaderboard.find(u => u.id === 'user');
    if(userEntry) userEntry.score = state.xp;
    
    mockLeaderboard.sort((a,b) => b.score - a.score);
    ui.lbList.innerHTML = '';
    
    const uRank = mockLeaderboard.findIndex(u => u.id === 'user') + 1;
    ui.lbUserCard.innerHTML = `
        <div class="lb-item">
            <div class="lb-rank">#${uRank}</div>
            <div class="lb-user">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${userEntry.avatar}" class="lb-avatar" />
                <span class="lb-name">${userEntry.name}</span>
            </div>
            <div class="lb-score">${userEntry.score} XP</div>
        </div>
    `;
    
    mockLeaderboard.forEach((user, i) => {
        const li = document.createElement('li');
        li.className = 'lb-item';
        li.innerHTML = `
            <div class="lb-rank">#${i+1}</div>
            <div class="lb-user">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}" class="lb-avatar" />
                <span class="lb-name">${user.name}</span>
            </div>
            <div class="lb-score">${user.score} XP</div>
        `;
        ui.lbList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', init);
