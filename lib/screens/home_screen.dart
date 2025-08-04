import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/portfolio_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/animated_background.dart';
import '../widgets/hero_section.dart';
import '../widgets/about_section.dart';
import '../widgets/skills_section.dart';
import '../widgets/projects_section.dart';
import '../widgets/experience_section.dart';
import '../widgets/contact_section.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/floating_navigation.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with TickerProviderStateMixin {
  late ScrollController _scrollController;
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  
  final GlobalKey _heroKey = GlobalKey();
  final GlobalKey _aboutKey = GlobalKey();
  final GlobalKey _skillsKey = GlobalKey();
  final GlobalKey _projectsKey = GlobalKey();
  final GlobalKey _experienceKey = GlobalKey();
  final GlobalKey _contactKey = GlobalKey();
  
  bool _showFloatingNav = false;
  int _currentSection = 0;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    ));
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutCubic,
    ));
    
    _scrollController.addListener(_onScroll);
    
    // Start animations
    _fadeController.forward();
    _slideController.forward();
  }

  void _onScroll() {
    final offset = _scrollController.offset;
    
    // Show/hide floating navigation
    if (offset > 200 && !_showFloatingNav) {
      setState(() {
        _showFloatingNav = true;
      });
    } else if (offset <= 200 && _showFloatingNav) {
      setState(() {
        _showFloatingNav = false;
      });
    }
    
    // Update current section based on scroll position
    _updateCurrentSection();
  }
  
  void _updateCurrentSection() {
    final keys = [_heroKey, _aboutKey, _skillsKey, _projectsKey, _experienceKey, _contactKey];
    
    for (int i = 0; i < keys.length; i++) {
      final context = keys[i].currentContext;
      if (context != null) {
        final box = context.findRenderObject() as RenderBox;
        final position = box.localToGlobal(Offset.zero);
        
        if (position.dy <= 100 && position.dy >= -box.size.height + 100) {
          if (_currentSection != i) {
            setState(() {
              _currentSection = i;
            });
          }
          break;
        }
      }
    }
  }
  
  void _scrollToSection(int index) {
    final keys = [_heroKey, _aboutKey, _skillsKey, _projectsKey, _experienceKey, _contactKey];
    
    if (index < keys.length) {
      final context = keys[index].currentContext;
      if (context != null) {
        Scrollable.ensureVisible(
          context,
          duration: const Duration(milliseconds: 800),
          curve: Curves.easeInOut,
        );
      }
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _fadeController.dispose();
    _slideController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final portfolioProvider = Provider.of<PortfolioProvider>(context);
    
    return Scaffold(
      body: Stack(
        children: [
          // Animated Background
          const AnimatedBackground(),
          
          // Main Content
          CustomScrollView(
            controller: _scrollController,
            slivers: [
              // Custom App Bar
              CustomAppBar(
                onThemeToggle: () => themeProvider.toggleTheme(),
                onNavigate: _scrollToSection,
                currentSection: _currentSection,
              ),
              
              // Hero Section
              SliverToBoxAdapter(
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: HeroSection(
                      key: _heroKey,
                      personalInfo: portfolioProvider.personalInfo,
                      onScrollToProjects: () => _scrollToSection(3),
                      onScrollToContact: () => _scrollToSection(5),
                    ),
                  ),
                ),
              ),
              
              // About Section
              SliverToBoxAdapter(
                child: AboutSection(
                  key: _aboutKey,
                  personalInfo: portfolioProvider.personalInfo,
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.3),
              ),
              
              // Skills Section
              SliverToBoxAdapter(
                child: SkillsSection(
                  key: _skillsKey,
                  skills: portfolioProvider.skills,
                  skillCategories: portfolioProvider.skillCategories,
                  getSkillsByCategory: portfolioProvider.getSkillsByCategory,
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.3),
              ),
              
              // Projects Section
              SliverToBoxAdapter(
                child: ProjectsSection(
                  key: _projectsKey,
                  projects: portfolioProvider.projects,
                  featuredProjects: portfolioProvider.featuredProjects,
                ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.3),
              ),
              
              // Experience Section
              SliverToBoxAdapter(
                child: ExperienceSection(
                  key: _experienceKey,
                  experiences: portfolioProvider.experiences,
                ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3),
              ),
              
              // Contact Section
              SliverToBoxAdapter(
                child: ContactSection(
                  key: _contactKey,
                ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3),
              ),
            ],
          ),
          
          // Floating Navigation - responsive positioning
          if (_showFloatingNav)
            Positioned(
              right: MediaQuery.of(context).size.width > 768 ? 20 : 10,
              top: MediaQuery.of(context).size.height * 0.4,
              child: FloatingNavigation(
                scrollController: _scrollController,
                sectionKeys: [_heroKey, _aboutKey, _skillsKey, _projectsKey, _experienceKey, _contactKey],
                onThemeToggle: () => themeProvider.toggleTheme(),
                isDarkMode: themeProvider.isDarkMode,
              ).animate().fadeIn().scale(),
            ),
        ],
      ),
    );
  }
}