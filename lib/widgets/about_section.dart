import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutSection extends StatefulWidget {
  final Map<String, String> personalInfo;

  const AboutSection({
    Key? key,
    required this.personalInfo,
  }) : super(key: key);

  @override
  State<AboutSection> createState() => _AboutSectionState();
}

class _AboutSectionState extends State<AboutSection>
    with TickerProviderStateMixin {
  late AnimationController _counterController;
  late Animation<int> _projectsAnimation;
  late Animation<int> _experienceAnimation;
  late Animation<int> _clientsAnimation;

  // Helper method for responsive font sizing
  double _getResponsiveFontSize(BuildContext context, double desktop, double tablet, double mobile) {
    if (ResponsiveBreakpoints.of(context).largerThan(TABLET)) {
      return desktop;
    } else if (ResponsiveBreakpoints.of(context).equals(TABLET)) {
      return tablet;
    } else {
      return mobile;
    }
  }

  @override
  void initState() {
    super.initState();
    
    _counterController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _projectsAnimation = IntTween(
      begin: 0,
      end: 15,
    ).animate(CurvedAnimation(
      parent: _counterController,
      curve: Curves.easeOut,
    ));
    
    _experienceAnimation = IntTween(
      begin: 0,
      end: 2,
    ).animate(CurvedAnimation(
      parent: _counterController,
      curve: Curves.easeOut,
    ));
    
    _clientsAnimation = IntTween(
      begin: 0,
      end: 8,
    ).animate(CurvedAnimation(
      parent: _counterController,
      curve: Curves.easeOut,
    ));
    
    // Start animation when widget is built
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _counterController.forward();
    });
  }

  @override
  void dispose() {
    _counterController.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = ResponsiveBreakpoints.of(context).largerThan(TABLET);
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final isTablet = ResponsiveBreakpoints.of(context).equals(TABLET);
    
    // Optimized responsive padding calculation
    final horizontalPadding = isDesktop 
        ? (screenWidth > 1440 ? 120.0 : 80.0)
        : (isMobile ? 20.0 : 40.0);
    
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: isDesktop ? 100 : (isTablet ? 80 : 60),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section title with improved animation
          _buildSectionTitle(theme),
          
          SizedBox(height: isDesktop ? 60 : (isTablet ? 50 : 40)),
          
          // Main content with optimized layout
          _buildResponsiveLayout(theme, screenWidth, isDesktop, false, isMobile),
          
          SizedBox(height: isDesktop ? 60 : (isTablet ? 50 : 40)),
          
          // Statistics with enhanced animations
          _buildStatistics(theme, isDesktop),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme) {
    return Row(
      children: [
        Text(
          '01.',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.secondary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 16),
        Text(
          'About Me',
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.colorScheme.primary.withOpacity(0.5),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.3);
  }

  Widget _buildResponsiveLayout(ThemeData theme, double screenWidth, bool isDesktop, bool isSmallDesktop, bool isMobile) {
    if (screenWidth > 1024) {
      // Large desktop layout
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: _buildTextContent(theme),
          ),
          SizedBox(width: screenWidth > 1440 ? 100 : 80),
          Expanded(
            flex: 2,
            child: _buildVisualContent(theme),
          ),
        ],
      );
    } else if (screenWidth > 768) {
      // Small desktop/tablet landscape layout
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: _buildTextContent(theme),
          ),
          const SizedBox(width: 40),
          Expanded(
            flex: 1,
            child: _buildVisualContent(theme),
          ),
        ],
      );
    } else {
      // Mobile/tablet portrait layout
      return Column(
        children: [
          _buildVisualContent(theme),
          SizedBox(height: screenWidth > 480 ? 40 : 30),
          _buildTextContent(theme),
        ],
      );
    }
  }

  Widget _buildTextContent(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Hello! I\'m Abdullah Shahid, a passionate Flutter developer based in Pakistan. I enjoy creating beautiful, functional, and user-friendly mobile applications that solve real-world problems.',
          style: theme.textTheme.bodyLarge?.copyWith(
            height: 1.8,
            color: theme.colorScheme.onBackground.withOpacity(0.8),
          ),
        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 24),
        
        Text(
          'My journey in mobile development started with a curiosity about how apps work, and it has evolved into a passion for creating seamless user experiences. I specialize in Flutter development and have experience working with various technologies and frameworks.',
          style: theme.textTheme.bodyLarge?.copyWith(
            height: 1.8,
            color: theme.colorScheme.onBackground.withOpacity(0.8),
          ),
        ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 24),
        
        Text(
          'When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.',
          style: theme.textTheme.bodyLarge?.copyWith(
            height: 1.8,
            color: theme.colorScheme.onBackground.withOpacity(0.8),
          ),
        ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 32),
        
        // Technologies I work with
        Text(
          'Here are a few technologies I\'ve been working with recently:',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: theme.colorScheme.onBackground,
          ),
        ).animate().fadeIn(delay: 900.ms),
        
        const SizedBox(height: 16),
        
        _buildTechList(theme),
        
        const SizedBox(height: 32),
        
        // Contact info
        _buildContactInfo(theme),
      ],
    );
  }

  Widget _buildTechList(ThemeData theme) {
    final technologies = [
      'Flutter & Dart',
      'Java',
      'Firebase',
      'REST APIs',
      'Git & GitHub',
      'UI/UX Design',
      'Node.js',
      'MongoDB',
    ];
    
    return Wrap(
      spacing: 14,
      runSpacing: 14,
      children: technologies.asMap().entries.map((entry) {
        final index = entry.key;
        final tech = entry.value;
        
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.colorScheme.primary.withOpacity(0.1),
                theme.colorScheme.primary.withOpacity(0.05),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(25),
            border: Border.all(
              color: theme.colorScheme.primary.withOpacity(0.3),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: theme.colorScheme.primary.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                FontAwesomeIcons.check,
                size: 12,
                color: theme.colorScheme.secondary,
              ),
              const SizedBox(width: 8),
              Text(
                tech,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onBackground,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ).animate().fadeIn(
          delay: Duration(milliseconds: 1000 + (index * 80)),
          duration: const Duration(milliseconds: 600),
        ).scale(
          begin: const Offset(0.8, 0.8),
          curve: Curves.easeOutBack,
        );
      }).toList(),
    );
  }

  Widget _buildContactInfo(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            theme.colorScheme.primary.withOpacity(0.1),
            theme.colorScheme.secondary.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Let\'s Connect!',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onBackground,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                Icons.email_outlined,
                color: theme.colorScheme.primary,
                size: 20,
              ),
              const SizedBox(width: 12),
              Text(
                widget.personalInfo['email'] ?? 'abdullahshahid1360@gmail.com',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onBackground.withOpacity(0.8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                color: theme.colorScheme.primary,
                size: 20,
              ),
              const SizedBox(width: 12),
              Text(
                widget.personalInfo['location'] ?? 'Pakistan',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onBackground.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3);
  }

  Widget _buildVisualContent(ThemeData theme) {
    return Container(
      height: 400,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            theme.colorScheme.primary.withOpacity(0.1),
            theme.colorScheme.secondary.withOpacity(0.1),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.primary.withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Profile image
            Image.asset(
              'assets/images/web_pic.png',
              width: double.infinity,
              height: double.infinity,
              fit: BoxFit.cover,
            ),
            
            // Overlay with pattern
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      theme.colorScheme.primary.withOpacity(0.1),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: 200.ms).scale(begin: const Offset(0.8, 0.8));
  }

  Widget _buildStatistics(ThemeData theme, bool isDesktop) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.primary.withOpacity(0.1),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: isDesktop ? _buildDesktopStats(theme) : _buildMobileStats(theme),
    ).animate().fadeIn(delay: 1400.ms).slideY(begin: 0.3);
  }

  Widget _buildDesktopStats(ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildStatItem('Projects Completed', _projectsAnimation, '+', theme),
        _buildStatItem('Years Experience', _experienceAnimation, '+', theme),
        _buildStatItem('Happy Clients', _clientsAnimation, '+', theme),
      ],
    );
  }

  Widget _buildMobileStats(ThemeData theme) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatItem('Projects', _projectsAnimation, '+', theme),
            ),
            Expanded(
              child: _buildStatItem('Experience', _experienceAnimation, '+', theme),
            ),
          ],
        ),
        const SizedBox(height: 24),
        _buildStatItem('Happy Clients', _clientsAnimation, '+', theme),
      ],
    );
  }

  Widget _buildStatItem(String label, Animation<int> animation, String suffix, ThemeData theme) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Column(
          children: [
            Text(
              '${animation.value}$suffix',
              style: theme.textTheme.headlineLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.colorScheme.onBackground.withOpacity(0.7),
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        );
      },
    );
  }
}