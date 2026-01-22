// ===== Configuration =====
const CONFIG = {
    // API endpoint - uses Netlify Functions for secure API key handling
    apiEndpoint: '/.netlify/functions/chat',
    // Conversation history for context
    conversationHistory: []
};


// ===== Simulation Scenarios (make it feel real) =====
const ST_SCENARIOS = {
  "city-bus": {
    label: "Walk → Wait → Bus (Basseterre run)",
    icon: "fa-bus",
    model: "piecewise",
    s0: 0, T: 10,
    segments: [
      { t0: 0, t1: 3, v: 1.2, note: "Walk to the bus stop" },
      { t0: 3, t1: 5, v: 0.0, note: "Wait at the stop" },
      { t0: 5, t1: 10, v: 8.0, note: "Bus into town" }
    ],
    story: "Leave home at 9:00, walk to the stop, wait, then catch the bus into Basseterre.",
    challenge: "Use the cursor to find A→B (waiting) and B→C (bus). Then describe what the graph tells you."
  },
  "scooter": {
    label: "Scooter Cruise",
    icon: "fa-motorcycle",
    s0: -2, u: 4.5, a: 0, T: 10,
    story: "A scooter cruises steadily along the island main road. Constant speed, no drama.",
    challenge: "Where is the slope constant? What does that say about acceleration?"
  },
  "sprinter": {
    label: "Sprinter Burst",
    icon: "fa-person-running",
    s0: 0, u: 1.0, a: 2.0, T: 8,
    story: "A student sprints off the start line and keeps accelerating for a few seconds.",
    challenge: "Find when the sprinter’s speed is 9 m/s. Estimate it by reading the slope."
  },
  "taxi-brake": {
    label: "Taxi Braking",
    icon: "fa-taxi",
    s0: 0, u: 8.0, a: -1.5, T: 10,
    story: "A taxi is moving fast then brakes to slow down near a junction.",
    challenge: "Find the time when the taxi momentarily stops (slope = 0). What happens after?"
  },
  "ferry-dock": {
    label: "Ferry Docking",
    icon: "fa-ship",
    s0: 0, u: 6.0, a: -0.8, T: 12,
    story: "A ferry approaches the dock and slows down steadily for a smooth stop.",
    challenge: "Pick a time and explain (in words) what the tangent tells you about docking."
  }
};

const VT_SCENARIOS = {
  "bike-hill": {
    label: "Bike Down a Hill",
    v0: 2.0, acc: 1.2, duration: 10,
    story: "You start rolling, then gravity helps you speed up down a gentle hill.",
    challenge: "At t = 6 s, estimate the displacement from the shaded area. Then verify the number."
  },
  "rollercoaster": {
    label: "Rollercoaster Dip",
    v0: 6.0, acc: 0.8, duration: 8,
    story: "Coaster enters a dip and speeds up for a short burst.",
    challenge: "Make the shaded area about 35 m. What cursor time gives that?"
  },
  "boat-throttle": {
    label: "Speedboat Throttle",
    v0: 0.0, acc: 2.5, duration: 6,
    story: "A speedboat throttles hard—rapid acceleration for a few seconds.",
    challenge: "Where is the acceleration easiest to read? Describe the tangent there."
  },
  "airport-runway": {
    label: "Runway Takeoff",
    v0: 10.0, acc: 1.0, duration: 12,
    story: "Plane is already rolling and continues accelerating down the runway.",
    challenge: "Estimate how far it travels in 10 s using the shaded area."
  },
  "traffic-light": {
    label: "Traffic Light Start",
    v0: 0.0, acc: 1.8, duration: 10,
    story: "Car starts from a red light and accelerates smoothly.",
    challenge: "Can you explain why the shaded area grows faster and faster?"
  }
};

/* =========================================================
   Missions + Exam-Style Questions (HTML-only upgrade)
   - 3 missions per scenario
   - Auto-check based on cursor / sliders
   - Question list + optional answer reveal
   ========================================================= */

function renderMissionList(prefix, missions) {
  const list = document.getElementById(`${prefix}-mission-list`);
  if (!list) return;
  list.innerHTML = missions.map((ms, idx) => `
    <div class="mission-card" data-mid="${ms.id}">
      <div class="mission-top">
        <div>
          <div class="mission-title">${idx+1}. ${ms.title}</div>
          <div class="mission-desc">${ms.goal}</div>
        </div>
        <div class="mission-badge" id="${prefix}-badge-${ms.id}">
          <i class="fas fa-hourglass"></i> In progress
        </div>
      </div>
      <div class="mission-actions">
        <div class="mission-hint"><i class="fas fa-lightbulb"></i> ${ms.hint || "Use the cursor + readouts to verify."}</div>
        <div class="mission-status wait" id="${prefix}-status-${ms.id}">Waiting…</div>
      </div>
    </div>
  `).join("");

  const prog = document.getElementById(`${prefix}-missions-progress`);
  if (prog) prog.textContent = `0/${missions.length}`;
}

function setQuestions(prefix, questions, answersHtml) {
  const qList = document.getElementById(`${prefix}-question-list`);
  if (qList) qList.innerHTML = (questions || []).map(q => `<li>${q}</li>`).join("");
  const ansBox = document.getElementById(`${prefix}-answers`);
  if (ansBox) ansBox.innerHTML = answersHtml || "";
}

function toggleAnswers(prefix) {
  const box = document.getElementById(`${prefix}-answers`);
  if (!box) return;
  box.classList.toggle("collapsed");
}

function updateMissionUI(prefix, missions, completedSet) {
  let done = 0;
  for (const ms of missions) {
    const badge = document.getElementById(`${prefix}-badge-${ms.id}`);
    const status = document.getElementById(`${prefix}-status-${ms.id}`);
    const isDone = completedSet.has(ms.id);
    if (isDone) done++;
    if (badge) {
      badge.classList.toggle("done", isDone);
      badge.innerHTML = isDone ? `<i class="fas fa-check"></i> Completed` : `<i class="fas fa-hourglass"></i> In progress`;
    }
    if (status) {
      status.classList.toggle("pass", isDone);
      status.classList.toggle("wait", !isDone);
      status.textContent = isDone ? "✅ Passed" : "Waiting…";
    }
  }
  const prog = document.getElementById(`${prefix}-missions-progress`);
  if (prog) prog.textContent = `${done}/${missions.length}`;
}

function updateMissionsRuntime(prefix, missions, completedSet, ctx) {
  if (!missions || !missions.length) return;
  let changed = false;
  for (const ms of missions) {
    if (completedSet.has(ms.id)) continue;
    try {
      if (typeof ms.check === "function" && ms.check(ctx)) {
        completedSet.add(ms.id);
        changed = true;
      }
    } catch (e) {
      // ignore mission check errors
    }
  }
  if (changed) updateMissionUI(prefix, missions, completedSet);
}

function ensureScenarioDefaults(sc, fallback={}) {
  return Object.assign({ model: "kinematic" }, fallback, sc || {});
}

/* ----- ST (Displacement–Time) Missions + Questions ----- */
const ST_MISSION_SETS = {
  "city-bus": [
    { id:"wait", title:"Find the WAITING interval (A → B)", goal:"Move the cursor between 3s and 5s so the tangent becomes flat. That means v(t)=0.", hint:"A flat line on s–t means not moving.", check:(ctx)=> ctx.t>=3.05 && ctx.t<=4.95 && Math.abs(ctx.v) <= 0.15 },
    { id:"walk", title:"Find the WALKING speed (O → A)", goal:"Move the cursor between 0s and 3s and read the slope (speed).", hint:"In O→A, the slope should be about 1.2 m/s.", check:(ctx)=> ctx.t>=0.2 && ctx.t<=2.8 && ctx.v>=0.8 && ctx.v<=1.6 },
    { id:"bus",  title:"Find the BUS speed (B → C)", goal:"Move the cursor after 5s. The slope should be much steeper than O→A.", hint:"In B→C, speed should be around 8 m/s.", check:(ctx)=> ctx.t>=5.2 && ctx.v>=6.0 }
  ],
  "scooter": [
    { id:"constv", title:"Constant speed check", goal:"Set acceleration to 0 (a=0). The tangent slope should be the same everywhere.", hint:"If the slope never changes, the speed is constant.", check:(ctx)=> Math.abs(ctx.a) <= 0.05 },
    { id:"readv", title:"Read v(t) from a tangent", goal:"Move the cursor to t=6s and record the slope value as v(6).", hint:"Try keeping your eye on the tangent line angle.", check:(ctx)=> Math.abs(ctx.t-6.0) <= 0.25 },
    { id:"predict", title:"Predict position from speed", goal:"At t=5s, estimate how far from start the scooter is by reading s(t).", hint:"Use the displayed s(t) readout.", check:(ctx)=> Math.abs(ctx.t-5.0) <= 0.25 }
  ],
  "sprinter": [
    { id:"targetv", title:"Hit a target speed", goal:"Adjust u and a so that v(5s) ≈ 8 m/s.", hint:"v(t)=u + a t. Aim for v(5)=8.", check:(ctx)=> Math.abs((ctx.u + ctx.a*5) - 8) <= 0.4 },
    { id:"fastest", title:"Find when speed is biggest", goal:"Move the cursor near the end and notice the slope increasing.", hint:"With positive acceleration, later = faster.", check:(ctx)=> ctx.t >= (ctx.T*0.7) },
    { id:"zero", title:"Make a moment of rest", goal:"Try to make v(t) = 0 at some time by using a negative u or a.", hint:"You can use negative initial velocity or negative acceleration.", check:(ctx)=> Math.abs(ctx.v) <= 0.2 }
  ],
  "taxi-brake": [
    { id:"stop", title:"Find the stopping moment", goal:"Move the cursor to the time when the tangent slope becomes 0.", hint:"v(t)=0 at the stop.", check:(ctx)=> Math.abs(ctx.v) <= 0.2 },
    { id:"decel", title:"Show uniform slowing", goal:"Set a negative acceleration (a<0). The slope should decrease over time.", hint:"A negative a makes the slope shrink.", check:(ctx)=> ctx.a < -0.2 },
    { id:"compare", title:"Early vs late slope", goal:"Compare slope at t=2s vs t=8s (late should be smaller).", hint:"Watch the tangent tilt reduce.", check:(ctx)=> Math.abs(ctx.t-8.0) <= 0.3 }
  ],
  "ferry-dock": [
    { id:"slow", title:"Docking = slowing down", goal:"Use a negative acceleration so the ferry’s speed reduces steadily.", hint:"Approaching dock means decreasing slope.", check:(ctx)=> ctx.a < -0.1 },
    { id:"nearzero", title:"Almost stopped", goal:"Move the cursor late in time and get v(t) close to 0.", hint:"Try near the end of the run.", check:(ctx)=> ctx.t>=ctx.T*0.7 && Math.abs(ctx.v)<=0.6 },
    { id:"sread", title:"Read a distance", goal:"At t=6s, read s(t) from the display.", hint:"Use the s(t) readout.", check:(ctx)=> Math.abs(ctx.t-6.0) <= 0.25 }
  ]
};

const ST_QUESTIONS = {
  "city-bus": {
    qs: [
      "Describe what is happening during the time from <strong>A to B</strong>.",
      "The section <strong>BC</strong> is much steeper than <strong>OA</strong>. What does this tell you about the motion?",
      "Sketch the <strong>speed–time</strong> graph for the person (use three levels: walk, wait, bus)."
    ],
    ans: `
      <h5>Answers (guide)</h5>
      <ol>
        <li>A→B is a flat section on a distance/displacement–time graph, so the person is <strong>not moving</strong> (waiting at the stop).</li>
        <li>BC being steeper means the speed is <strong>greater</strong> during BC (the bus is faster than walking).</li>
        <li>Speed–time sketch: a horizontal line at the walking speed (0–3s), then 0 speed (3–5s), then a higher horizontal line for the bus speed (5–10s).</li>
      </ol>`
  },
  "default": {
    qs: [
      "Pick two different times and compare the tangent slopes. What does that tell you about how speed is changing?",
      "Find a time where the slope is zero (if possible). What does that represent physically?"
    ],
    ans: `<h5>Answers (guide)</h5><ol><li>Slope comparison shows whether the object is speeding up or slowing down.</li><li>Slope = 0 means instantaneous velocity is 0 (momentarily at rest).</li></ol>`
  }
};

/* ----- VT (Velocity–Time) Missions + Questions ----- */
const VT_MISSION_SETS = {
  "bike-hill": [
    { id:"area", title:"Match target displacement", goal:"Move the cursor until the shaded area is about <strong>25 m</strong> (±2 m).", hint:"Area under v–t from 0→t is displacement.", check:(ctx)=> Math.abs(ctx.disp - 25) <= 2 },
    { id:"a0", title:"Make acceleration zero", goal:"Set acceleration to 0 so the v–t graph is flat.", hint:"Flat v–t means a(t)=0.", check:(ctx)=> Math.abs(ctx.acc) <= 0.05 },
    { id:"neg", title:"Create negative displacement", goal:"Make the shaded area negative (object moves backward overall).", hint:"Use a negative v0 or negative acceleration.", check:(ctx)=> ctx.disp < -5 }
  ],
  "rollercoaster": [
    { id:"slope", title:"Read acceleration from slope", goal:"Move the cursor to t=4s and read the tangent slope as a(4).", hint:"The slope value is acceleration.", check:(ctx)=> Math.abs(ctx.t-4.0) <= 0.3 },
    { id:"area35", title:"Hit 35 m displacement", goal:"Adjust v0/acc so that at some time the area is about <strong>35 m</strong> (±2 m).", hint:"Use the readout; experiment!", check:(ctx)=> Math.abs(ctx.disp - 35) <= 2 },
    { id:"stop", title:"Make velocity become zero", goal:"Set v0 and acc so that v(t) hits 0 at some time. Place the cursor where v(t)=0.", hint:"v(t)=v0+acc·t.", check:(ctx)=> Math.abs(ctx.v) <= 0.2 }
  ],
  "boat-throttle": [
    { id:"v8", title:"Make v(5) ≈ 8 m/s", goal:"Adjust v0 and acceleration so that at t=5s, v(t) is about 8 m/s.", hint:"v(5)=v0+5a.", check:(ctx)=> Math.abs((ctx.v0 + 5*ctx.acc) - 8) <= 0.5 },
    { id:"disp", title:"Match displacement 30 m", goal:"Move cursor to where displacement is 30 m (±2 m).", hint:"Watch shaded area.", check:(ctx)=> Math.abs(ctx.disp - 30) <= 2 },
    { id:"neg", title:"Go backwards briefly", goal:"Make velocity negative at the cursor (v(t) < 0).", hint:"Try negative v0 or negative acc.", check:(ctx)=> ctx.v < -0.2 }
  ],
  "airport-runway": [
    { id:"disp50", title:"Hit 50 m displacement", goal:"Move cursor until area is about 50 m (±2 m).", hint:"Area readout updates live.", check:(ctx)=> Math.abs(ctx.disp - 50) <= 2 },
    { id:"consta", title:"Constant acceleration show", goal:"Keep acceleration constant and describe what the v–t looks like.", hint:"A straight line means constant acceleration.", check:(ctx)=> true },
    { id:"slope", title:"Acceleration from tangent", goal:"At any time, the slope equals acceleration. Confirm it by reading both.", hint:"Slope readout ≈ acc slider.", check:(ctx)=> Math.abs(ctx.acc - ctx.slope) <= 0.25 }
  ],
  "traffic-light": [
    { id:"start", title:"Start from rest", goal:"Set v0=0 and confirm v(0)=0.", hint:"At t=0, velocity equals v0.", check:(ctx)=> (Math.abs(ctx.v0) <= 0.01 && Math.abs(ctx.t) <= 0.2) },
    { id:"area20", title:"Reach 20 m displacement", goal:"Move cursor until displacement is 20 m (±2 m).", hint:"Area under curve.", check:(ctx)=> Math.abs(ctx.disp - 20) <= 2 },
    { id:"a0", title:"Cruise (a=0)", goal:"Set acceleration to 0 and observe constant velocity.", hint:"Flat line.", check:(ctx)=> Math.abs(ctx.acc) <= 0.05 }
  ]
};

const VT_QUESTIONS = {
  "default": {
    qs: [
      "Calculate the acceleration at the cursor using the slope of the v–t graph.",
      "Estimate the displacement between 0 and your cursor time using the area under the graph.",
      "Sketch the corresponding acceleration–time graph for your motion (piecewise constant slopes)."
    ],
    ans: `<h5>Answers (guide)</h5><ol><li>Acceleration is the slope of v–t.</li><li>Displacement is the signed area under v–t.</li><li>Acceleration–time is constant on each straight-line segment (positive/zero/negative).</li></ol>`
  }
};



function setIcon(el, faName) {
  if (!el) return;
  el.innerHTML = `<i class="fas ${faName}"></i>`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function toggleCollapsed(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('is-collapsed');
}

// ===== DOM Elements =====
const elements = {
    navLinks: document.querySelectorAll('.nav-links a'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    navLinksContainer: document.querySelector('.nav-links'),
    topicModal: document.getElementById('topicModal'),
    topicContent: document.getElementById('topicContent'),
    chatMessages: document.getElementById('chat-messages'),
    userInput: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    quickBtns: document.querySelectorAll('.quick-btn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    practiceTabBtns: document.querySelectorAll('.practice-tab-btn'),
    practiceContents: document.querySelectorAll('.practice-content'),
    stepToggles: document.querySelectorAll('.step-toggle'),
    checkAnswerBtns: document.querySelectorAll('.check-answer')
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initPracticeProblems();
    initAITutor();
    initHeroAnimation();
    
    // API key is now securely handled server-side via Netlify Functions
    // No client-side API key needed!
});

// ===== Navigation =====
function initNavigation() {
    // Mobile menu toggle
    elements.mobileMenuBtn?.addEventListener('click', () => {
        elements.navLinksContainer.classList.toggle('active');
    });

    // Smooth scroll and active state
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            elements.navLinksContainer.classList.remove('active');
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Topic Content =====
const topicData = {
    kinematics: {
        title: 'Kinematics Basics',
        content: `
            <h2>2.1 Kinematics of Motion in a Straight Line</h2>
            
            <h3>Distance vs Displacement</h3>
            <div class="definition">
                <strong>Distance</strong> is the total length of the path traveled by an object. It is a scalar quantity (has magnitude only).
            </div>
            <div class="definition">
                <strong>Displacement</strong> is the shortest distance from the initial to the final position. It is a vector quantity (has both magnitude and direction).
            </div>
            
            <div class="example">
                <strong>Example:</strong> If you walk 3 m east and then 4 m north:
                <ul>
                    <li>Distance = 3 + 4 = 7 m</li>
                    <li>Displacement = √(3² + 4²) = 5 m (at an angle to the east)</li>
                </ul>
            </div>
            
            <h3>Speed vs Velocity</h3>
            <div class="definition">
                <strong>Speed</strong> is the rate of change of distance with respect to time. It is a scalar quantity.
                <div class="formula-box">Speed = Distance / Time</div>
            </div>
            <div class="definition">
                <strong>Velocity</strong> is the rate of change of displacement with respect to time. It is a vector quantity.
                <div class="formula-box">Velocity = Displacement / Time</div>
            </div>
            
            <h3>Key Differences</h3>
            <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Property</th>
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Distance/Speed</th>
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Displacement/Velocity</th>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Type</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Scalar</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Vector</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Can be negative?</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">No</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Yes</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Path dependent?</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Yes</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">No</td>
                </tr>
            </table>
        `
    },
    graphs: {
        title: 'Motion Graphs',
        content: `
            <h2>2.2 Graphs of Motion</h2>
            
            <h3>Displacement-Time Graphs</h3>
            <div class="definition">
                <strong>Key Features:</strong>
                <ul>
                    <li>The gradient (slope) represents velocity</li>
                    <li>A horizontal line means the object is stationary</li>
                    <li>A straight line with positive gradient means constant velocity forward</li>
                    <li>A straight line with negative gradient means constant velocity backward</li>
                    <li>A curved line means changing velocity (acceleration)</li>
                </ul>
            </div>
            
            <h3>Velocity-Time Graphs</h3>
            <div class="definition">
                <strong>Key Features:</strong>
                <ul>
                    <li>The gradient represents acceleration</li>
                    <li>The area under the graph represents displacement</li>
                    <li>A horizontal line means constant velocity (zero acceleration)</li>
                    <li>A line with positive gradient means positive acceleration</li>
                    <li>A line with negative gradient means deceleration</li>
                </ul>
            </div>
            
            <div class="example">
                <strong>Finding Displacement from v-t Graph:</strong>
                <p>For a velocity-time graph, the displacement is the area under the curve:</p>
                <ul>
                    <li>Rectangle: Area = base × height</li>
                    <li>Triangle: Area = ½ × base × height</li>
                    <li>Trapezium: Area = ½ × (sum of parallel sides) × height</li>
                </ul>
                <p>Note: Area below the time axis represents negative displacement (motion in opposite direction).</p>
            </div>
            
            <h3>Acceleration-Time Graphs</h3>
            <div class="definition">
                <strong>Key Features:</strong>
                <ul>
                    <li>The area under the graph represents change in velocity</li>
                    <li>A horizontal line at zero means constant velocity</li>
                    <li>A horizontal line above/below zero means constant acceleration/deceleration</li>
                </ul>
            </div>
        `
    },
    equations: {
        title: 'Kinematic Quantities',
        content: `
            <h2>2.3 SUVAT Equations</h2>
            
            <h3>The Five Variables</h3>
            <div class="definition">
                <ul>
                    <li><strong>s</strong> = displacement (m)</li>
                    <li><strong>u</strong> = initial velocity (m/s)</li>
                    <li><strong>v</strong> = final velocity (m/s)</li>
                    <li><strong>a</strong> = acceleration (m/s²)</li>
                    <li><strong>t</strong> = time (s)</li>
                </ul>
            </div>
            
            <h3>The SUVAT Equations</h3>
            <div class="formula-box">
                <p>\\(v = u + at\\)</p>
                <p>\\(s = ut + \\frac{1}{2}at^2\\)</p>
                <p>\\(s = vt - \\frac{1}{2}at^2\\)</p>
                <p>\\(v^2 = u^2 + 2as\\)</p>
                <p>\\(s = \\frac{(u + v)t}{2}\\)</p>
            </div>
            
            <h3>Choosing the Right Equation</h3>
            <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Equation</th>
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Missing Variable</th>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">v = u + at</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">s</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">s = ut + ½at²</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">v</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">s = vt - ½at²</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">u</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">v² = u² + 2as</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">t</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">s = (u+v)t/2</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">a</td>
                </tr>
            </table>
            
            <div class="example">
                <strong>Problem-Solving Strategy:</strong>
                <ol>
                    <li>List all known values (s, u, v, a, t)</li>
                    <li>Identify what you need to find</li>
                    <li>Choose the equation that contains your unknowns and knowns</li>
                    <li>Substitute and solve</li>
                    <li>Check your answer makes physical sense</li>
                </ol>
            </div>
        `
    },
    newton: {
        title: "Newton's Laws",
        content: `
            <h2>2.4 Newton's Laws of Motion</h2>
            
            <h3>Newton's First Law (Inertia)</h3>
            <div class="definition">
                An object remains at rest or in uniform motion in a straight line unless acted upon by an external force.
            </div>
            
            <h3>Newton's Second Law</h3>
            <div class="definition">
                The rate of change of momentum is proportional to the applied force and takes place in the direction of the force.
                <div class="formula-box">\\(F = ma\\)</div>
                <p>Where F is force (N), m is mass (kg), and a is acceleration (m/s²)</p>
            </div>
            
            <h3>Newton's Third Law</h3>
            <div class="definition">
                For every action, there is an equal and opposite reaction.
            </div>
            
            <h3>Forces on Inclined Planes</h3>
            <div class="formula-box">
                <p>Component of weight parallel to plane: \\(mg\\sin\\theta\\)</p>
                <p>Component of weight perpendicular to plane: \\(mg\\cos\\theta\\)</p>
                <p>Normal reaction: \\(R = mg\\cos\\theta\\)</p>
                <p>Friction force: \\(F_f = \\mu R = \\mu mg\\cos\\theta\\)</p>
            </div>
            
            <div class="example">
                <strong>Problem Setup for Inclined Plane:</strong>
                <ol>
                    <li>Draw a clear diagram showing all forces</li>
                    <li>Resolve forces parallel and perpendicular to the plane</li>
                    <li>Apply Newton's Second Law: ΣF = ma</li>
                    <li>For smooth planes, friction = 0</li>
                    <li>For rough planes, include friction force</li>
                </ol>
            </div>
            
            <h3>Connected Particles</h3>
            <div class="definition">
                When two particles are connected by a string over a pulley:
                <ul>
                    <li>The tension is the same throughout the string</li>
                    <li>Both particles have the same magnitude of acceleration</li>
                    <li>Apply F = ma to each particle separately</li>
                    <li>Solve the simultaneous equations</li>
                </ul>
            </div>
        `
    },
    calculus: {
        title: 'Calculus of Motion',
        content: `
            <h2>2.5-2.6 Calculus of Motion</h2>
            
            <h3>Differential Relationships</h3>
            <div class="formula-box">
                <p>Velocity: \\(v = \\frac{dx}{dt} = \\dot{x}\\)</p>
                <p>Acceleration: \\(a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2} = \\ddot{x}\\)</p>
                <p>Alternative: \\(a = v\\frac{dv}{dx}\\)</p>
            </div>
            
            <h3>Integration Relationships</h3>
            <div class="formula-box">
                <p>Displacement: \\(x = \\int v \\, dt\\)</p>
                <p>Velocity: \\(v = \\int a \\, dt\\)</p>
            </div>
            
            <div class="example">
                <strong>Example:</strong> If \\(x = t^3 - 5t^2 + 4\\)
                <p>Velocity: \\(v = \\frac{dx}{dt} = 3t^2 - 10t\\)</p>
                <p>Acceleration: \\(a = \\frac{dv}{dt} = 6t - 10\\)</p>
            </div>
            
            <h3>Variable Acceleration Problems</h3>
            <div class="definition">
                When acceleration is not constant:
                <ul>
                    <li>Cannot use SUVAT equations directly</li>
                    <li>Must use calculus (differentiation/integration)</li>
                    <li>Remember to include constants of integration</li>
                    <li>Use initial conditions to find constants</li>
                </ul>
            </div>
            
            <h3>Separable Differential Equations</h3>
            <div class="example">
                <strong>Method:</strong>
                <ol>
                    <li>Separate variables to get all x terms on one side and t terms on the other</li>
                    <li>Integrate both sides</li>
                    <li>Apply initial conditions to find constants</li>
                    <li>Solve for the required variable</li>
                </ol>
            </div>
        `
    },
    momentum: {
        title: 'Momentum & Impulse',
        content: `
            <h2>2.7 Conservation of Linear Momentum</h2>
            
            <h3>Linear Momentum</h3>
            <div class="definition">
                Momentum is the product of mass and velocity.
                <div class="formula-box">\\(p = mv\\)</div>
                <p>Units: kg·m/s or N·s</p>
                <p>Momentum is a vector quantity.</p>
            </div>
            
            <h3>Impulse</h3>
            <div class="definition">
                Impulse is the change in momentum.
                <div class="formula-box">
                    \\(J = \\Delta p = mv - mu\\)
                    <br>
                    \\(J = Ft\\) (for constant force)
                </div>
            </div>
            
            <h3>Conservation of Momentum</h3>
            <div class="definition">
                In a closed system with no external forces, the total momentum before collision equals the total momentum after collision.
                <div class="formula-box">\\(m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2\\)</div>
            </div>
            
            <h3>Types of Collisions</h3>
            <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="background: var(--primary-color); color: white;">
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Type</th>
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Momentum</th>
                    <th style="padding: 0.75rem; border: 1px solid var(--border-color);">Kinetic Energy</th>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Elastic</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Conserved</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Conserved</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Inelastic</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Conserved</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Not Conserved</td>
                </tr>
                <tr>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Perfectly Inelastic</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Conserved</td>
                    <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Maximum loss (objects stick together)</td>
                </tr>
            </table>
            
            <div class="example">
                <strong>Perfectly Inelastic Collision:</strong>
                <p>When objects stick together after collision:</p>
                <div class="formula-box">\\(m_1u_1 + m_2u_2 = (m_1 + m_2)v\\)</div>
                <p>Solving for final velocity:</p>
                <div class="formula-box">\\(v = \\frac{m_1u_1 + m_2u_2}{m_1 + m_2}\\)</div>
            </div>
        `
    }
};

function openTopic(topic) {
    const data = topicData[topic];
    if (data) {
        elements.topicContent.innerHTML = data.content;
        elements.topicModal.classList.add('active');
        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([elements.topicContent]);
        }
    }
}

function closeModal() {
    elements.topicModal.classList.remove('active');
}

// Close modal on outside click
elements.topicModal?.addEventListener('click', (e) => {
    if (e.target === elements.topicModal) {
        closeModal();
    }
});

// Make functions globally available
window.openTopic = openTopic;
window.closeModal = closeModal;

// ===== Animations =====
function initAnimations() {
    initDisplacementTimeAnimation();
    initVelocityTimeAnimation();
    initProjectileAnimation();
    initCollisionAnimation();
    initGraphLabAnimation();
    initTabSwitching();
}

function initTabSwitching() {
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            elements.tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ===== Displacement-Time Animation =====
let stChart = null;
let stAnimationId = null;

function initDisplacementTimeAnimation() {
    const canvas = document.getElementById('stChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Initialize chart
    stChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Displacement (m)',
                data: [],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Time (s)' }
                },
                y: {
                    title: { display: true, text: 'Displacement (m)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Slider event listeners
    const s0Slider = document.getElementById('s0-slider');
    const uSlider = document.getElementById('u-slider');
    const aSlider = document.getElementById('a-slider');
    
    [s0Slider, uSlider, aSlider].forEach(slider => {
        slider?.addEventListener('input', updateSTEquation);
    });
    
    // Play button
    document.getElementById('play-st')?.addEventListener('click', playSTAnimation);
    document.getElementById('reset-st')?.addEventListener('click', resetSTAnimation);
    
    updateSTEquation();
}

function updateSTEquation() {
    const s0 = parseFloat(document.getElementById('s0-slider')?.value || 0);
    const u = parseFloat(document.getElementById('u-slider')?.value || 5);
    const a = parseFloat(document.getElementById('a-slider')?.value || 0);
    
    document.getElementById('s0-val').textContent = s0;
    document.getElementById('u-val').textContent = u;
    document.getElementById('a-val').textContent = a;
    
    const aHalf = a / 2;
    let equation = `s = ${s0}`;
    if (u !== 0) equation += ` + ${u}t`;
    if (a !== 0) equation += ` + ${aHalf}t²`;
    
    document.getElementById('st-equation').textContent = equation;
}

function playSTAnimation() {
    if (stAnimationId) {
        cancelAnimationFrame(stAnimationId);
    }
    
    const s0 = parseFloat(document.getElementById('s0-slider')?.value || 0);
    const u = parseFloat(document.getElementById('u-slider')?.value || 5);
    const a = parseFloat(document.getElementById('a-slider')?.value || 0);
    
    const times = [];
    const displacements = [];
    let t = 0;
    const maxTime = 10;
    const dt = 0.1;
    
    stChart.data.labels = [];
    stChart.data.datasets[0].data = [];
    stChart.update();
    
    const movingObject = document.getElementById('moving-object');
    const track = document.querySelector('.motion-track');
    const trackWidth = track?.offsetWidth - 50 || 500;
    
    function animate() {
        if (t <= maxTime) {
            const s = s0 + u * t + 0.5 * a * t * t;
            
            times.push(t.toFixed(1));
            displacements.push(s);
            
            stChart.data.labels = times;
            stChart.data.datasets[0].data = displacements;
            stChart.update('none');
            
            // Update car position
            const normalizedPos = (s - s0) / (Math.abs(u * maxTime) + Math.abs(0.5 * a * maxTime * maxTime) || 1);
            const carPos = Math.max(10, Math.min(trackWidth, 10 + normalizedPos * (trackWidth - 20)));
            if (movingObject) {
                movingObject.style.left = carPos + 'px';
            }
            
            t += dt;
            stAnimationId = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function resetSTAnimation() {
    if (stAnimationId) {
        cancelAnimationFrame(stAnimationId);
    }
    
    stChart.data.labels = [];
    stChart.data.datasets[0].data = [];
    stChart.update();
    
    const movingObject = document.getElementById('moving-object');
    if (movingObject) {
        movingObject.style.left = '10px';
    }
}

// ===== Velocity-Time Animation =====
let vtChart = null;
let vtAnimationId = null;

function initVelocityTimeAnimation() {
    const canvas = document.getElementById('vtChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    vtChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Velocity (m/s)',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                fill: true,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Time (s)' }
                },
                y: {
                    title: { display: true, text: 'Velocity (m/s)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Slider event listeners
    const v0Slider = document.getElementById('v0-slider');
    const accSlider = document.getElementById('acc-slider');
    const durSlider = document.getElementById('dur-slider');
    
    [v0Slider, accSlider, durSlider].forEach(slider => {
        slider?.addEventListener('input', updateVTDisplay);
    });
    
    document.getElementById('play-vt')?.addEventListener('click', playVTAnimation);
    document.getElementById('reset-vt')?.addEventListener('click', resetVTAnimation);
    
    updateVTDisplay();
}

function updateVTDisplay() {
    document.getElementById('v0-val').textContent = document.getElementById('v0-slider')?.value || 0;
    document.getElementById('acc-val').textContent = document.getElementById('acc-slider')?.value || 2;
    document.getElementById('dur-val').textContent = document.getElementById('dur-slider')?.value || 10;
}

function playVTAnimation() {
    if (vtAnimationId) {
        cancelAnimationFrame(vtAnimationId);
    }
    
    const v0 = parseFloat(document.getElementById('v0-slider')?.value || 0);
    const acc = parseFloat(document.getElementById('acc-slider')?.value || 2);
    const duration = parseFloat(document.getElementById('dur-slider')?.value || 10);
    
    const times = [];
    const velocities = [];
    let t = 0;
    const dt = 0.2;
    let displacement = 0;
    
    vtChart.data.labels = [];
    vtChart.data.datasets[0].data = [];
    vtChart.update();
    
    function animate() {
        if (t <= duration) {
            const v = v0 + acc * t;
            
            times.push(t.toFixed(1));
            velocities.push(v);
            
            // Calculate displacement (area under curve)
            displacement = v0 * t + 0.5 * acc * t * t;
            document.getElementById('vt-displacement').textContent = displacement.toFixed(2);
            
            vtChart.data.labels = times;
            vtChart.data.datasets[0].data = velocities;
            vtChart.update('none');
            
            t += dt;
            vtAnimationId = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function resetVTAnimation() {
    if (vtAnimationId) {
        cancelAnimationFrame(vtAnimationId);
    }
    
    vtChart.data.labels = [];
    vtChart.data.datasets[0].data = [];
    vtChart.update();
    document.getElementById('vt-displacement').textContent = '0';
}

// ===== Projectile Motion Animation =====
let projAnimationId = null;

function initProjectileAnimation() {
    const canvas = document.getElementById('projCanvas');
    if (!canvas) return;
    
    const vSlider = document.getElementById('proj-v-slider');
    const angleSlider = document.getElementById('proj-angle-slider');
    
    [vSlider, angleSlider].forEach(slider => {
        slider?.addEventListener('input', updateProjectileDisplay);
    });
    
    document.getElementById('play-proj')?.addEventListener('click', playProjectileAnimation);
    document.getElementById('reset-proj')?.addEventListener('click', resetProjectileAnimation);
    
    updateProjectileDisplay();
    drawProjectileBackground(canvas);
}

function updateProjectileDisplay() {
    const v = parseFloat(document.getElementById('proj-v-slider')?.value || 50);
    const angle = parseFloat(document.getElementById('proj-angle-slider')?.value || 45);
    
    document.getElementById('proj-v-val').textContent = v;
    document.getElementById('proj-angle-val').textContent = angle;
    
    const g = 10;
    const angleRad = angle * Math.PI / 180;
    
    const maxHeight = (v * v * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * g);
    const range = (v * v * Math.sin(2 * angleRad)) / g;
    const flightTime = (2 * v * Math.sin(angleRad)) / g;
    
    document.getElementById('max-height').textContent = maxHeight.toFixed(2);
    document.getElementById('range').textContent = range.toFixed(2);
    document.getElementById('flight-time').textContent = flightTime.toFixed(2);
}

function drawProjectileBackground(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Draw grid
    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height - 30);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height - 30; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function playProjectileAnimation() {
    if (projAnimationId) {
        cancelAnimationFrame(projAnimationId);
    }
    
    const canvas = document.getElementById('projCanvas');
    const ctx = canvas.getContext('2d');
    
    const v = parseFloat(document.getElementById('proj-v-slider')?.value || 50);
    const angle = parseFloat(document.getElementById('proj-angle-slider')?.value || 45);
    const g = 10;
    const angleRad = angle * Math.PI / 180;
    
    const vx = v * Math.cos(angleRad);
    const vy = v * Math.sin(angleRad);
    
    const flightTime = (2 * vy) / g;
    const range = vx * flightTime;
    const maxHeight = (vy * vy) / (2 * g);
    
    const scale = Math.min((canvas.width - 60) / range, (canvas.height - 80) / maxHeight);
    
    let t = 0;
    const dt = 0.02;
    const path = [];
    
    function animate() {
        if (t <= flightTime) {
            const x = vx * t;
            const y = vy * t - 0.5 * g * t * t;
            
            const canvasX = 30 + x * scale;
            const canvasY = canvas.height - 30 - y * scale;
            
            path.push({ x: canvasX, y: canvasY });
            
            // Clear and redraw
            drawProjectileBackground(canvas);
            
            // Draw path
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (path.length > 0) {
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(point => ctx.lineTo(point.x, point.y));
            }
            ctx.stroke();
            
            // Draw projectile
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
            ctx.fill();
            
            t += dt;
            projAnimationId = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function resetProjectileAnimation() {
    if (projAnimationId) {
        cancelAnimationFrame(projAnimationId);
    }
    
    const canvas = document.getElementById('projCanvas');
    drawProjectileBackground(canvas);
}

// ===== Collision Animation =====
let collisionAnimationId = null;

function initCollisionAnimation() {
    const canvas = document.getElementById('collisionCanvas');
    if (!canvas) return;
    
    const sliders = ['m1-slider', 'v1-slider', 'm2-slider', 'v2-slider'];
    sliders.forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateCollisionDisplay);
    });
    
    document.getElementById('play-collision')?.addEventListener('click', playCollisionAnimation);
    document.getElementById('reset-collision')?.addEventListener('click', resetCollisionAnimation);
    
    updateCollisionDisplay();
    drawCollisionBackground(canvas);
}

function updateCollisionDisplay() {
    const m1 = parseFloat(document.getElementById('m1-slider')?.value || 5);
    const v1 = parseFloat(document.getElementById('v1-slider')?.value || 10);
    const m2 = parseFloat(document.getElementById('m2-slider')?.value || 3);
    const v2 = parseFloat(document.getElementById('v2-slider')?.value || -5);
    
    document.getElementById('m1-val').textContent = m1;
    document.getElementById('v1-val').textContent = v1;
    document.getElementById('m2-val').textContent = m2;
    document.getElementById('v2-val').textContent = v2;
    
    const initMomentum = m1 * v1 + m2 * v2;
    document.getElementById('init-momentum').textContent = initMomentum.toFixed(2);
    document.getElementById('final-momentum').textContent = initMomentum.toFixed(2);
    
    const finalV = initMomentum / (m1 + m2);
    document.getElementById('final-velocity').textContent = finalV.toFixed(2);
}

function drawCollisionBackground(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw track
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(0, canvas.height / 2 + 30, canvas.width, 20);
}

function playCollisionAnimation() {
    if (collisionAnimationId) {
        cancelAnimationFrame(collisionAnimationId);
    }
    
    const canvas = document.getElementById('collisionCanvas');
    const ctx = canvas.getContext('2d');
    
    const m1 = parseFloat(document.getElementById('m1-slider')?.value || 5);
    const v1 = parseFloat(document.getElementById('v1-slider')?.value || 10);
    const m2 = parseFloat(document.getElementById('m2-slider')?.value || 3);
    const v2 = parseFloat(document.getElementById('v2-slider')?.value || -5);
    const collisionType = document.getElementById('collision-type')?.value || 'inelastic';
    
    let x1 = 100;
    let x2 = canvas.width - 100;
    const y = canvas.height / 2;
    
    const r1 = 20 + m1 * 2;
    const r2 = 20 + m2 * 2;
    
    let currentV1 = v1;
    let currentV2 = v2;
    let collided = false;
    
    const finalV = (m1 * v1 + m2 * v2) / (m1 + m2);
    
    function animate() {
        drawCollisionBackground(canvas);
        
        // Check for collision
        if (!collided && Math.abs(x1 - x2) <= r1 + r2) {
            collided = true;
            if (collisionType === 'inelastic') {
                currentV1 = finalV;
                currentV2 = finalV;
            } else {
                // Elastic collision
                currentV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
                currentV2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
            }
        }
        
        // Update positions
        x1 += currentV1 * 0.5;
        x2 += currentV2 * 0.5;
        
        // Draw objects
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(x1, y, r1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${m1}kg`, x1, y + 5);
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x2, y, r2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(`${m2}kg`, x2, y + 5);
        
        // Continue animation if objects are on screen
        if (x1 > -50 && x1 < canvas.width + 50 && x2 > -50 && x2 < canvas.width + 50) {
            collisionAnimationId = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function resetCollisionAnimation() {
    if (collisionAnimationId) {
        cancelAnimationFrame(collisionAnimationId);
    }
    
    const canvas = document.getElementById('collisionCanvas');
    drawCollisionBackground(canvas);
    
    const ctx = canvas.getContext('2d');
    const m1 = parseFloat(document.getElementById('m1-slider')?.value || 5);
    const m2 = parseFloat(document.getElementById('m2-slider')?.value || 3);
    const r1 = 20 + m1 * 2;
    const r2 = 20 + m2 * 2;
    const y = canvas.height / 2;
    
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(100, y, r1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(canvas.width - 100, y, r2, 0, Math.PI * 2);
    ctx.fill();
}

// ===== Practice Problems =====
function initPracticeProblems() {
    // Tab switching
    elements.practiceTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            
            elements.practiceTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            elements.practiceContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${level}-problems`)?.classList.add('active');
        });
    });
    
    // Step toggles
    elements.stepToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const step = toggle.parentElement;
            step.classList.toggle('open');
        });
    });
    
    // Check answer buttons
    elements.checkAnswerBtns.forEach(btn => {
        btn.addEventListener('click', () => checkAnswer(btn.dataset.problem));
    });
}

async function checkAnswer(problemId) {
    const textarea = document.getElementById(`practice${problemId}-answer`) || 
                     document.getElementById(`${problemId}-answer`);
    const feedbackBox = document.getElementById(`practice${problemId}-feedback`) || 
                        document.getElementById(`${problemId}-feedback`);
    
    if (!textarea || !feedbackBox) return;
    
    const answer = textarea.value.trim();
    if (!answer) {
        feedbackBox.innerHTML = '<p>Please enter your solution before checking.</p>';
        feedbackBox.className = 'feedback-box show error';
        return;
    }
    
    // Show loading
    feedbackBox.innerHTML = '<p><span class="loading"></span> Analyzing your answer...</p>';
    feedbackBox.className = 'feedback-box show info';
    
    const problemTexts = {
        '1': 'A skier pushes off at the top of a slope with an initial speed of 2 m/s. She gains speed at a constant rate throughout her run. After 10 s she is moving at 6 m/s. Find an expression for her speed t seconds after she pushes off.',
        '2': 'A small block of mass 5 kg is pulled along a rough horizontal plane by a string inclined at 60° to the plane. There is a frictional force of 18 N. If the block has an acceleration of 3 m/s², find the tension in the string.',
        '3': 'A truck of mass 1200 kg is traveling at 4 m/s when it hits a buffer and is brought to rest in 3 seconds. What is the average force exerted by the buffer?',
        '4': 'During braking, the speed of a car is modeled by v = 40 - 2t² until it stops moving. How long does the car take to stop? How far does it move before it stops?',
        'exam1': 'A vehicle with a mass of 6000 kg is travelling at 2.5 m/s. It collides with another vehicle (2000 kg) moving at 1.3 m/s in the same direction. If they fuse after impact, calculate: (i) kinetic energy after impact, (ii) stopping distance with 1000 N braking force, (iii) stopping time.',
        'exam2': 'An elevator starts from rest with acceleration 2 m/s² until it reaches 4 m/s, then decelerates at 3 m/s² to rest. Calculate total time and distance. Also, for a projectile at 100 m/s at 30°, find max height and range.'
    };
    
    const response = await callAI(
        `You are a CAPE Applied Mathematics tutor grading a student's answer. Be encouraging but accurate.

Problem: ${problemTexts[problemId]}

Student's Answer:
${answer}

Please provide:
1. Whether the approach is correct
2. If there are any errors, explain them clearly
3. The correct solution with steps
4. A score out of the available marks
5. Tips for improvement

Format your response in a clear, educational way.`
    );
    
    if (response) {
        feedbackBox.innerHTML = formatAIResponse(response);
        feedbackBox.className = 'feedback-box show info';
    } else {
        feedbackBox.innerHTML = '<p>Unable to check your answer. Please make sure the API key is configured.</p>';
        feedbackBox.className = 'feedback-box show error';
    }
}

// ===== AI Tutor =====
function initAITutor() {
    elements.sendBtn?.addEventListener('click', sendMessage);
    elements.userInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    elements.quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            elements.userInput.value = question;
            sendMessage();
        });
    });
}

async function sendMessage() {
    const message = elements.userInput?.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    elements.userInput.value = '';
    
    // Show typing indicator
    const typingId = addTypingIndicator();
    
    // Call AI
    const response = await callAI(
        `You are an expert CAPE Applied Mathematics tutor specializing in Kinematics and Dynamics (Unit 2, Module 3). 
        
Your role is to:
1. Explain concepts clearly with examples
2. Guide students through problem-solving step by step
3. Use the SUVAT equations, Newton's Laws, and momentum principles appropriately
4. Provide practice problems when asked
5. Be encouraging and supportive

Use mathematical notation where appropriate. When showing equations, use clear formatting.

Student's question: ${message}`
    );
    
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    // Add AI response
    if (response) {
        addMessage(response, 'ai');
    } else {
        addMessage('I apologize, but I\'m having trouble connecting. Please check your API key configuration or try again later.', 'ai');
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = formatAIResponse(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    elements.chatMessages?.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise([contentDiv]);
    }
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.id = id;
    
    messageDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <p><span class="loading"></span> Thinking...</p>
        </div>
    `;
    
    elements.chatMessages?.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    return id;
}

function removeTypingIndicator(id) {
    document.getElementById(id)?.remove();
}

function formatAIResponse(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already
    if (!formatted.startsWith('<p>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    return formatted;
}

async function callAI(prompt) {
    // Add user message to conversation history
    CONFIG.conversationHistory.push({
        role: 'user',
        content: prompt
    });
    
    // Keep only last 10 messages for context (to avoid token limits)
    if (CONFIG.conversationHistory.length > 10) {
        CONFIG.conversationHistory = CONFIG.conversationHistory.slice(-10);
    }
    
    try {
        // Call Netlify Function (API key is securely stored server-side)
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: CONFIG.conversationHistory
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('API Error:', data.error);
            if (data.error && data.error.includes('API key not configured')) {
                return 'The AI tutor is not yet configured. Please ask your teacher to set up the OPENAI_API_KEY in Netlify environment variables.';
            }
            throw new Error(data.error || 'API request failed');
        }
        
        // Add AI response to conversation history
        const aiMessage = data.message;
        CONFIG.conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });
        
        return aiMessage;
    } catch (error) {
        console.error('AI API Error:', error);
        return null;
    }
}

// ===== Hero Animation =====
function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 400;
    
    let time = 0;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1
        });
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw sine wave
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin((x + time) * 0.02) * 50;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw moving car
        const carX = 50 + (time % 400);
        const carY = canvas.height - 80;
        
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(carX, carY, 40, 20);
        ctx.fillRect(carX + 5, carY - 15, 25, 15);
        
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.arc(carX + 10, carY + 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(carX + 30, carY + 20, 8, 0, Math.PI * 2);
        ctx.fill();
        
        time += 2;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


/* ============================
   Graph Relationships Lab
   s–t ↔ v–t ↔ a–t (slope/area)
============================ */
let glSTChart, glVTChart, glATChart;
let glData = null;
let glCursorAnimId = null;
let glCursorPlaying = false;

function glGetEl(id) { return document.getElementById(id); }

function glNum(x, fallback=0) {
    const v = parseFloat(x);
    return Number.isFinite(v) ? v : fallback;
}

function glClamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

function glBuildData() {
    const model = glGetEl('gl-model')?.value || 'constant_a';
    const T = glNum(glGetEl('gl-T')?.value, 10);
    const s0 = glNum(glGetEl('gl-s0')?.value, 0);
    const v0 = glNum(glGetEl('gl-v0')?.value, 5);
    const a0 = glNum(glGetEl('gl-a0')?.value, 2);

    const dt = 0.1; // stable + smooth enough
    const n = Math.floor(T / dt) + 1;

    const tArr = new Array(n);
    const aArr = new Array(n);
    const vArr = new Array(n);
    const sArr = new Array(n);

    // Acceleration model a(t)
    function aOf(t) {
        if (model === 'constant_v') return 0;
        if (model === 'constant_a') return a0;

        if (model === 'piecewise_a') {
            // 0 for first third, +a0 for middle third, -a0 for last third
            const p = t / T;
            if (p < 1/3) return 0;
            if (p < 2/3) return a0;
            return -a0;
        }

        // sine_a
        // 1 full cycle over T
        const omega = (2 * Math.PI) / T;
        return a0 * Math.sin(omega * t);
    }

    // Integrate a(t) -> v(t), and v(t) -> s(t) (trapezoid)
    let v = v0;
    let s = s0;

    for (let i = 0; i < n; i++) {
        const t = i * dt;
        tArr[i] = t;
        const a = aOf(t);
        aArr[i] = a;

        if (i === 0) {
            vArr[i] = v;
            sArr[i] = s;
            continue;
        }

        // Trapezoidal integration
        const aPrev = aArr[i - 1];
        v = v + 0.5 * (aPrev + a) * dt;
        vArr[i] = v;

        const vPrev = vArr[i - 1];
        s = s + 0.5 * (vPrev + v) * dt;
        sArr[i] = s;
    }

    // Numerical derivative for slope estimate of s(t): v ≈ ds/dt (central difference)
    const slopeArr = new Array(n);
    for (let i = 0; i < n; i++) {
        if (i === 0) {
            slopeArr[i] = (sArr[i+1] - sArr[i]) / dt;
        } else if (i === n - 1) {
            slopeArr[i] = (sArr[i] - sArr[i-1]) / dt;
        } else {
            slopeArr[i] = (sArr[i+1] - sArr[i-1]) / (2*dt);
        }
    }

    return { model, T, dt, tArr, sArr, vArr, aArr, slopeArr, s0, v0, a0 };
}

function glMakeChart(canvasId, yLabel, lineColor, fillColor) {
    const canvas = glGetEl(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                // main line
                {
                    label: yLabel,
                    data: [],
                    borderColor: lineColor,
                    backgroundColor: fillColor,
                    fill: false,
                    tension: 0.2,
                    pointRadius: 0
                },
                // shaded area (dynamic)
                {
                    label: 'area',
                    data: [],
                    borderColor: 'transparent',
                    backgroundColor: fillColor,
                    fill: true,
                    tension: 0.2,
                    pointRadius: 0
                },
                // cursor point
                {
                    label: 'cursor',
                    data: [],
                    borderColor: lineColor,
                    backgroundColor: lineColor,
                    showLine: false,
                    pointRadius: 5,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: yLabel } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function glUpdateDisplayNumbers(cursorIdx) {
    if (!glData) return;
    const { sArr, vArr, aArr, slopeArr, tArr, dt } = glData;

    const i = glClamp(cursorIdx, 0, tArr.length - 1);
    const t = tArr[i];
    const s = sArr[i];
    const v = vArr[i];
    const a = aArr[i];
    const slopeS = slopeArr[i];

    // Areas (integrals) using trapezoid up to i
    let areaV = 0;
    let areaA = 0;
    for (let k = 1; k <= i; k++) {
        areaV += 0.5 * (vArr[k-1] + vArr[k]) * dt; // displacement
        areaA += 0.5 * (aArr[k-1] + aArr[k]) * dt; // change in v
    }

    glGetEl('gl-t-val').textContent = t.toFixed(1);
    glGetEl('gl-s').textContent = s.toFixed(2);
    glGetEl('gl-v').textContent = v.toFixed(2);
    glGetEl('gl-a').textContent = a.toFixed(2);
    glGetEl('gl-area-v').textContent = areaV.toFixed(2);
    glGetEl('gl-area-a').textContent = areaA.toFixed(2);
    glGetEl('gl-slope-s').textContent = slopeS.toFixed(2);
}

function glUpdateCharts() {
    glData = glBuildData();
    const { tArr, sArr, vArr, aArr, T } = glData;

    // Update slider readouts
    glGetEl('gl-T-val').textContent = T;
    glGetEl('gl-s0-val').textContent = glGetEl('gl-s0')?.value ?? '0';
    glGetEl('gl-v0-val').textContent = glGetEl('gl-v0')?.value ?? '5';
    glGetEl('gl-a0-val').textContent = glGetEl('gl-a0')?.value ?? '2';

    // Cursor slider range depends on T
    const cursor = glGetEl('gl-cursor');
    if (cursor) {
        cursor.max = String(T);
        cursor.value = String(glClamp(glNum(cursor.value, 0), 0, T));
    }

    // Chart data: x labels as time
    const labels = tArr.map(t => t.toFixed(1));

    function setChart(chart, series, yLabel) {
        if (!chart) return;
        chart.data.labels = labels;
        chart.data.datasets[0].data = series.map((y, idx) => ({ x: tArr[idx], y }));
        // Clear area + cursor; will be set by cursor update
        chart.data.datasets[1].data = [];
        chart.data.datasets[2].data = [];
        chart.options.scales.y.title.text = yLabel;
        chart.update();
    }

    setChart(glSTChart, sArr, 'Displacement (m)');
    setChart(glVTChart, vArr, 'Velocity (m/s)');
    setChart(glATChart, aArr, 'Acceleration (m/s²)');

    glUpdateCursor(); // re-shade areas at current cursor
}

function glSetAreaAndCursor(chart, series, cursorIdx) {
    if (!chart || !glData) return;
    const { tArr } = glData;
    const i = glClamp(cursorIdx, 0, tArr.length - 1);

    // Area dataset: points up to i, then back down to baseline to close fill
    const areaPoints = [];
    for (let k = 0; k <= i; k++) areaPoints.push({ x: tArr[k], y: series[k] });
    // Close polygon down to y=0 at cursor and back to origin
    areaPoints.push({ x: tArr[i], y: 0 });
    areaPoints.push({ x: tArr[0], y: 0 });

    chart.data.datasets[1].data = areaPoints;

    // Cursor point
    chart.data.datasets[2].data = [{ x: tArr[i], y: series[i] }];
}

function glUpdateCursor() {
    if (!glData) return;
    const { tArr, sArr, vArr, aArr, dt, T } = glData;
    const t = glNum(glGetEl('gl-cursor')?.value, 0);
    const idx = Math.round(t / dt);

    glSetAreaAndCursor(glVTChart, vArr, idx); // area under v–t = displacement
    glSetAreaAndCursor(glATChart, aArr, idx); // area under a–t = change in v

    // For s–t, don't shade (area isn't the key idea here) — but show cursor
    if (glSTChart) {
        glSTChart.data.datasets[1].data = [];
        glSTChart.data.datasets[2].data = [{ x: tArr[glClamp(idx,0,tArr.length-1)], y: sArr[glClamp(idx,0,tArr.length-1)] }];
        glSTChart.update('none');
    }
    glVTChart?.update('none');
    glATChart?.update('none');

    glUpdateDisplayNumbers(idx);

    // Keep displayed t in sync with the cursor slider
    glGetEl('gl-t-val').textContent = glClamp(t, 0, T).toFixed(1);
}

function glReset() {
    glCursorPlaying = false;
    if (glCursorAnimId) cancelAnimationFrame(glCursorAnimId);
    glCursorAnimId = null;
    const cursor = glGetEl('gl-cursor');
    if (cursor) cursor.value = '0';
    glUpdateCursor();
    glUpdatePlayButton();
}

function glUpdatePlayButton() {
    const btn = glGetEl('gl-play');
    if (!btn) return;
    btn.innerHTML = glCursorPlaying
        ? '<i class="fas fa-pause"></i> Pause Cursor'
        : '<i class="fas fa-play"></i> Animate Cursor';
}

function glTogglePlay() {
    glCursorPlaying = !glCursorPlaying;
    glUpdatePlayButton();

    if (!glCursorPlaying) {
        if (glCursorAnimId) cancelAnimationFrame(glCursorAnimId);
        glCursorAnimId = null;
        return;
    }

    const cursor = glGetEl('gl-cursor');
    if (!cursor) return;

    const step = 0.1; // seconds per frame-ish

    function tick() {
        if (!glCursorPlaying) return;

        const T = glNum(glGetEl('gl-T')?.value, 10);
        let t = glNum(cursor.value, 0) + step;

        if (t > T) t = 0; // loop
        cursor.value = String(t);
        glUpdateCursor();

        glCursorAnimId = requestAnimationFrame(tick);
    }
    tick();
}

function initGraphLabAnimation() {
    const stCanvas = glGetEl('glST');
    const vtCanvas = glGetEl('glVT');
    const atCanvas = glGetEl('glAT');
    if (!stCanvas || !vtCanvas || !atCanvas) return;

    // Create charts
    glSTChart = glMakeChart('glST', 'Displacement (m)', '#2563eb', 'rgba(37, 99, 235, 0.15)');
    glVTChart = glMakeChart('glVT', 'Velocity (m/s)', '#10b981', 'rgba(16, 185, 129, 0.25)');
    glATChart = glMakeChart('glAT', 'Acceleration (m/s²)', '#f59e0b', 'rgba(245, 158, 11, 0.25)');

    // Hook controls
    ['gl-model','gl-T','gl-s0','gl-v0','gl-a0'].forEach(id => {
        glGetEl(id)?.addEventListener('input', () => {
            glUpdateCharts();
        });
        glGetEl(id)?.addEventListener('change', () => {
            glUpdateCharts();
        });
    });

    glGetEl('gl-cursor')?.addEventListener('input', glUpdateCursor);
    glGetEl('gl-play')?.addEventListener('click', glTogglePlay);
    glGetEl('gl-reset')?.addEventListener('click', () => { glReset(); glUpdateCharts(); });

    glUpdateCharts();
    glReset();
}

/* ===== Small robustness improvements ===== */
// Projectile: avoid divide-by-zero scaling when angle ~ 0 or ~ 90
(function patchProjectileScale() {
    const original = playProjectileAnimation;
    if (typeof original !== 'function') return;

    window.playProjectileAnimation = function() {
        if (projAnimationId) cancelAnimationFrame(projAnimationId);

        const canvas = document.getElementById('projCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const v = parseFloat(document.getElementById('proj-v-slider')?.value || 50);
        const angle = parseFloat(document.getElementById('proj-angle-slider')?.value || 45);
        const g = 10;
        const angleRad = angle * Math.PI / 180;

        const vx = v * Math.cos(angleRad);
        const vy = v * Math.sin(angleRad);

        const flightTime = vy === 0 ? 0 : (2 * vy) / g;
        const range = Math.max(0.001, vx * Math.max(flightTime, 0.001));
        const maxHeight = Math.max(0.001, (vy * vy) / (2 * g));

        const scaleX = (canvas.width - 60) / range;
        const scaleY = (canvas.height - 80) / maxHeight;
        const scale = Math.min(scaleX, scaleY);

        let t = 0;
        const dt = 0.02;
        const path = [];

        function animate() {
            if (t <= flightTime) {
                const x = vx * t;
                const y = vy * t - 0.5 * g * t * t;

                const canvasX = 30 + x * scale;
                const canvasY = canvas.height - 30 - y * scale;

                path.push({ x: canvasX, y: canvasY });

                drawProjectileBackground(canvas);

                ctx.strokeStyle = '#2563eb';
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (path.length > 0) {
                    ctx.moveTo(path[0].x, path[0].y);
                    path.forEach(point => ctx.lineTo(point.x, point.y));
                }
                ctx.stroke();

                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
                ctx.fill();

                t += dt;
                projAnimationId = requestAnimationFrame(animate);
            } else {
                // if flightTime is ~0, still draw the background once
                drawProjectileBackground(canvas);
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(30, canvas.height - 30, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        animate();
    };
})();




// ===============================
// UPGRADED GRAPH CURSOR + TANGENT/AREA (Displacement-Time & Velocity-Time)
// ===============================
(function registerCursorPlugin(){
    if (typeof Chart === 'undefined') return;
    if (Chart.__cursorPluginRegistered) return;

    const cursorPlugin = {
        id: 'cursorPlugin',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const cfg = chart.$cursorCfg;
            if (!cfg || cfg.x == null) return;

            const xScale = chart.scales.x;
            const yScale = chart.scales.y;
            if (!xScale || !yScale) return;

            const ctx = chart.ctx;
            const xPix = xScale.getPixelForValue(cfg.x);

            ctx.save();

            // Vertical cursor line
            ctx.strokeStyle = cfg.lineColor || 'rgba(100, 116, 139, 0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xPix, yScale.top);
            ctx.lineTo(xPix, yScale.bottom);
            ctx.stroke();

            // Optional area shading (under curve to baseline)
            if (cfg.area && Array.isArray(cfg.areaPoints) && cfg.areaPoints.length >= 2) {
                const baseY = yScale.getPixelForValue(cfg.baseline ?? 0);
                ctx.fillStyle = cfg.areaColor || 'rgba(16, 185, 129, 0.15)';
                ctx.beginPath();

                // Start at baseline at first x
                const first = cfg.areaPoints[0];
                ctx.moveTo(xScale.getPixelForValue(first.x), baseY);

                // Up to the curve
                cfg.areaPoints.forEach(p => {
                    ctx.lineTo(xScale.getPixelForValue(p.x), yScale.getPixelForValue(p.y));
                });

                // Back down to baseline at last x
                const last = cfg.areaPoints[cfg.areaPoints.length - 1];
                ctx.lineTo(xScale.getPixelForValue(last.x), baseY);
                ctx.closePath();
                ctx.fill();
            }

            // Cursor point marker (optional)
            if (cfg.point) {
                ctx.fillStyle = cfg.pointColor || '#111827';
                ctx.beginPath();
                ctx.arc(xPix, yScale.getPixelForValue(cfg.point.y), 4, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    };

    Chart.register(cursorPlugin);
    Chart.__cursorPluginRegistered = true;
})();

// --- Helpers ---
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function linspace(a, b, step){
    const out = [];
    for (let x = a; x <= b + 1e-9; x += step) out.push(parseFloat(x.toFixed(6)));
    return out;
}

// ===== Displacement-Time (UPGRADED) =====
function initDisplacementTimeAnimation() {
    const canvas = document.getElementById('stChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    // State
    window.__stState = window.__stState || { T: 10, dt: 0.1, tCursor: 0, playing: false, raf: null };

    // Build chart (linear x axis, supports precise cursor)
    stChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Displacement (m)',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    parsing: false
                },
                {
                    label: 'Tangent line',
                    data: [],
                    borderColor: 'rgba(17, 24, 39, 0.85)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                    parsing: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: 'Displacement (m)' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Controls
    const s0Slider = document.getElementById('s0-slider');
    const uSlider = document.getElementById('u-slider');
    const aSlider = document.getElementById('a-slider');
    const cursor = document.getElementById('st-cursor');

    // Slider listeners
    [s0Slider, uSlider, aSlider].forEach(slider => slider?.addEventListener('input', () => {
        updateSTEquation();
        rebuildSTCurve();
        updateSTCursor(window.__stState.tCursor);
    }));

    cursor?.addEventListener('input', () => {
        const t = parseFloat(cursor.value || 0);
        window.__stState.tCursor = t;
        updateSTCursor(t);
    });

    document.getElementById('play-st')?.addEventListener('click', playSTAnimation);
    document.getElementById('reset-st')?.addEventListener('click', resetSTAnimation);

    // Scenario controls
    const scenarioSel = document.getElementById('st-scenario');
    const randomBtn = document.getElementById('st-random');
    const hintBtn = document.getElementById('st-toggle-hints');

    function applySTScenario(key, showChallenge=false) {
        const sc = ensureScenarioDefaults(ST_SCENARIOS[key], ST_SCENARIOS["city-bus"]);
        window.__stState.scenarioKey = key;
        window.__stState.scenarioObj = sc;
        if (scenarioSel) scenarioSel.value = key;

        // Apply presets to sliders
        if (s0Slider) s0Slider.value = String(sc.s0);
        if (uSlider) uSlider.value = String(sc.u);
        if (aSlider) aSlider.value = String(sc.a);
        // If this scenario is piecewise, lock kinematic sliders (the curve is story-driven)
        const isPiecewise = (sc.model === "piecewise");
        if (uSlider) uSlider.disabled = isPiecewise;
        if (aSlider) aSlider.disabled = isPiecewise;
        const uLab = document.querySelector("label[for='u-slider']");
        const aLab = document.querySelector("label[for='a-slider']");
        if (uLab) uLab.style.opacity = isPiecewise ? 0.55 : 1;
        if (aLab) aLab.style.opacity = isPiecewise ? 0.55 : 1;

        // Update icon + story
        const movingObject = document.getElementById('moving-object');
        setIcon(movingObject, sc.icon);
        setHTML('st-story', `<strong>${sc.label}:</strong> ${sc.story}` + (showChallenge ? `<br><span class="challenge">🎯 ${sc.challenge}</span>` : ''));

        // Update duration
        window.__stState.T = sc.T;
        updateSTEquation();
        rebuildSTCurve();
        window.__stState.tCursor = 0;
        updateSTCursor(0);
        loadSTExtras(key);
    }

    scenarioSel?.addEventListener('change', () => applySTScenario(scenarioSel.value, false));
    randomBtn?.addEventListener('click', () => {
        const keys = Object.keys(ST_SCENARIOS);
        const pick = keys[Math.floor(Math.random() * keys.length)];
        applySTScenario(pick, true);
    });
    hintBtn?.addEventListener('click', () => toggleCollapsed('st-micro'));

    // Missions + Questions UI
    let stMissions = ST_MISSION_SETS[(scenarioSel?.value || "city-bus")] || ST_MISSION_SETS["city-bus"];
    let stCompleted = new Set();

    function loadSTExtras(key){
        stMissions = ST_MISSION_SETS[key] || ST_MISSION_SETS["city-bus"];
        stCompleted = new Set();
        window.__stMissions = stMissions;
        window.__stCompleted = stCompleted;
        renderMissionList("st", stMissions);

        const pack = ST_QUESTIONS[key] || ST_QUESTIONS["default"];
        setQuestions("st", pack.qs, pack.ans);
        updateMissionUI("st", stMissions, stCompleted);

        // keep answers hidden by default
        const ans = document.getElementById("st-answers");
        if (ans) ans.classList.add("collapsed");
    }

    document.getElementById("st-show-answers")?.addEventListener("click", () => toggleAnswers("st"));



    applySTScenario((scenarioSel?.value || "city-bus"), false);

    updateSTEquation();
    rebuildSTCurve();
    updateSTCursor(0);
}

function rebuildSTCurve() {
    if (!stChart) return;

    const sc = window.__stState?.scenarioObj || ensureScenarioDefaults(ST_SCENARIOS[window.__stState?.scenarioKey], ST_SCENARIOS["city-bus"]);

    const s0 = parseFloat(document.getElementById('s0-slider')?.value || 0);
    const u  = parseFloat(document.getElementById('u-slider')?.value || 0);
    const a  = parseFloat(document.getElementById('a-slider')?.value || 0);

    const T = window.__stState?.T ?? sc.T ?? 10;
    const dt = window.__stState?.dt ?? 0.1;

    const ts = linspace(0, T, dt);

    function s_piece(t){
        let s = s0;
        let v = 0;
        for (const seg of (sc.segments || [])) {
            const t0=seg.t0, t1=seg.t1, vv=seg.v;
            if (t >= t1) s += vv*(t1-t0);
            else if (t >= t0) { s += vv*(t-t0); v = vv; break; }
        }
        return s;
    }

    const pts = ts.map(t => ({ x: t, y: (sc.model==="piecewise") ? s_piece(t) : (s0 + u*t + 0.5*a*t*t) }));

    stChart.data.datasets[0].data = pts;
    stChart.update('none');
}

function updateSTCursor(t) {
    if (!stChart) return;

    const sc = window.__stState?.scenarioObj || ensureScenarioDefaults(ST_SCENARIOS[window.__stState?.scenarioKey], ST_SCENARIOS["city-bus"]);
    const T = window.__stState?.T ?? sc.T ?? 10;

    // Kinematic sliders (used for model="kinematic")
    const s0 = parseFloat(document.getElementById('s0-slider')?.value || 0);
    const u  = parseFloat(document.getElementById('u-slider')?.value || 0);
    const a  = parseFloat(document.getElementById('a-slider')?.value || 0);

    t = clamp(t, 0, T);

    // Compute s(t), v(t)
    let s = 0, v = 0;
    if (sc.model === "piecewise" && Array.isArray(sc.segments)) {
        // piecewise constant velocity segments
        s = s0;
        v = 0;
        for (const seg of sc.segments) {
            const t0 = seg.t0, t1 = seg.t1, vv = seg.v;
            if (t >= t1) {
                s += vv * (t1 - t0);
            } else if (t >= t0) {
                s += vv * (t - t0);
                v = vv;
                break;
            }
        }
    } else {
        s = s0 + u*t + 0.5*a*t*t;
        v = u + a*t; // slope of s–t
    }

    // Update readouts
    const tVal = document.getElementById('st-t-val');
    const sVal = document.getElementById('st-s-val');
    const vVal = document.getElementById('st-vinst-val');
    if (tVal) tVal.textContent = t.toFixed(1);
    if (sVal) sVal.textContent = s.toFixed(2);
    if (vVal) vVal.textContent = v.toFixed(2);

    // Tangent line (choose a small window around t)
    const span = 1.2;
    const t1 = clamp(t - span, 0, T);
    const t2 = clamp(t + span, 0, T);
    const s1 = s + v*(t1 - t);
    const s2 = s + v*(t2 - t);

    stChart.data.datasets[1].data = [{ x: t1, y: s1 }, { x: t2, y: s2 }];

    // Cursor line + point marker via plugin
    stChart.$cursorCfg = {
        x: t,
        lineColor: 'rgba(255,255,255,0.55)',
        point: { x: t, y: s }
    };

    // Move the little icon along the track
    const obj = document.getElementById('moving-object');
    if (obj) {
        const pct = (T > 0) ? (t / T) : 0;
        obj.style.left = (pct*100).toFixed(2) + '%';
    }

    stChart.update('none');

    // Missions auto-check
    const ctx = { t, s, v, u, a, s0, T, scenario: sc };
    if (window.__stMissions && window.__stCompleted) {
        updateMissionsRuntime("st", window.__stMissions, window.__stCompleted, ctx);
    }
}

function playSTAnimation() {
    const st = window.__stState;
    if (!st) return;

    // Toggle play/pause
    st.playing = !st.playing;

    const btn = document.getElementById('play-st');
    if (btn) btn.innerHTML = st.playing ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Play';

    if (!st.playing) {
        if (st.raf) cancelAnimationFrame(st.raf);
        st.raf = null;
        return;
    }

    const movingObject = document.getElementById('moving-object');
    const track = document.querySelector('#displacement-tab .motion-track');
    const trackWidth = track?.offsetWidth - 50 || 500;

    const s0 = parseFloat(document.getElementById('s0-slider')?.value || 0);
    const u  = parseFloat(document.getElementById('u-slider')?.value || 5);
    const a  = parseFloat(document.getElementById('a-slider')?.value || 0);

    const T = st.T ?? 10;

    function step() {
        if (!st.playing) return;

        st.tCursor += (st.dt ?? 0.1);
        if (st.tCursor > T) st.tCursor = 0;

        const t = st.tCursor;
        updateSTCursor(t);

        // Update car position using current displacement vs min/max span
        const s = s0 + u*t + 0.5*a*t*t;
        const sEnd = s0 + u*T + 0.5*a*T*T;
        const denom = Math.max(1e-6, Math.abs(sEnd - s0));
        const normalized = (s - s0) / denom;
        const carPos = Math.max(10, Math.min(trackWidth, 10 + normalized * (trackWidth - 20)));
        if (movingObject) movingObject.style.left = carPos + 'px';

        st.raf = requestAnimationFrame(step);
    }

    st.raf = requestAnimationFrame(step);
}

function resetSTAnimation() {
    const st = window.__stState;
    if (st?.raf) cancelAnimationFrame(st.raf);
    if (st) {
        st.raf = null;
        st.playing = false;
        st.tCursor = 0;
    }

    const btn = document.getElementById('play-st');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Play';

    const movingObject = document.getElementById('moving-object');
    if (movingObject) movingObject.style.left = '10px';

    updateSTCursor(0);
}

// ===== Velocity-Time (UPGRADED) =====
function initVelocityTimeAnimation() {
    const canvas = document.getElementById('vtChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');

    window.__vtState = window.__vtState || { tCursor: 0, playing: false, raf: null, dt: 0.1 };

    vtChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Velocity (m/s)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                    parsing: false
                },
                {
                    label: 'Tangent line',
                    data: [],
                    borderColor: 'rgba(17, 24, 39, 0.85)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                    parsing: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Time (s)' } },
                y: { title: { display: true, text: 'Velocity (m/s)' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    const v0Slider = document.getElementById('v0-slider');
    const accSlider = document.getElementById('acc-slider');
    const durSlider = document.getElementById('dur-slider');
    const cursor = document.getElementById('vt-cursor');

    [v0Slider, accSlider, durSlider].forEach(slider => slider?.addEventListener('input', () => {
        updateVTDisplay();
        rebuildVTCurve();
        // resync cursor max to duration
        const duration = parseFloat(durSlider?.value || 10);
        window.__vtState.tCursor = clamp(window.__vtState.tCursor, 0, duration);
        updateVTCursor(window.__vtState.tCursor);
    }));

    cursor?.addEventListener('input', () => {
        const t = parseFloat(cursor.value || 0);
        window.__vtState.tCursor = t;
        updateVTCursor(t);
    });

    document.getElementById('play-vt')?.addEventListener('click', playVTAnimation);
    document.getElementById('reset-vt')?.addEventListener('click', resetVTAnimation);

    // Scenario controls
    const scenarioSel = document.getElementById('vt-scenario');
    const randomBtn = document.getElementById('vt-random');
    const hintBtn = document.getElementById('vt-toggle-hints');

    function applyVTScenario(key, showChallenge=false) {
        const sc = VT_SCENARIOS[key] || VT_SCENARIOS["traffic-light"];
        if (scenarioSel) scenarioSel.value = key;

        if (v0Slider) v0Slider.value = String(sc.v0);
        if (accSlider) accSlider.value = String(sc.acc);
        if (durSlider) durSlider.value = String(sc.duration);

        setHTML('vt-story', `<strong>${sc.label}:</strong> ${sc.story}` + (showChallenge ? `<br><span class="challenge">🎯 ${sc.challenge}</span>` : ''));

        updateVTDisplay();
        rebuildVTCurve();
        window.__vtState.tCursor = 0;
        updateVTCursor(0);
        loadVTExtras(key);
    }

    scenarioSel?.addEventListener('change', () => applyVTScenario(scenarioSel.value, false));
    randomBtn?.addEventListener('click', () => {
        const keys = Object.keys(VT_SCENARIOS);
        const pick = keys[Math.floor(Math.random() * keys.length)];
        applyVTScenario(pick, true);
    });
    hintBtn?.addEventListener('click', () => toggleCollapsed('vt-micro'));

    // Missions + Questions UI
    let vtMissions = VT_MISSION_SETS[(scenarioSel?.value || "bike-hill")] || VT_MISSION_SETS["bike-hill"];
    let vtCompleted = new Set();

    function loadVTExtras(key){
        vtMissions = VT_MISSION_SETS[key] || VT_MISSION_SETS["bike-hill"];
        vtCompleted = new Set();
        window.__vtMissions = vtMissions;
        window.__vtCompleted = vtCompleted;

        renderMissionList("vt", vtMissions);
        const pack = VT_QUESTIONS[key] || VT_QUESTIONS["default"];
        setQuestions("vt", pack.qs, pack.ans);
        updateMissionUI("vt", vtMissions, vtCompleted);

        const ans = document.getElementById("vt-answers");
        if (ans) ans.classList.add("collapsed");
    }

    document.getElementById("vt-show-answers")?.addEventListener("click", () => toggleAnswers("vt"));


    // Apply default scenario once on load
    applyVTScenario((scenarioSel?.value || "bike-hill"), false);


    updateVTDisplay();
    rebuildVTCurve();
    updateVTCursor(0);
}

function rebuildVTCurve() {
    if (!vtChart) return;

    const v0 = parseFloat(document.getElementById('v0-slider')?.value || 0);
    const acc = parseFloat(document.getElementById('acc-slider')?.value || 2);
    const duration = parseFloat(document.getElementById('dur-slider')?.value || 10);
    const dt = window.__vtState?.dt ?? 0.1;

    const ts = linspace(0, duration, dt);
    const pts = ts.map(t => ({ x: t, y: v0 + acc*t }));

    vtChart.data.datasets[0].data = pts;
    vtChart.update('none');

    const cursor = document.getElementById('vt-cursor');
    if (cursor) {
        cursor.max = String(duration);
        cursor.step = String(dt);
    }
}

function computeTrapezoidArea(points) {
    // points are ordered by x
    let area = 0;
    for (let i = 1; i < points.length; i++) {
        const x1 = points[i-1].x, y1 = points[i-1].y;
        const x2 = points[i].x,   y2 = points[i].y;
        area += (x2 - x1) * (y1 + y2) / 2;
    }
    return area;
}

function updateVTCursor(t) {
    if (!vtChart) return;

    const v0 = parseFloat(document.getElementById('v0-slider')?.value || 0);
    const acc = parseFloat(document.getElementById('acc-slider')?.value || 2);
    const duration = parseFloat(document.getElementById('dur-slider')?.value || 10);
    const dt = window.__vtState?.dt ?? 0.1;

    t = clamp(t, 0, duration);
    const v = v0 + acc*t;
    const a = acc; // slope of v–t

    // Build area points from 0 to t (include interpolated point at t)
    const ts = linspace(0, t, dt);
    const areaPts = ts.map(x => ({ x, y: v0 + acc*x }));
    if (areaPts.length === 0) areaPts.push({ x: 0, y: v0 });

    const area = computeTrapezoidArea(areaPts);

    // Update readouts
    const tVal = document.getElementById('vt-t-val');
    const vVal = document.getElementById('vt-v-val');
    const aVal = document.getElementById('vt-a-val');
    const areaVal = document.getElementById('vt-area-val');

    if (tVal) tVal.textContent = t.toFixed(1);
    if (vVal) vVal.textContent = v.toFixed(2);
    if (aVal) aVal.textContent = a.toFixed(2);
    if (areaVal) areaVal.textContent = area.toFixed(2);

    // Keep legacy running displacement label in sync too
    const legacy = document.getElementById('vt-displacement');
    if (legacy) legacy.textContent = area.toFixed(2);

    // Tangent line (at v–t it's just slope a)
    const span = 1.2;
    const t1 = clamp(t - span, 0, duration);
    const t2 = clamp(t + span, 0, duration);
    const v1 = v + a*(t1 - t);
    const v2 = v + a*(t2 - t);
    vtChart.data.datasets[1].data = [{ x: t1, y: v1 }, { x: t2, y: v2 }];

    // Cursor plugin config: shaded area + cursor point
    vtChart.$cursorCfg = {
        x: t,
        lineColor: 'rgba(100,116,139,0.85)',
        area: true,
        areaPoints: areaPts,
        baseline: 0,
        areaColor: (area >= 0) ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.14)',
        point: { y: v },
        pointColor: '#111827'
    };

    vtChart.update('none');

    const cursor = document.getElementById('vt-cursor');
    if (cursor && document.activeElement !== cursor) cursor.value = String(t);

    // Missions auto-check
    const ctx = { t, v, v0, acc, slope: a, disp: area, duration };
    if (window.__vtMissions && window.__vtCompleted) {
        updateMissionsRuntime('vt', window.__vtMissions, window.__vtCompleted, ctx);
    }
}

function playVTAnimation() {
    const st = window.__vtState;
    if (!st) return;

    st.playing = !st.playing;

    const btn = document.getElementById('play-vt');
    if (btn) btn.innerHTML = st.playing ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Play';

    if (!st.playing) {
        if (st.raf) cancelAnimationFrame(st.raf);
        st.raf = null;
        return;
    }

    const duration = parseFloat(document.getElementById('dur-slider')?.value || 10);

    function step() {
        if (!st.playing) return;

        st.tCursor += (st.dt ?? 0.1);
        if (st.tCursor > duration) st.tCursor = 0;

        updateVTCursor(st.tCursor);
        st.raf = requestAnimationFrame(step);
    }

    st.raf = requestAnimationFrame(step);
}

function resetVTAnimation() {
    const st = window.__vtState;
    if (st?.raf) cancelAnimationFrame(st.raf);
    if (st) {
        st.raf = null;
        st.playing = false;
        st.tCursor = 0;
    }

    const btn = document.getElementById('play-vt');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Play';

    updateVTCursor(0);
}
