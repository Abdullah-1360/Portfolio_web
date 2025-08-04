import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:responsive_framework/responsive_framework.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/about_section.dart';
import '../providers/portfolio_provider.dart';
import '../providers/theme_provider.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final portfolioProvider = Provider.of<PortfolioProvider>(context);
    
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomAppBar(
              onThemeToggle: () => themeProvider.toggleTheme(),
              onNavigate: (index) {},
              currentSection: 1,
            ),
            AboutSection(
              personalInfo: portfolioProvider.personalInfo,
            ),
          ],
        ),
      ),
    );
  }
}