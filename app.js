// ===== Configuration =====
const CONFIG = {
    // API endpoint - uses Netlify Functions for secure API key handling
    apiEndpoint: '/.netlify/functions/chat',
    // Conversation history for context
    conversationHistory: []
};

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

// ===== Practice Problems =====

const PRACTICE_PROBLEMS = [
  // --- Distance–Time Graphs ---
  {
    id: "dt1",
    category: "graphs-distance-time",
    difficulty: "foundation",
    title: "Walk → Wait → Bus (interpret a distance–time graph)",
    prompt: `
      A person leaves home at 9:00 am, walks to a bus stop, waits, then catches a bus into town.
      The distance–time graph has three sections: OA rising gently, AB flat, BC rising steeply.
      <ol>
        <li>Describe what is happening during the time from A to B. <em>(3 marks)</em></li>
        <li>The section BC is much steeper than OA; what does this tell you about the motion? <em>(3 marks)</em></li>
        <li>Sketch the speed–time graph for the person. <em>(3 marks)</em></li>
      </ol>
    `,
    answer: `
      <ol>
        <li><strong>A to B:</strong> the person is <strong>not moving</strong> (waiting). Distance stays constant → speed = 0.</li>
        <li><strong>BC steeper:</strong> greater gradient → <strong>higher speed</strong> (bus is faster than walking).</li>
        <li><strong>Speed–time:</strong> constant low speed during OA, then 0 during AB, then a higher (approximately constant) speed during BC.</li>
      </ol>
    `
  },
  {
    id: "dt2",
    category: "graphs-distance-time",
    difficulty: "standard",
    title: "Find speeds from gradients",
    prompt: `
      A distance–time graph is made of straight-line segments:
      from 0–20 s the distance increases from 0 m to 60 m;
      from 20–35 s the distance stays at 60 m;
      from 35–50 s the distance increases from 60 m to 180 m.
      <ol>
        <li>Find the speed on each segment.</li>
        <li>Which segment represents the greatest speed, and why?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>0–20 s: speed = 60/20 = <strong>3 m/s</strong>. 20–35 s: speed = <strong>0 m/s</strong>. 35–50 s: speed = (180−60)/15 = 120/15 = <strong>8 m/s</strong>.</li>
        <li>35–50 s has the greatest speed because it has the <strong>steepest gradient</strong>.</li>
      </ol>
    `
  },
  {
    id: "dt3",
    category: "graphs-distance-time",
    difficulty: "challenge",
    title: "From displacement–time to velocity–time",
    prompt: `
      The displacement of a particle is given by \\(x(t)=t^3-5t^2+4\\) (meters), where \\(t\\) is in seconds.
      <ol>
        <li>Find an expression for the velocity \\(v(t)\\).</li>
        <li>Find the time(s) when the velocity is zero.</li>
        <li>Find the position(s) at those times.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>\\(v(t)=\\frac{dx}{dt}=3t^2-10t\\).</li>
        <li>Set \\(v(t)=0\\): \\(t(3t-10)=0\\) → \\(t=0\\) or \\(t=\\frac{10}{3}\\).</li>
        <li>\\(x(0)=4\\). \\(x(10/3)=(10/3)^3-5(10/3)^2+4=\\frac{1000}{27}-\\frac{500}{9}+4=\\frac{1000-1500+108}{27}=\\frac{-392}{27}\\approx -14.52\\).</li>
      </ol>
    `
  },

  // --- Velocity–Time Graphs ---
  {
    id: "vt1",
    category: "graphs-velocity-time",
    difficulty: "foundation",
    title: "Acceleration from slope",
    prompt: `
      A velocity–time graph is a straight line from \\((0,0)\\) to \\((6,12)\\) (SI units).
      <ol>
        <li>Find the acceleration.</li>
        <li>Find the displacement in the first 6 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Acceleration = gradient = \\(\\frac{12-0}{6-0}=\\mathbf{2\\ m/s^2}\\).</li>
        <li>Displacement = area under graph (triangle) = \\(\\tfrac12\\times 6\\times 12=\\mathbf{36\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "vt2",
    category: "graphs-velocity-time",
    difficulty: "standard",
    title: "Signed displacement (negative area)",
    prompt: `
      A particle moves with velocity given by a v–t graph:
      from 0–4 s, velocity increases linearly from 0 to 8 m/s;
      from 4–10 s, velocity decreases linearly from 8 m/s to −4 m/s.
      <ol>
        <li>Find the acceleration on 0–4 s and on 4–10 s.</li>
        <li>Find the displacement from 0–10 s (take area below the axis as negative).</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>0–4 s: \\(a=\\frac{8}{4}=\\mathbf{2\\ m/s^2}\\). 4–10 s: \\(a=\\frac{-4-8}{10-4}=\\frac{-12}{6}=\\mathbf{-2\\ m/s^2}\\).</li>
        <li>Area 0–4 (triangle): \\(\\tfrac12\\cdot4\\cdot8=16\\).
            From 4–10: trapezium with heights 8 and −4, width 6:
            \\(\\tfrac12(8+(-4))\\cdot6=\\tfrac12\\cdot4\\cdot6=12\\).
            Total displacement = \\(16+12=\\mathbf{28\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "vt3",
    category: "graphs-velocity-time",
    difficulty: "challenge",
    title: "Braking model \\(v=40-2t^2\\)",
    prompt: `
      During braking, the speed of a car is modelled by \\(v(t)=40-2t^2\\) (m/s) until it stops.
      <ol>
        <li>How long does the car take to stop?</li>
        <li>How far does it move before it stops?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Stop when \\(v=0\\): \\(40-2t^2=0\\Rightarrow t^2=20\\Rightarrow t=\\sqrt{20}=\\mathbf{2\\sqrt{5}}\\approx 4.47\\,s\\).</li>
        <li>Distance = \\(\\int_0^{\\sqrt{20}} (40-2t^2)\\,dt = \\left[40t-\\tfrac{2}{3}t^3\\right]_0^{\\sqrt{20}}\\).
            Substitute \\(t=\\sqrt{20}\\): \\(40\\sqrt{20}-\\tfrac{2}{3}(\\sqrt{20})^3=40\\sqrt{20}-\\tfrac{2}{3}(20\\sqrt{20})=\\left(40-\\tfrac{40}{3}\\right)\\sqrt{20}=\\tfrac{80}{3}\\sqrt{20}\\approx \\mathbf{119.3\\ m}\\).</li>
      </ol>
    `
  },

  // --- Acceleration–Time Graphs ---
  {
    id: "at1",
    category: "graphs-acceleration-time",
    difficulty: "standard",
    title: "Change in velocity from area under a–t",
    prompt: `
      An acceleration–time graph is constant at \\(a=3\\,m/s^2\\) from 0–5 s, then constant at \\(a=-2\\,m/s^2\\) from 5–12 s.
      The initial velocity is \\(u=4\\,m/s\\).
      <ol>
        <li>Find the velocity at 5 s and at 12 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Change in velocity is area under a–t.
            0–5: \\(\\Delta v=3\\times5=15\\) → \\(v(5)=4+15=\\mathbf{19\\,m/s}\\).
            5–12: \\(\\Delta v=-2\\times7=-14\\) → \\(v(12)=19-14=\\mathbf{5\\,m/s}\\).</li>
      </ol>
    `
  },

  // --- SUVAT / Constant Acceleration ---
  {
    id: "sv1",
    category: "suvat",
    difficulty: "standard",
    title: "Van skids to a halt",
    prompt: `
      A van skids to a halt from an initial speed of \\(24\\,m/s\\), covering a distance of \\(36\\,m\\).
      Assume constant acceleration.
      <ol>
        <li>Find the acceleration.</li>
        <li>Find the time it takes to stop.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Use \\(v^2=u^2+2as\\). With \\(v=0\\): \\(0=24^2+2a(36)\\Rightarrow a=-\\frac{576}{72}=\\mathbf{-8\\,m/s^2}\\).</li>
        <li>Use \\(v=u+at\\): \\(0=24-8t\\Rightarrow t=\\mathbf{3\\,s}\\).</li>
      </ol>
    `
  },
  {
    id: "sv2",
    category: "suvat",
    difficulty: "challenge",
    title: "Train journey (piecewise)",
    prompt: `
      A train starts from rest and accelerates uniformly for 60 s, then travels at a constant speed of 17 m/s for 60 s.
      It then slows down uniformly; after 45 s it is travelling at 10 m/s.
      It accelerates uniformly for 75 s to reach 20 m/s, then slows uniformly to rest in 30 s.
      <ol>
        <li>Find the acceleration in each accelerating/decelerating stage.</li>
        <li>Find the total distance travelled.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Stage 1: \\(a=\\frac{17-0}{60}=\\mathbf{0.2833\\,m/s^2}\\).
            Stage 3: \\(a=\\frac{10-17}{45}=\\mathbf{-0.1556\\,m/s^2}\\).
            Stage 4: \\(a=\\frac{20-10}{75}=\\mathbf{0.1333\\,m/s^2}\\).
            Stage 5: \\(a=\\frac{0-20}{30}=\\mathbf{-0.6667\\,m/s^2}\\).</li>
        <li>Distances:
            Stage 1: \\(s=\\tfrac12(u+v)t=\\tfrac12(0+17)60=510\\,m\\).
            Stage 2: \\(s=vt=17\\cdot60=1020\\,m\\).
            Stage 3: \\(s=\\tfrac12(17+10)45=607.5\\,m\\).
            Stage 4: \\(s=\\tfrac12(10+20)75=1125\\,m\\).
            Stage 5: \\(s=\\tfrac12(20+0)30=300\\,m\\).
            Total \\(=\\mathbf{3562.5\\,m}\\).</li>
      </ol>
    `
  },

  // --- Calculus in Motion ---
  {
    id: "cal1",
    category: "calculus",
    difficulty: "standard",
    title: "Skier: build v(t) and s(t)",
    prompt: `
      A skier pushes off with initial speed \\(2\\,m/s\\) and accelerates uniformly.
      After 10 s her speed is \\(6\\,m/s\\).
      <ol>
        <li>Find an expression for her speed \\(v(t)\\).</li>
        <li>Find an expression for distance travelled \\(s(t)\\) from the start.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Acceleration \\(a=\\frac{6-2}{10}=\\mathbf{0.4\\,m/s^2}\\). So \\(v(t)=2+0.4t\\).</li>
        <li>\\(s(t)=\\int v(t)dt=\\int(2+0.4t)dt=2t+0.2t^2\\) (taking \\(s(0)=0\\)).</li>
      </ol>
    `
  },
  {
    id: "cal2",
    category: "calculus",
    difficulty: "challenge",
    title: "Skier: speed at bottom of 400 m slope",
    prompt: `
      Use the model from the previous skier question: \\(v(t)=2+0.4t\\), \\(s(t)=2t+0.2t^2\\).
      The slope is 400 m long.
      <ol>
        <li>Find the time when \\(s=400\\).</li>
        <li>Hence find the speed at the bottom.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Solve \\(2t+0.2t^2=400\\Rightarrow 0.2t^2+2t-400=0\\Rightarrow t^2+10t-2000=0\\).
            \\(t=\\frac{-10+\\sqrt{10^2+8000}}{2}=\\frac{-10+\\sqrt{8100}}{2}=\\frac{-10+90}{2}=\\mathbf{40\\,s}\\) (positive root).</li>
        <li>\\(v(40)=2+0.4(40)=\\mathbf{18\\,m/s}\\).</li>
      </ol>
    `
  },

  // --- Mixed Exam-Style ---
  {
    id: "mx1",
    category: "mixed",
    difficulty: "standard",
    title: "From v–t to a–t sketch",
    prompt: `
      A velocity–time graph is piecewise linear:
      it rises from 0 m/s to 4 m/s in 5 s, then falls to −2 m/s in the next 6 s, then stays constant at −2 m/s for 4 s.
      <ol>
        <li>Calculate the acceleration on each interval.</li>
        <li>Sketch the corresponding acceleration–time graph (values and time intervals).</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>0–5: \\(a=\\frac{4-0}{5}=\\mathbf{0.8\\,m/s^2}\\).
            5–11: \\(a=\\frac{-2-4}{6}=\\mathbf{-1\\,m/s^2}\\).
            11–15: \\(a=0\\).</li>
        <li>a–t is horizontal lines at 0.8 (0–5), −1 (5–11), 0 (11–15).</li>
      </ol>
    `
  }
,
  // --- Distance–Time Graphs (more) ---
  {
    id: "dt4",
    category: "graphs-distance-time",
    difficulty: "foundation",
    title: "Stopped or moving?",
    prompt: `
      A distance–time graph has these sections:
      <ul>
        <li>0–10 s: distance increases steadily from 0 m to 20 m</li>
        <li>10–18 s: distance stays at 20 m</li>
        <li>18–30 s: distance increases steadily from 20 m to 50 m</li>
      </ul>
      <ol>
        <li>During which interval(s) is the object at rest?</li>
        <li>Find the speed for 0–10 s and 18–30 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>At rest during <strong>10–18 s</strong> (flat section).</li>
        <li>0–10 s: \\(20/10=\\mathbf{2\\ m/s}\\). 18–30 s: \\((50-20)/(30-18)=30/12=\\mathbf{2.5\\ m/s}\\).</li>
      </ol>
    `
  },
  {
    id: "dt5",
    category: "graphs-distance-time",
    difficulty: "standard",
    title: "Average speed from a journey",
    prompt: `
      A runner covers 1200 m in 8 minutes. She stops for 1 minute to tie her shoelace, then runs another 600 m in 4 minutes.
      <ol>
        <li>Find her speed during the first run and the second run (in m/s).</li>
        <li>Find her <strong>average speed</strong> for the whole journey.</li>
        <li>Sketch a distance–time graph (describe the shape).</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>First: \\(1200/(8\\cdot60)=1200/480=\\mathbf{2.5\\ m/s}\\). Second: \\(600/(4\\cdot60)=600/240=\\mathbf{2.5\\ m/s}\\).</li>
        <li>Total distance = 1800 m. Total time = \\((8+1+4)\\) min = 13 min = 780 s. Average speed = \\(1800/780=\\mathbf{2.31\\ m/s}\\) (3 s.f.).</li>
        <li>Line up (constant slope), then flat for 1 min, then line up again (same slope).</li>
      </ol>
    `
  },
  {
    id: "dt6",
    category: "graphs-distance-time",
    difficulty: "challenge",
    title: "Meet-up problem (two people)",
    prompt: `
      Person A leaves home and walks to town at a constant speed of 1.2 m/s.
      Person B leaves the same home 5 minutes later and cycles to town at 4.0 m/s.
      <ol>
        <li>After how many seconds from A's start does B catch up to A?</li>
        <li>How far from home are they at that time?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Let \\(t\\) = time (s) since A started. B travels for \\(t-300\\) seconds. Catch up when distances equal:
        \\(1.2t = 4(t-300)\\) → \\(1.2t = 4t - 1200\\) → \\(2.8t=1200\\) → \\(t=\\mathbf{428.57\\ s}\\).</li>
        <li>Distance = \\(1.2\\times 428.57=\\mathbf{514.29\\ m}\\).</li>
      </ol>
    `
  },

  // --- Velocity–Time Graphs (more) ---
  {
    id: "vt3",
    category: "graphs-velocity-time",
    difficulty: "foundation",
    title: "Displacement from a rectangle",
    prompt: `
      An object moves at a constant velocity of 6 m/s for 9 s.
      <ol>
        <li>Sketch the velocity–time graph.</li>
        <li>Find the displacement in 9 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Horizontal line at \\(v=6\\) from \\(t=0\\) to \\(9\\) s.</li>
        <li>Displacement = area = \\(6\\times 9=\\mathbf{54\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "vt4",
    category: "graphs-velocity-time",
    difficulty: "standard",
    title: "Piecewise journey (match your screenshot style)",
    prompt: `
      A velocity–time graph consists of straight-line sections:
      <ul>
        <li>(a) from 0–5 s, velocity increases from 0 to 4 m/s</li>
        <li>(b) from 5–9 s, velocity decreases from 4 m/s to −3 m/s</li>
        <li>(c) from 9–13 s, velocity increases from −3 m/s to −1 m/s</li>
        <li>(d) from 13–17 s, velocity is constant at −1 m/s</li>
        <li>(e) from 17–20 s, velocity increases from −1 m/s to 0</li>
      </ul>
      <ol>
        <li>Calculate the acceleration for each part (a)–(e).</li>
        <li>Which interval shows zero acceleration?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>(a) \\(a=\\frac{4-0}{5}=\\mathbf{0.8}\\). (b) \\(a=\\frac{-3-4}{4}=\\mathbf{-1.75}\\).
            (c) \\(a=\\frac{-1-(-3)}{4}=\\mathbf{0.5}\\).
            (d) \\(a=\\mathbf{0}\\).
            (e) \\(a=\\frac{0-(-1)}{3}=\\mathbf{0.333}\\). Units: m/s².</li>
        <li>Interval <strong>(d)</strong> (flat v–t line).</li>
      </ol>
    `
  },
  {
    id: "vt5",
    category: "graphs-velocity-time",
    difficulty: "standard",
    title: "Displacement with sign",
    prompt: `
      From 0–3 s the velocity is 5 m/s.
      From 3–7 s the velocity is −2 m/s.
      <ol>
        <li>Find the displacement from 0–7 s.</li>
        <li>Find the distance traveled from 0–7 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Displacement = \\(5\\cdot 3 + (-2)\\cdot 4 = 15-8=\\mathbf{7\\ m}\\).</li>
        <li>Distance = \\(|5|\\cdot 3 + |{-2}|\\cdot 4 = 15+8=\\mathbf{23\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "vt6",
    category: "graphs-velocity-time",
    difficulty: "challenge",
    title: "Braking model (calculus-ready)",
    prompt: `
      During braking the speed of a car is modelled by \\(v = 40 - 2t^2\\) (m/s), where \\(t\\) is in seconds.
      <ol>
        <li>How long does the car take to stop?</li>
        <li>How far does it move before it stops?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Stop when \\(v=0\\): \\(40-2t^2=0\\) → \\(t^2=20\\) → \\(t=\\mathbf{\\sqrt{20}\\approx 4.47\\ s}\\).</li>
        <li>Distance = \\(\\int_0^{\\sqrt{20}} (40-2t^2)\\,dt = \\left[40t-\\tfrac{2}{3}t^3\\right]_0^{\\sqrt{20}}
        =40\\sqrt{20}-\\tfrac{2}{3}(20\\sqrt{20}) = \\left(40-\\tfrac{40}{3}\\right)\\sqrt{20}=\\tfrac{80}{3}\\sqrt{20}\\approx \\mathbf{119.3\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "vt7",
    category: "graphs-velocity-time",
    difficulty: "challenge",
    title: "Sketch acceleration–time from v–t",
    prompt: `
      A velocity–time graph is:
      <ul>
        <li>0–4 s: straight line up from 0 to 12 m/s</li>
        <li>4–10 s: horizontal line at 12 m/s</li>
        <li>10–14 s: straight line down from 12 m/s to 0</li>
      </ul>
      <ol>
        <li>Sketch the acceleration–time graph.</li>
        <li>Find the total displacement.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>a–t: 0–4 s constant \\(a=12/4=\\mathbf{3}\\); 4–10 s \\(a=0\\); 10–14 s constant \\(a=(0-12)/4=\\mathbf{-3}\\) m/s².</li>
        <li>Displacement = triangle (0–4): \\(\\tfrac12\\cdot4\\cdot12=24\\) + rectangle (4–10): \\(6\\cdot12=72\\) + triangle (10–14): \\(\\tfrac12\\cdot4\\cdot12=24\\) → total \\(\\mathbf{120\\ m}\\).</li>
      </ol>
    `
  },

  // --- Acceleration–Time Graphs (more) ---
  {
    id: "at1",
    category: "graphs-acceleration-time",
    difficulty: "foundation",
    title: "Change in velocity from a–t",
    prompt: `
      An object has constant acceleration \\(a=2\\,\\text{m/s}^2\\) for 7 s.
      <ol>
        <li>Find the change in velocity.</li>
        <li>If it starts from rest, what is its velocity after 7 s?</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>\\(\\Delta v = a\\times t = 2\\times7=\\mathbf{14\\ m/s}\\).</li>
        <li>From rest: \\(v=0+14=\\mathbf{14\\ m/s}\\).</li>
      </ol>
    `
  },
  {
    id: "at2",
    category: "graphs-acceleration-time",
    difficulty: "standard",
    title: "Piecewise acceleration (area under a–t)",
    prompt: `
      A particle has acceleration:
      <ul>
        <li>0–3 s: \\(a=4\\)</li>
        <li>3–8 s: \\(a=-2\\)</li>
        <li>8–10 s: \\(a=0\\)</li>
      </ul>
      If the initial velocity is \\(u=5\\,\\text{m/s}\\), find the velocity at \\(t=10\\) s.
    `,
    answer: `
      Change in velocity = area under a–t:
      \\(\\Delta v = 4\\cdot3 + (-2)\\cdot5 + 0\\cdot2 = 12-10+0=\\mathbf{2}\\).
      So \\(v= u+\\Delta v = 5+2=\\mathbf{7\\ m/s}\\).
    `
  },
  {
    id: "at3",
    category: "graphs-acceleration-time",
    difficulty: "challenge",
    title: "From a–t to v–t sketch",
    prompt: `
      An object starts with velocity 10 m/s.
      Its acceleration–time graph is a straight line decreasing from 4 m/s² at \\(t=0\\) to 0 m/s² at \\(t=8\\).
      <ol>
        <li>Find the change in velocity from 0–8 s.</li>
        <li>Find the velocity at 8 s.</li>
        <li>Describe the shape of the velocity–time graph.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Area under a–t is a triangle: \\(\\tfrac12\\cdot 8\\cdot 4=\\mathbf{16\\ m/s}\\).</li>
        <li>\\(v=10+16=\\mathbf{26\\ m/s}\\).</li>
        <li>v–t increases but with decreasing slope (concave down), because acceleration is reducing to zero.</li>
      </ol>
    `
  },

  // --- SUVAT / Constant Acceleration (more) ---
  {
    id: "sv1",
    category: "suvat",
    difficulty: "foundation",
    title: "From rest with constant acceleration",
    prompt: `
      A scooter starts from rest and accelerates at 1.5 m/s² for 12 s.
      <ol>
        <li>Find the final velocity.</li>
        <li>Find the distance traveled.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>\\(v=u+at = 0 + 1.5\\cdot12 = \\mathbf{18\\ m/s}\\).</li>
        <li>\\(s=ut+\\tfrac12at^2 = 0 + \\tfrac12\\cdot1.5\\cdot 12^2 = 0.75\\cdot144 = \\mathbf{108\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "sv2",
    category: "suvat",
    difficulty: "standard",
    title: "Van skids to a stop (your screenshot Q4)",
    prompt: `
      A van skids to a halt from an initial speed of 24 m/s covering a distance of 36 m.
      Assume constant acceleration.
      <ol>
        <li>Find the acceleration.</li>
        <li>Find the time it takes to stop.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Use \\(v^2=u^2+2as\\): \\(0=24^2+2a(36)\\) → \\(0=576+72a\\) → \\(a=\\mathbf{-8\\ m/s^2}\\).</li>
        <li>Use \\(v=u+at\\): \\(0=24-8t\\) → \\(t=\\mathbf{3\\ s}\\).</li>
      </ol>
    `
  },
  {
    id: "sv3",
    category: "suvat",
    difficulty: "standard",
    title: "Train journey (your screenshot Q3)",
    prompt: `
      A train:
      accelerates from rest uniformly for 60 s,
      then travels at constant speed 17 m/s for 60 s,
      then slows uniformly for 45 s until it is moving at 10 m/s,
      then accelerates uniformly for 75 s to reach 20 m/s,
      then slows uniformly for 30 s to stop.
      <ol>
        <li>Find the acceleration in each non-constant segment.</li>
        <li>Find the total distance traveled.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Segment 1: \\(a=(17-0)/60=\\mathbf{0.283\\ m/s^2}\\).
            Segment 3: \\(a=(10-17)/45=\\mathbf{-0.156\\ m/s^2}\\).
            Segment 4: \\(a=(20-10)/75=\\mathbf{0.133\\ m/s^2}\\).
            Segment 5: \\(a=(0-20)/30=\\mathbf{-0.667\\ m/s^2}\\).</li>
        <li>Total distance = area under v–t (use trapezia/rectangles):
            <br>1) \\(\\tfrac12\\cdot60\\cdot17=510\\)
            <br>2) \\(60\\cdot17=1020\\)
            <br>3) \\(\\tfrac12(17+10)\\cdot45=607.5\\)
            <br>4) \\(\\tfrac12(10+20)\\cdot75=1125\\)
            <br>5) \\(\\tfrac12\\cdot30\\cdot20=300\\)
            <br>Total = \\(\\mathbf{3562.5\\ m}\\).
        </li>
      </ol>
    `
  },
  {
    id: "sv4",
    category: "suvat",
    difficulty: "challenge",
    title: "Skier down a slope (your screenshot Q5)",
    prompt: `
      A skier starts with initial speed 2 m/s and gains speed at a constant rate.
      After 10 s she is moving at 6 m/s.
      <ol>
        <li>Find an expression for her speed \\(v(t)\\).</li>
        <li>Find an expression for the distance \\(s(t)\\).</li>
        <li>The slope is 400 m long. Find her speed at the bottom.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Acceleration \\(a=(6-2)/10=\\mathbf{0.4}\\). So \\(v(t)=2+0.4t\\).</li>
        <li>\\(s(t)=ut+\\tfrac12at^2=2t+0.2t^2\\).</li>
        <li>Set \\(2t+0.2t^2=400\\) → \\(0.2t^2+2t-400=0\\) → divide by 0.2: \\(t^2+10t-2000=0\\).
            \\(t=\\frac{-10+\\sqrt{100+8000}}{2}=\\frac{-10+\\sqrt{8100}}{2}=\\frac{-10+90}{2}=40\\) s.
            Speed: \\(v=2+0.4\\cdot40=\\mathbf{18\\ m/s}\\).</li>
      </ol>
    `
  },
  {
    id: "sv5",
    category: "suvat",
    difficulty: "foundation",
    title: "Find time using v = u + at",
    prompt: `
      A car speeds up from 10 m/s to 22 m/s with constant acceleration of 1.5 m/s².
      Find the time taken.
    `,
    answer: `
      \\(t=\\frac{v-u}{a}=\\frac{22-10}{1.5}=\\frac{12}{1.5}=\\mathbf{8\\ s}\\).
    `
  },
  {
    id: "sv6",
    category: "suvat",
    difficulty: "standard",
    title: "Stopping distance from v^2 = u^2 + 2as",
    prompt: `
      A cyclist is travelling at 12 m/s and brakes with constant deceleration of 1.8 m/s².
      Find the stopping distance.
    `,
    answer: `
      Use \\(v^2=u^2+2as\\): \\(0=12^2+2(-1.8)s\\) → \\(0=144-3.6s\\) → \\(s=\\mathbf{40\\ m}\\).
    `
  },
  {
    id: "sv7",
    category: "suvat",
    difficulty: "challenge",
    title: "Two-stage motion",
    prompt: `
      A runner accelerates uniformly from rest to 8 m/s in 4 s, then continues at 8 m/s for 10 s.
      <ol>
        <li>Find the acceleration.</li>
        <li>Find the total distance traveled in 14 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>\\(a=(8-0)/4=\\mathbf{2\\ m/s^2}\\).</li>
        <li>Distance = area under v–t:
            first 4 s triangle: \\(\\tfrac12\\cdot4\\cdot8=16\\) m,
            next 10 s rectangle: \\(10\\cdot8=80\\) m.
            Total = \\(\\mathbf{96\\ m}\\).</li>
      </ol>
    `
  },
  {
    id: "sv8",
    category: "suvat",
    difficulty: "standard",
    title: "Find acceleration from distance and speeds",
    prompt: `
      A motorcycle increases its speed from 6 m/s to 18 m/s over a distance of 96 m (constant acceleration).
      Find the acceleration.
    `,
    answer: `
      \\(v^2=u^2+2as\\): \\(18^2=6^2+2a(96)\\) → \\(324=36+192a\\) → \\(288=192a\\) → \\(a=\\mathbf{1.5\\ m/s^2}\\).
    `
  },
  {
    id: "sv9",
    category: "suvat",
    difficulty: "foundation",
    title: "Distance with constant speed",
    prompt: `
      A bus travels at 15 m/s for 2 minutes.
      Find the distance traveled (in meters).
    `,
    answer: `
      Time = 120 s. Distance = \\(vt=15\\cdot120=\\mathbf{1800\\ m}\\).
    `
  },

  // --- Calculus of Motion (more) ---
  {
    id: "c1",
    category: "calculus",
    difficulty: "foundation",
    title: "Differentiate to get velocity",
    prompt: `
      The displacement is \\(x=4t^2-3t+7\\) (m). Find the velocity \\(v(t)\\).
    `,
    answer: `
      \\(v=\\frac{dx}{dt}=8t-3\\) m/s.
    `
  },
  {
    id: "c2",
    category: "calculus",
    difficulty: "standard",
    title: "Differentiate twice to get acceleration",
    prompt: `
      The displacement is \\(x=t^4-2t^2\\) (m). Find \\(v(t)\\) and \\(a(t)\\).
    `,
    answer: `
      \\(v=4t^3-4t\\). \\(a=\\frac{dv}{dt}=12t^2-4\\).
    `
  },
  {
    id: "c3",
    category: "calculus",
    difficulty: "standard",
    title: "Integrate acceleration to get velocity",
    prompt: `
      A particle has acceleration \\(a=6t-4\\) (m/s²) and velocity \\(v=5\\) m/s when \\(t=0\\).
      Find \\(v(t)\\).
    `,
    answer: `
      \\(v=\\int (6t-4)dt = 3t^2-4t + C\\).
      Using \\(v(0)=5\\) gives \\(C=5\\).
      So \\(v(t)=\\mathbf{3t^2-4t+5}\\).
    `
  },
  {
    id: "c4",
    category: "calculus",
    difficulty: "challenge",
    title: "Integrate velocity to get displacement",
    prompt: `
      A particle has velocity \\(v=12t-3t^2\\) (m/s) and starts at \\(x=2\\) m when \\(t=0\\).
      Find \\(x(t)\\).
    `,
    answer: `
      \\(x=\\int(12t-3t^2)dt = 6t^2 - t^3 + C\\).
      Using \\(x(0)=2\\) gives \\(C=2\\).
      So \\(x(t)=\\mathbf{6t^2-t^3+2}\\).
    `
  },
  {
    id: "c5",
    category: "calculus",
    difficulty: "challenge",
    title: "When is the particle at rest?",
    prompt: `
      A particle has displacement \\(x=2t^3-9t^2+12t\\).
      <ol>
        <li>Find \\(v(t)\\).</li>
        <li>Find when the particle is at rest.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>\\(v=\\frac{dx}{dt}=6t^2-18t+12=6(t^2-3t+2)=6(t-1)(t-2)\\).</li>
        <li>At rest when \\(v=0\\): \\(t=\\mathbf{1\\ s}\\) or \\(\\mathbf{2\\ s}\\).</li>
      </ol>
    `
  },
  {
    id: "c6",
    category: "calculus",
    difficulty: "standard",
    title: "Use a = v dv/dx",
    prompt: `
      A particle has acceleration \\(a=2x\\) (m/s²). When \\(x=1\\) m, the speed is \\(v=3\\) m/s.
      Use \\(a=v\\frac{dv}{dx}\\) to find \\(v\\) in terms of \\(x\\).
    `,
    answer: `
      \\(2x = v\\frac{dv}{dx}\\) → \\(v\\,dv = 2x\\,dx\\).
      Integrate: \\(\\tfrac12 v^2 = x^2 + C\\) → \\(v^2 = 2x^2 + C'\\).
      Use \\(x=1, v=3\\): \\(9=2(1)^2+C'\\) → \\(C'=7\\).
      So \\(v=\\sqrt{\\mathbf{2x^2+7}}\\).
    `
  },

  // --- Mixed Exam-Style (more) ---
  {
    id: "mx1",
    category: "mixed",
    difficulty: "foundation",
    title: "Spot the graph meaning",
    prompt: `
      True or False (explain briefly):
      <ol>
        <li>A horizontal line on a distance–time graph means constant speed.</li>
        <li>The area under a velocity–time graph gives displacement.</li>
        <li>The gradient of a velocity–time graph gives acceleration.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li><strong>False</strong> — horizontal distance–time means <strong>no change in distance</strong> → at rest.</li>
        <li><strong>True</strong> — area (signed) under v–t gives displacement.</li>
        <li><strong>True</strong> — gradient of v–t is acceleration.</li>
      </ol>
    `
  },
  {
    id: "mx2",
    category: "mixed",
    difficulty: "standard",
    title: "From words to v–t graph",
    prompt: `
      Describe (or sketch) a velocity–time graph for:
      <ul>
        <li>Starts from rest</li>
        <li>Accelerates uniformly for 6 s to 12 m/s</li>
        <li>Continues at constant velocity for 5 s</li>
        <li>Decelerates uniformly to rest in 3 s</li>
      </ul>
      Then find the total displacement.
    `,
    answer: `
      Graph: line up, flat, line down to 0.
      Displacement = area:
      triangle1: \\(\\tfrac12\\cdot6\\cdot12=36\\),
      rectangle: \\(5\\cdot12=60\\),
      triangle2: \\(\\tfrac12\\cdot3\\cdot12=18\\).
      Total = \\(\\mathbf{114\\ m}\\).
    `
  },
  {
    id: "mx3",
    category: "mixed",
    difficulty: "challenge",
    title: "Velocity zero, then reverse direction",
    prompt: `
      A particle has velocity \\(v= t^2 - 6t + 5\\).
      <ol>
        <li>Find when it changes direction.</li>
        <li>State the direction of motion on each interval.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Change direction when \\(v=0\\): \\(t^2-6t+5=0\\) → \\((t-1)(t-5)=0\\) so \\(t=\\mathbf{1}\\) and \\(\\mathbf{5}\\).</li>
        <li>For \\(t<1\\), \\(v>0\\) (forward). For \\(1<t<5\\), \\(v<0\\) (backward). For \\(t>5\\), \\(v>0\\) (forward).</li>
      </ol>
    `
  },
  {
    id: "mx4",
    category: "mixed",
    difficulty: "standard",
    title: "Acceleration from a table",
    prompt: `
      A car’s velocity is recorded:
      <table style="width:100%; border-collapse:collapse">
        <tr><th style="border:1px solid #ddd;padding:6px">t (s)</th><th style="border:1px solid #ddd;padding:6px">0</th><th style="border:1px solid #ddd;padding:6px">2</th><th style="border:1px solid #ddd;padding:6px">4</th><th style="border:1px solid #ddd;padding:6px">6</th></tr>
        <tr><th style="border:1px solid #ddd;padding:6px">v (m/s)</th><td style="border:1px solid #ddd;padding:6px">3</td><td style="border:1px solid #ddd;padding:6px">7</td><td style="border:1px solid #ddd;padding:6px">11</td><td style="border:1px solid #ddd;padding:6px">15</td></tr>
      </table>
      <ol>
        <li>Is the acceleration constant?</li>
        <li>Find the acceleration.</li>
      </ol>
    `,
    answer: `
      Velocity increases by 4 m/s every 2 s, so acceleration is constant:
      \\(a=\\Delta v/\\Delta t = 4/2 = \\mathbf{2\\ m/s^2}\\).
    `
  },
  {
    id: "mx5",
    category: "mixed",
    difficulty: "challenge",
    title: "Find displacement from v(t) with sign",
    prompt: `
      A particle has velocity \\(v(t)=6-3t\\) for \\(0\\le t\\le 4\\).
      <ol>
        <li>Find the time when it changes direction.</li>
        <li>Find the displacement from 0–4 s.</li>
        <li>Find the distance traveled from 0–4 s.</li>
      </ol>
    `,
    answer: `
      <ol>
        <li>Change direction when \\(v=0\\): \\(6-3t=0\\Rightarrow t=\\mathbf{2\\ s}\\).</li>
        <li>Displacement = \\(\\int_0^4 (6-3t)dt = [6t-1.5t^2]_0^4=24-24=\\mathbf{0\\ m}\\).</li>
        <li>Distance: compute area 0–2 (triangle above axis) + 2–4 (triangle below axis as positive):
            0–2: \\(\\tfrac12\\cdot2\\cdot6=6\\). 2–4: \\(\\tfrac12\\cdot2\\cdot6=6\\). Total distance = \\(\\mathbf{12\\ m}\\).</li>
      </ol>
    `
  }

];

function initPracticeProblems() {
  const categorySelect = document.getElementById("practice-category");
  const difficultySelect = document.getElementById("practice-difficulty");
  const listEl = document.getElementById("practice-list");
  const statsEl = document.getElementById("practice-stats");
  const btnRandom = document.getElementById("practice-random");
  const btnReset = document.getElementById("practice-reset");

  if (!categorySelect || !difficultySelect || !listEl) return;

  const state = {
    category: categorySelect.value || "all",
    difficulty: difficultySelect.value || "all"
  };

  function filterProblems() {
    return PRACTICE_PROBLEMS.filter(p => {
      const catOk = state.category === "all" || p.category === state.category;
      const diffOk = state.difficulty === "all" || p.difficulty === state.difficulty;
      return catOk && diffOk;
    });
  }

  function render(problems) {
    listEl.innerHTML = "";
    const count = problems.length;
    statsEl && (statsEl.textContent = `${count} question${count === 1 ? "" : "s"} showing`);

    problems.forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "problem-card";

      const difficultyLabel = p.difficulty === "foundation" ? "Foundation" : (p.difficulty === "challenge" ? "Challenge" : "Standard");

      card.innerHTML = `
        <header class="problem-header">
          <div class="problem-meta">
            <span class="pill">${difficultyLabel}</span>
            <span class="pill muted">${p.category.replace(/-/g," ")}</span>
          </div>
          <h3 class="problem-title">${idx + 1}. ${p.title}</h3>
        </header>

        <div class="problem-body">
          <div class="problem-prompt">${p.prompt}</div>

          <div class="problem-actions">
            <button class="btn btn-small btn-outline" data-action="toggle-answer" aria-expanded="false">
              <i class="fas fa-eye"></i> Show Answer
            </button>
          </div>

          <div class="problem-answer" hidden>
            <div class="answer-box">
              ${p.answer}
            </div>
          </div>
        </div>
      `;

      const toggleBtn = card.querySelector('[data-action="toggle-answer"]');
      const answerBox = card.querySelector(".problem-answer");

      toggleBtn?.addEventListener("click", () => {
        const isHidden = answerBox.hasAttribute("hidden");
        if (isHidden) {
          answerBox.removeAttribute("hidden");
          toggleBtn.setAttribute("aria-expanded", "true");
          toggleBtn.innerHTML = `<i class="fas fa-eye-slash"></i> Hide Answer`;
          // re-typeset MathJax after expanding
          if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([card]);
        } else {
          answerBox.setAttribute("hidden", "");
          toggleBtn.setAttribute("aria-expanded", "false");
          toggleBtn.innerHTML = `<i class="fas fa-eye"></i> Show Answer`;
        }
      });

      listEl.appendChild(card);
    });

    // typeset all new math
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([listEl]);
  }

  function applyAndRender() {
    const filtered = filterProblems();
    render(filtered);
  }

  categorySelect.addEventListener("change", () => {
    state.category = categorySelect.value;
    applyAndRender();
  });

  difficultySelect.addEventListener("change", () => {
    state.difficulty = difficultySelect.value;
    applyAndRender();
  });

  btnReset?.addEventListener("click", () => {
    categorySelect.value = "all";
    difficultySelect.value = "standard";
    state.category = "all";
    state.difficulty = "standard";
    applyAndRender();
  });

  btnRandom?.addEventListener("click", () => {
    const filtered = filterProblems();
    // pick up to 6 random problems
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    render(shuffled.slice(0, Math.min(6, shuffled.length)));
  });

  // initial render
  applyAndRender();
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
