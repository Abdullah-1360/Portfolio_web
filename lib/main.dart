import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'screens/home_screen.dart';
import 'screens/about_screen.dart';
import 'screens/projects_screen.dart';
import 'screens/experience_screen.dart';
import 'screens/contact_screen.dart';
import 'providers/theme_provider.dart';
import 'providers/portfolio_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => PortfolioProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp.router(
            title: 'Abdullah Shahid - Flutter Developer Portfolio',
            debugShowCheckedModeBanner: false,
            theme: _buildTheme(false),
            darkTheme: _buildTheme(true),
            themeMode: themeProvider.themeMode,
            routerConfig: _router,
            builder: (context, child) => ResponsiveBreakpoints.builder(
              child: child!,
              breakpoints: [
                const Breakpoint(start: 0, end: 480, name: MOBILE),
                const Breakpoint(start: 481, end: 768, name: TABLET),
                const Breakpoint(start: 769, end: 1024, name: 'SMALL_DESKTOP'),
                const Breakpoint(start: 1025, end: 1440, name: DESKTOP),
                const Breakpoint(start: 1441, end: 1920, name: 'LARGE_DESKTOP'),
                const Breakpoint(start: 1921, end: double.infinity, name: '4K'),
              ],
            ),
          );
        },
      ),
    );
  }

  ThemeData _buildTheme(bool isDark) {
    final colorScheme = isDark
        ? const ColorScheme.dark(
            primary: Color(0xFF64FFDA),
            secondary: Color(0xFF64FFDA),
            surface: Color(0xFF0A192F),
            background: Color(0xFF0A192F),
            onPrimary: Color(0xFF0A192F),
            onSecondary: Color(0xFF0A192F),
            onSurface: Color(0xFFCCD6F6),
            onBackground: Color(0xFFCCD6F6),
          )
        : const ColorScheme.light(
            primary: Color(0xFF0A192F),
            secondary: Color(0xFF64FFDA),
            surface: Color(0xFFF8F9FA),
            background: Color(0xFFFFFFFF),
            onPrimary: Color(0xFFFFFFFF),
            onSecondary: Color(0xFF0A192F),
            onSurface: Color(0xFF0A192F),
            onBackground: Color(0xFF0A192F),
          );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: GoogleFonts.interTextTheme().apply(
        bodyColor: colorScheme.onBackground,
        displayColor: colorScheme.onBackground,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: colorScheme.onBackground,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/about',
      builder: (context, state) => const AboutScreen(),
    ),
    GoRoute(
      path: '/projects',
      builder: (context, state) => const ProjectsScreen(),
    ),
    GoRoute(
      path: '/experience',
      builder: (context, state) => const ExperienceScreen(),
    ),
    GoRoute(
      path: '/contact',
      builder: (context, state) => const ContactScreen(),
    ),
  ],
);
