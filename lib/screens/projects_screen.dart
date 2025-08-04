import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/projects_section.dart';
import '../providers/portfolio_provider.dart';
import '../providers/theme_provider.dart';

class ProjectsScreen extends StatelessWidget {
  const ProjectsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final portfolioProvider = Provider.of<PortfolioProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomAppBar(
              onThemeToggle: themeProvider.toggleTheme,
              onNavigate: (index) {},
              currentSection: 3,
            ),
            ProjectsSection(
              projects: portfolioProvider.projects,
              featuredProjects: portfolioProvider.featuredProjects,
            ),
          ],
        ),
      ),
    );
  }
}