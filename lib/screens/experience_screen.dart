import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/experience_section.dart';

class ExperienceScreen extends StatelessWidget {
  const ExperienceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomAppBar(
              onThemeToggle: () {},
              onNavigate: (index) {},
              currentSection: 4,
            ),
            ExperienceSection(
              experiences: [],
            ),
          ],
        ),
      ),
    );
  }
}