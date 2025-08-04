# Deployment to GitHub Pages

This guide will help you deploy your Flutter portfolio website to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Your portfolio code pushed to a GitHub repository

## Setup Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `portfolio` or `portfolio-website`
3. Make sure it's public (required for free GitHub Pages)
4. Don't initialize with README, .gitignore, or license (since you already have code)

### 2. Push Your Code to GitHub

```bash
# Navigate to your portfolio directory
cd "g:\Study data\ApplicationMaterial\portfolio_web"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Flutter portfolio website"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/Abdullah-1360/your-repository-name.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically trigger on your next push

### 4. Access Your Website

After the GitHub Actions workflow completes (usually 2-5 minutes):
- Your website will be available at: `https://abdullah-1360.github.io/your-repository-name/`
- You can find the exact URL in the Pages settings

## Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Automatically build your Flutter web app
- Deploy it to GitHub Pages
- Trigger on every push to the main branch

## Custom Domain (Optional)

If you have a custom domain:
1. Add a `CNAME` file to the `web` folder with your domain name
2. Update the `cname` field in the GitHub Actions workflow
3. Configure your domain's DNS to point to GitHub Pages

## Troubleshooting

- **Build fails**: Check the Actions tab for error details
- **404 errors**: Ensure the base href is correctly configured
- **Assets not loading**: Make sure all assets are in the `assets` folder and declared in `pubspec.yaml`

## Notes

- The `.nojekyll` file prevents GitHub from processing the site as Jekyll
- The workflow uses the HTML renderer for better compatibility
- Changes to the main branch will automatically redeploy the site