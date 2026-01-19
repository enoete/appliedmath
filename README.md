# CAPE Applied Mathematics Unit 2 - Interactive Learning Resource

An interactive, comprehensive learning resource for CAPE Applied Mathematics Unit 2, Module 3: Kinematics and Dynamics.

## Features

### 📚 Complete Syllabus Coverage
- **2.1** Kinematics Basics (Distance vs Displacement, Speed vs Velocity)
- **2.2** Motion Graphs (Displacement-time, Velocity-time graphs)
- **2.3** Kinematic Quantities (SUVAT equations)
- **2.4** Newton's Laws of Motion
- **2.5-2.6** Calculus of Motion (Differential equations)
- **2.7** Momentum and Impulse

### 🎮 Interactive Animations
- **Displacement-Time Graph Simulator** - Adjust initial position, velocity, and acceleration
- **Velocity-Time Graph Simulator** - Visualize area under the curve as displacement
- **Projectile Motion Simulator** - Launch projectiles at different angles and speeds
- **Collision Simulator** - Explore elastic and inelastic collisions

### 📝 Practice Problems
- **Guided Problems** - Step-by-step solutions with expandable hints
- **Independent Practice** - Problems with AI-powered feedback
- **Exam-Style Questions** - CAPE-level questions with AI grading

### 🤖 AI Tutor Integration (Secure!)
- **API key is protected** using Netlify Functions (serverless)
- Students never see your API key
- Ask questions about any topic
- Get step-by-step explanations
- Receive personalized feedback on solutions

### 📋 Formula Reference
- SUVAT Equations
- Newton's Laws
- Momentum & Impulse formulas
- Calculus relations
- Projectile motion formulas
- Energy & Work equations

## Deployment Instructions

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it something like `cape-applied-math`
4. Make it **Public** (required for free Netlify hosting)
5. Click **Create repository**

### Step 2: Upload Files to GitHub

**Option A: Using GitHub Web Interface (Easiest)**
1. In your new repository, click **"uploading an existing file"**
2. Drag and drop ALL files from this folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `netlify.toml`
   - `netlify/functions/chat.js` (create the folder structure)
3. Click **Commit changes**

**Option B: Using Git Command Line**
```bash
git init
git add .
git commit -m "Initial commit - CAPE Applied Math Resource"
git remote add origin https://github.com/YOUR_USERNAME/cape-applied-math.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (use GitHub login)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Leave build settings as default and click **"Deploy site"**
5. Wait for deployment (usually 1-2 minutes)

### Step 4: Configure Your API Key (IMPORTANT!)

This is where the magic happens - your API key stays secure!

1. In Netlify, go to your site's dashboard
2. Click **"Site configuration"** → **"Environment variables"**
3. Click **"Add a variable"**
4. Set:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `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`
5. Click **"Create variable"**
6. **Redeploy your site** (Deploys → Trigger deploy → Deploy site)

### Step 5: Share with Students!

Your site URL will be something like: `https://your-site-name.netlify.app`

Students can now:
- Use all interactive features
- Chat with the AI tutor
- **WITHOUT ever seeing your API key!**

## File Structure

```
cape-applied-math-unit2/
├── index.html              # Main HTML file
├── styles.css              # Stylesheet
├── app.js                  # JavaScript application
├── netlify.toml            # Netlify configuration
├── README.md               # This file
└── netlify/
    └── functions/
        └── chat.js         # Serverless function for AI (keeps API key secure)
```

## How the Security Works

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Student   │────▶│ Netlify Function │────▶│  OpenAI API │
│   Browser   │     │   (chat.js)      │     │             │
└─────────────┘     └─────────────────┘     └─────────────┘
                           │
                    API Key stored
                    securely here
                    (never sent to browser)
```

1. Student asks a question in the browser
2. Request goes to your Netlify Function
3. Function adds your API key (stored in environment variables)
4. Function calls OpenAI and returns the response
5. Student sees the answer - but never the API key!

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technologies Used

- HTML5
- CSS3 (with CSS Variables and Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Chart.js (for graphs)
- MathJax (for mathematical notation)
- Font Awesome (for icons)
- **Netlify Functions** (for secure API handling)
- OpenAI API (for AI tutoring)

## Customization

### Adding New Problems
Edit the `index.html` file and add new problem cards following the existing structure.

### Modifying Topic Content
Topic content is stored in the `topicData` object in `app.js`. Edit the HTML content for each topic as needed.

### Styling
All styles are in `styles.css` using CSS variables for easy customization. Modify the `:root` section to change colors, fonts, and spacing.

## Troubleshooting

### AI Tutor says "not configured"
- Make sure you added the `OPENAI_API_KEY` environment variable in Netlify
- Make sure you redeployed after adding the variable

### Site not loading
- Check that all files were uploaded correctly
- Verify the `netlify.toml` file is in the root directory

### Functions not working
- Ensure the `netlify/functions/chat.js` file exists
- Check the Netlify Functions logs in your dashboard

## Support

For issues or questions about CAPE Applied Mathematics content, consult:
- CXC CAPE Applied Mathematics Syllabus
- Your teacher or tutor
- The AI Tutor feature in this application

## License

This educational resource is provided for learning purposes. Feel free to modify and distribute for educational use.

---

Created for CAPE Applied Mathematics Unit 2 Students
🔒 **Your API key is protected with Netlify Functions!**
