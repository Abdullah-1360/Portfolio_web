import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/contact_section.dart';

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            CustomAppBar(
              onThemeToggle: () {},
              onNavigate: (index) {},
              currentSection: 5,
            ),
            const ContactSection(),
          ],
        ),
      ),
    );
  }
}