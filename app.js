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
    initPracticeQuestionBank();
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

function initPracticeQuestionBank() {
    const topicSelect = document.getElementById('practice-topic');
    const diffSelect = document.getElementById('practice-difficulty');
    const listEl = document.getElementById('practice-list');
    const countEl = document.getElementById('practice-count');
    const btnRandom = document.getElementById('btn-random-set');
    const btnReset = document.getElementById('btn-reset-filters');

    if (!topicSelect || !diffSelect || !listEl || !countEl) return;

    // --- Question Bank ---
    // topic: distance-time | velocity-time | acceleration-time | suvat | calculus | mixed
    // difficulty: foundation | standard | challenge
    const QUESTIONS = [
        {
            id: 'dt_walk_wait_bus',
            topic: 'distance-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `A distance–time graph shows a person leaving home at 9:00 am, walking to a bus stop, waiting, then taking a bus into town.
(i) Describe what is happening during the time from A to B. (3 marks)`,
            answer: `From A to B the graph is horizontal (distance constant), so the person is **not moving** (waiting at the bus stop / at rest).`,
            steps: [
                `On a distance–time graph, the gradient represents speed.`,
                `A horizontal line has gradient 0.`,
                `So speed is 0 → stationary/waiting.`
            ]
        },
        {
            id: 'dt_steeper',
            topic: 'distance-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `The section BC on a distance–time graph is much steeper than OA. What does this tell you about the motion? (3 marks)`,
            answer: `BC has a larger gradient than OA, so the speed during BC is **greater** than during OA (moving faster, e.g. on the bus).`,
            steps: [
                `Speed = gradient of distance–time graph.`,
                `Steeper line → larger gradient.`,
                `Therefore higher speed on BC than on OA.`
            ]
        },
        {
            id: 'dt_draw_vt',
            topic: 'distance-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `A distance–time graph has three sections: OA (straight rising), AB (flat), BC (straight rising steeper).
Sketch the speed–time graph. (3 marks)`,
            answer: `Speed–time: a **constant positive** speed for OA; then **zero** speed for AB; then a **larger constant** speed for BC.`,
            steps: [
                `Straight-line rising on s–t → constant speed (horizontal line on v–t above 0).`,
                `Flat on s–t → speed 0 (line on v–t at 0).`,
                `Steeper rising on s–t → higher constant speed (higher horizontal line).`
            ]
        },

        // Velocity–time → acceleration
        {
            id: 'vt_acc_a',
            topic: 'velocity-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `A velocity–time graph is a straight line from (0 s, 0 m/s) to (5 s, 4 m/s).
Find the acceleration. (3 marks)`,
            answer: `Acceleration = gradient = \\(\\frac{4-0}{5-0}=0.8\\,\\text{m s}^{-2}\\).`,
            steps: [
                `Acceleration is the gradient of a v–t graph.`,
                `Compute rise/run: (4−0)/(5−0).`,
                `So \\(a=0.8\\,\\text{m s}^{-2}\\).`
            ]
        },
        {
            id: 'vt_disp_area',
            topic: 'velocity-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `A velocity–time graph is constant at \\(v=6\\,\\text{m/s}\\) for 8 seconds.
Find the displacement in that time. (3 marks)`,
            answer: `Displacement = area = \\(6\\times 8=48\\,\\text{m}\\).`,
            steps: [
                `Displacement is the area under the v–t graph.`,
                `Constant velocity gives a rectangle.`,
                `Area = base×height = 8×6 = 48 m.`
            ]
        },
        {
            id: 'vt_negative_area',
            topic: 'velocity-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `Explain what a **negative** area under a velocity–time graph represents. (3 marks)`,
            answer: `It represents **negative displacement**: the object’s net movement is in the opposite direction to the chosen positive direction.`,
            steps: [
                `Area under v–t = displacement (signed).`,
                `Below the time axis means v is negative.`,
                `So displacement accumulated is negative (opposite direction).`
            ]
        },

        // Acceleration-time
        {
            id: 'at_delta_v',
            topic: 'acceleration-time',
            difficulty: 'standard',
            marks: 3,
            prompt: `An acceleration–time graph is constant at \\(a=2\\,\\text{m s}^{-2}\\) for 6 seconds.
Find the change in velocity. (3 marks)`,
            answer: `\\(\\Delta v = a t = 2\\times 6=12\\,\\text{m/s}\\).`,
            steps: [
                `Change in velocity equals area under a–t graph.`,
                `Constant acceleration gives rectangle area: a×t.`,
                `So \\(\\Delta v=12\\,\\text{m/s}\\).`
            ]
        },

        // SUVAT style
        {
            id: 'suvat_van_skid',
            topic: 'suvat',
            difficulty: 'standard',
            marks: 3,
            prompt: `A van skids to a halt from an initial speed of \\(24\\,\\text{m/s}\\) over a distance of \\(36\\,\\text{m}\\).
Assuming constant acceleration, find the acceleration and the time to stop. (3 marks)`,
            answer: `Use \\(v^2=u^2+2as\\): \\(0=24^2+2a(36)\\Rightarrow a=-8\\,\\text{m s}^{-2}\\).
Then \\(v=u+at\\): \\(0=24-8t\\Rightarrow t=3\\,\\text{s}\\).`,
            steps: [
                `Given: u=24, v=0, s=36.`,
                `Use \\(v^2=u^2+2as\\) to find a.`,
                `Then use \\(v=u+at\\) to find t.`
            ]
        },
        {
            id: 'suvat_train_piecewise',
            topic: 'suvat',
            difficulty: 'challenge',
            marks: 6,
            prompt: `A train accelerates from rest to \\(17\\,\\text{m/s}\\) in 60 s, travels at 17 m/s for 60 s, then slows uniformly.
After 45 s of slowing, it is at 10 m/s. It then accelerates uniformly for 75 s to 20 m/s, then slows to rest in 30 s.
(i) Find the accelerations in each non-constant-speed phase.
(ii) Sketch the velocity–time graph. (6 marks)`,
            answer: `(i) Phase 1: \\(a_1=\\frac{17-0}{60}=0.283\\,\\text{m s}^{-2}\\).
Phase 3 (slowing): \\(a_3=\\frac{10-17}{45}=-0.156\\,\\text{m s}^{-2}\\).
Phase 4: \\(a_4=\\frac{20-10}{75}=0.133\\,\\text{m s}^{-2}\\).
Phase 5: \\(a_5=\\frac{0-20}{30}=-0.667\\,\\text{m s}^{-2}\\).
(ii) v–t is piecewise linear with flats where speed constant.`,
            steps: [
                `Acceleration = change in velocity / time for each phase.`,
                `Constant-speed phase has a=0 (flat v–t).`,
                `Sketch: straight lines between the stated (t,v) points.`
            ]
        },

        // Calculus of motion
        {
            id: 'calc_particle',
            topic: 'calculus',
            difficulty: 'standard',
            marks: 3,
            prompt: `The motion of a particle is \\(x=t^3-5t^2+4\\).
(a) Find an expression for velocity \\(v\\). (3 marks)`,
            answer: `\\(v=\\frac{dx}{dt}=3t^2-10t\\).`,
            steps: [
                `Velocity is derivative of position.`,
                `Differentiate: d/dt of t^3 is 3t^2.`,
                `Differentiate: d/dt of −5t^2 is −10t, constant 4 → 0.`
            ]
        },
        {
            id: 'calc_initials',
            topic: 'calculus',
            difficulty: 'standard',
            marks: 3,
            prompt: `Given \\(x=t^3-5t^2+4\\), find the initial position and initial velocity. (3 marks)`,
            answer: `At \\(t=0\\): \\(x(0)=4\\). Velocity \\(v=3t^2-10t\\) so \\(v(0)=0\\).`,
            steps: [
                `Initial means evaluate at t=0.`,
                `Compute x(0).`,
                `Differentiate for v(t), then compute v(0).`
            ]
        },
        {
            id: 'calc_v_zero',
            topic: 'calculus',
            difficulty: 'challenge',
            marks: 6,
            prompt: `Given \\(x=t^3-5t^2+4\\), find the time(s) when velocity is zero and the corresponding position(s). (6 marks)`,
            answer: `\\(v=3t^2-10t=t(3t-10)\\Rightarrow t=0\\) or \\(t=\\frac{10}{3}\\).
Positions: \\(x(0)=4\\).
\\(x(10/3)=\\left(\\frac{10}{3}\\right)^3-5\\left(\\frac{10}{3}\\right)^2+4=\\frac{1000}{27}-\\frac{500}{9}+4=\\frac{1000-1500+108}{27}=\\frac{-392}{27}\\approx -14.52\\).`,
            steps: [
                `Differentiate to get v(t).`,
                `Solve v(t)=0 for t.`,
                `Substitute each t into x(t) to get positions.`
            ]
        },

        // Braking model
        {
            id: 'brake_stop_time',
            topic: 'calculus',
            difficulty: 'standard',
            marks: 3,
            prompt: `During braking, a car’s speed is modeled by \\(v=40-2t^2\\) until it stops.
(i) How long does the car take to stop? (3 marks)`,
            answer: `Stop when \\(v=0\\): \\(40-2t^2=0\\Rightarrow t^2=20\\Rightarrow t=\\sqrt{20}=2\\sqrt{5}\\approx 4.47\\,\\text{s}\\).`,
            steps: [
                `Set v(t)=0 to find stopping time.`,
                `Solve for t (take positive root).`,
                `Compute approximate value if needed.`
            ]
        },
        {
            id: 'brake_distance',
            topic: 'calculus',
            difficulty: 'challenge',
            marks: 6,
            prompt: `During braking, \\(v=40-2t^2\\) until the car stops.
(ii) How far does it move before it stops? (6 marks)`,
            answer: `Displacement \\(s=\\int_0^{\\sqrt{20}} (40-2t^2)\\,dt = \\left[40t-\\frac{2}{3}t^3\\right]_0^{\\sqrt{20}}
=40\\sqrt{20}-\\frac{2}{3}(\\sqrt{20})^3.
Since (\\sqrt{20})^3=20\\sqrt{20}, s=40\\sqrt{20}-\\frac{40}{3}\\sqrt{20}=\\frac{80}{3}\\sqrt{20}
=\\frac{160}{3}\\sqrt{5}\\approx 119.3\\,\\text{m}.`,
            steps: [
                `Distance moved is the area under v–t from 0 to stop time.`,
                `Integrate v(t) over the interval.`,
                `Evaluate using t_stop=\\sqrt{20}.`
            ]
        },

        // More practice items (mix)
        {
            id: 'mixed_convert_units',
            topic: 'mixed',
            difficulty: 'foundation',
            marks: 3,
            prompt: `A car travels 1.5 km in 2 minutes. Find its average speed in m/s. (3 marks)`,
            answer: `\\(1.5\\text{ km}=1500\\text{ m}\\), \\(2\\text{ min}=120\\text{ s}\\). Speed \\(=1500/120=12.5\\,\\text{m/s}\\).`,
            steps: [
                `Convert km → m and minutes → seconds.`,
                `Use speed = distance/time.`,
                `Compute 1500/120.`
            ]
        },
        {
            id: 'suvat_freefall',
            topic: 'suvat',
            difficulty: 'standard',
            marks: 3,
            prompt: `A ball is dropped from rest and falls for 2.5 s. Take \\(g=9.8\\,\\text{m s}^{-2}\\).
Find its speed after 2.5 s. (3 marks)`,
            answer: `\\(v=u+at=0+9.8(2.5)=24.5\\,\\text{m/s}\\) downward.`,
            steps: [
                `Use v=u+at.`,
                `u=0, a=g.`,
                `Compute 9.8×2.5.`
            ]
        },
        {
            id: 'vt_piecewise_acc',
            topic: 'velocity-time',
            difficulty: 'challenge',
            marks: 6,
            prompt: `A velocity–time graph is piecewise linear:
From 0–6 s velocity increases from 0 to 3 m/s.
From 6–10 s velocity decreases from 3 to −2 m/s.
From 10–14 s velocity increases from −2 to −1 m/s.
(i) Find the acceleration on each interval.
(ii) Find the displacement from 0–14 s. (6 marks)`,
            answer: `(i) a1=(3-0)/6=0.5 m/s²; a2=(-2-3)/4=-1.25 m/s²; a3=(-1-(-2))/4=0.25 m/s².
(ii) Displacement = area:
0–6: triangle = ½·6·3=9
6–10: trapezium with heights 3 and −2: area = ½(3+(-2))·4=2
10–14: trapezium heights −2 and −1: area = ½(-2+(-1))·4=-6
Total = 9+2-6 = 5 m.`,
            steps: [
                `Acceleration is slope on each interval (Δv/Δt).`,
                `Displacement is signed area under v–t.`,
                `Use triangles/trapezia for each segment.`
            ]
        },
    ];

    // Add more questions programmatically (to make it extensive but still curated)
    const extra = [];
    const suvatTemplates = [
        {u:10, v:0, s:25},
        {u:12, v:20, t:4},
        {u:0, a:3, t:7},
        {u:18, a:-2, t:5},
    ];
    suvatTemplates.forEach((x, idx) => {
        const id = `suvat_extra_${idx+1}`;
        if (x.s !== undefined) {
            extra.push({
                id,
                topic: 'suvat',
                difficulty: 'standard',
                marks: 3,
                prompt: `An object slows from \\(u=${x.u}\\,\\text{m/s}\\) to rest over \\(s=${x.s}\\,\\text{m}\\) with constant acceleration. Find \\(a\\). (3 marks)`,
                answer: `Use \\(v^2=u^2+2as\\): \\(0=${x.u}^2+2a(${x.s})\\Rightarrow a=-\\frac{${x.u}^2}{2\\cdot ${x.s}}\\).`,
                steps: [`Identify u, v, s.`, `Use \\(v^2=u^2+2as\\).`, `Solve for a (negative).`]
            });
        } else if (x.v !== undefined) {
            extra.push({
                id,
                topic: 'suvat',
                difficulty: 'standard',
                marks: 3,
                prompt: `A runner increases speed from \\(u=${x.u}\\,\\text{m/s}\\) to \\(v=${x.v}\\,\\text{m/s}\\) in \\(t=${x.t}\\,\\text{s}\\). Find acceleration. (3 marks)`,
                answer: `\\(a=\\frac{v-u}{t}=\\frac{${x.v}-${x.u}}{${x.t}}\\,\\text{m s}^{-2}\\).`,
                steps: [`Use \\(a=\\Delta v/\\Delta t\\).`, `Substitute values.`, `Compute.`]
            });
        } else {
            extra.push({
                id,
                topic: 'suvat',
                difficulty: 'foundation',
                marks: 3,
                prompt: `Starting from rest, an object accelerates at \\(a=${x.a}\\,\\text{m s}^{-2}\\) for \\(t=${x.t}\\,\\text{s}\\). Find its final speed. (3 marks)`,
                answer: `\\(v=u+at=0+${x.a}(${x.t})=${x.a*x.t}\\,\\text{m/s}\\).`,
                steps: [`Use v=u+at.`, `u=0.`, `Multiply a×t.`]
            });
        }
    });
    QUESTIONS.push(...extra);

    function matches(q, topic, diff) {
        const topicOk = (topic === 'all') || (q.topic === topic) || (topic === 'mixed' && q.topic === 'mixed');
        const diffOk = (diff === 'all') || (q.difficulty === diff);
        return topicOk && diffOk;
    }

    function render(onlyIds = null) {
        const topic = topicSelect.value;
        const diff = diffSelect.value;

        let filtered = QUESTIONS.filter(q => matches(q, topic, diff));

        if (onlyIds && Array.isArray(onlyIds)) {
            const set = new Set(onlyIds);
            filtered = filtered.filter(q => set.has(q.id));
        }

        countEl.textContent = `${filtered.length} question${filtered.length === 1 ? '' : 's'} showing`;

        listEl.innerHTML = filtered.length ? '' : `
            <div class="empty-state card">
                <h3>No questions match these filters.</h3>
                <p>Try switching to <strong>All topics</strong> or <strong>All difficulties</strong>.</p>
            </div>
        `;

        filtered.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'practice-card card';
            card.innerHTML = `
                <div class="practice-card-header">
                    <div class="practice-badges">
                        <span class="pill">${prettyTopic(q.topic)}</span>
                        <span class="pill pill-muted">${prettyDiff(q.difficulty)}</span>
                        <span class="pill pill-accent">${q.marks} pts</span>
                    </div>
                    <div class="practice-card-actions">
                        <button class="btn btn-small btn-secondary toggle-answer" data-id="${q.id}">
                            <i class="fas fa-eye"></i> Show Answer
                        </button>
                    </div>
                </div>

                <div class="practice-question">
                    <h3>Q${idx + 1}</h3>
                    <p>${escapeHtmlExceptMath(q.prompt)}</p>
                </div>

                <div class="practice-answer" id="ans-${q.id}" hidden>
                    <div class="answer-block">
                        <h4>Answer</h4>
                        <p>${escapeHtmlExceptMath(q.answer)}</p>
                    </div>
                    ${q.steps?.length ? `
                    <div class="steps-block">
                        <h4>Steps</h4>
                        <ol>
                            ${q.steps.map(s => `<li>${escapeHtmlExceptMath(s)}</li>`).join('')}
                        </ol>
                    </div>` : ''}
                </div>
            `;
            listEl.appendChild(card);
        });

        // Wire toggles
        listEl.querySelectorAll('.toggle-answer').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const ans = document.getElementById(`ans-${id}`);
                const isHidden = ans?.hasAttribute('hidden');
                if (!ans) return;
                if (isHidden) {
                    ans.removeAttribute('hidden');
                    btn.innerHTML = `<i class="fas fa-eye-slash"></i> Hide Answer`;
                } else {
                    ans.setAttribute('hidden', '');
                    btn.innerHTML = `<i class="fas fa-eye"></i> Show Answer`;
                }
                // Re-typeset math
                if (window.MathJax?.typesetPromise) {
                    window.MathJax.typesetPromise([listEl]).catch(() => {});
                }
            });
        });

        // Typeset math after rendering
        if (window.MathJax?.typesetPromise) {
            window.MathJax.typesetPromise([listEl]).catch(() => {});
        }
    }

    function prettyTopic(t) {
        const map = {
            'distance-time': 'Distance–Time',
            'velocity-time': 'Velocity–Time',
            'acceleration-time': 'Acceleration–Time',
            'suvat': 'SUVAT',
            'calculus': 'Calculus',
            'mixed': 'Mixed'
        };
        return map[t] || t;
    }
    function prettyDiff(d) {
        const map = { foundation: 'Foundation', standard: 'Standard', challenge: 'Challenge' };
        return map[d] || d;
    }

    // Allow LaTeX as-is, but escape basic HTML to avoid accidental markup.
    function escapeHtmlExceptMath(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // allow basic formatting via markdown-ish line breaks
            .replace(/\n/g, '<br>');
    }

    function pickRandomSet() {
        const topic = topicSelect.value;
        const diff = diffSelect.value;
        let pool = QUESTIONS.filter(q => matches(q, topic, diff));
        if (pool.length === 0) pool = QUESTIONS.slice();

        // Choose 8 without replacement
        const chosen = [];
        const copy = pool.slice();
        while (chosen.length < Math.min(8, copy.length)) {
            const idx = Math.floor(Math.random() * copy.length);
            chosen.push(copy[idx].id);
            copy.splice(idx, 1);
        }
        render(chosen);
        // Scroll list into view
        listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    topicSelect.addEventListener('change', () => render());
    diffSelect.addEventListener('change', () => render());
    btnRandom?.addEventListener('click', pickRandomSet);
    btnReset?.addEventListener('click', () => {
        topicSelect.value = 'all';
        diffSelect.value = 'standard';
        render();
    });

    render();
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
