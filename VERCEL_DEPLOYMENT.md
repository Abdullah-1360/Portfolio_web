# Deploying Flutter Portfolio to Vercel

This guide will help you deploy your Flutter portfolio web application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your project should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Flutter SDK**: Ensure Flutter is installed locally for testing

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository
   - Select the `portfolio_web` folder as the root directory

3. **Configure Build Settings**:
   - Framework Preset: **Other**
   - Build Command: `flutter build web --release --web-renderer html`
   - Output Directory: `build/web`
   - Install Command: `flutter pub get`

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be available at the provided Vercel URL

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**:
   ```bash
   cd "g:\Study data\ApplicationMaterial\portfolio_web"
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (for first deployment)
   - Project name: `portfolio-web` (or your preferred name)
   - Directory: `./` (current directory)

## Configuration Details

The `vercel.json` file includes:

- **Build Command**: Builds Flutter web with HTML renderer for better compatibility
- **Output Directory**: Points to Flutter's web build output
- **Routing**: Ensures all routes redirect to index.html for SPA behavior
- **Caching**: Optimizes asset caching for better performance

## Environment Variables (if needed)

If your app uses environment variables:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your variables for Production, Preview, and Development

## Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

## Automatic Deployments

Once connected to Git:
- **Production**: Deploys automatically on pushes to `main` branch
- **Preview**: Creates preview deployments for pull requests
- **Development**: Can be configured for other branches

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `pubspec.yaml`
- Verify Flutter version compatibility

### 404 Errors
- Check that `vercel.json` routing is configured correctly
- Ensure all assets are properly referenced

### Performance Issues
- Use `--web-renderer html` for better compatibility
- Optimize images and assets
- Enable caching headers (already configured in `vercel.json`)

### Assets Not Loading
- Verify assets are declared in `pubspec.yaml`
- Check asset paths are relative
- Ensure assets folder is included in Git

## Monitoring and Analytics

- **Performance**: Use Vercel Analytics for performance insights
- **Logs**: Check Function Logs for any runtime errors
- **Usage**: Monitor bandwidth and function invocations

## Next Steps

1. Test your deployment thoroughly
2. Set up custom domain if needed
3. Configure analytics and monitoring
4. Set up branch protection rules for automatic deployments

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Flutter Web Documentation](https://docs.flutter.dev/platform-integration/web)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

Your Flutter portfolio is now ready for Vercel deployment! 🚀