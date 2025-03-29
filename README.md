# DOGE Grants Chatbot

An official-looking government website with a chatbot that provides information about grants from the Department of Government Efficiency (DOGE) API.

## Features

- Government-styled website with responsive design
- Interactive chatbot that answers questions about grant data
- Data sourced from the DOGE API (`https://api.doge.gov/savings/grants`)
- Mobile-friendly interface

## Project Structure

```
doge-chatbot/
├── index.html          # Main HTML document
├── styles.css          # CSS styling
├── script.js           # JavaScript for chatbot functionality
└── README.md           # This documentation file
```

## Hosting on GitHub

1. Create a new GitHub repository:
   - Go to github.com and sign in
   - Click the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., "doge-grants-chatbot")
   - Add a description (optional)
   - Choose public visibility
   - Click "Create repository"

2. Initialize and push your local repository:
   ```bash
   cd /path/to/doge-chatbot
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/doge-grants-chatbot.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be published at `https://yourusername.github.io/doge-grants-chatbot/`

## Deployment via Vercel

1. Sign up or log in to Vercel:
   - Go to vercel.com
   - Sign up using your GitHub account or another method

2. Import your GitHub repository:
   - From the Vercel dashboard, click "New Project"
   - Connect to your GitHub account if you haven't already
   - Select the "doge-grants-chatbot" repository
   - Click "Import"

3. Configure and deploy:
   - Keep the default settings (Vercel will auto-detect that this is a static site)
   - Click "Deploy"
   - Vercel will build and deploy your site
   - Once completed, you'll get a URL like `https://doge-grants-chatbot.vercel.app`

4. Custom domain (optional):
   - In your project settings, go to "Domains"
   - Add your custom domain
   - Follow the instructions to configure DNS settings

## Maintenance

- To update the grant data:
  1. Fetch the latest data from the DOGE API
  2. Update the `grantData` object in `script.js`
  3. Push changes to GitHub (Vercel will automatically redeploy)

## Testing

Test the chatbot by asking various questions such as:
- "What is the largest grant?"
- "Who received grants?"
- "What's the total value of all grants?"
- "Tell me about GAVI Foundation"
- "How much savings do these grants provide?"
- "Which agencies provided grants?"