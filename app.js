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
