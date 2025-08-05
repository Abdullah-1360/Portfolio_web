import 'package:flutter/material.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:rive/rive.dart' hide LinearGradient;
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:responsive_framework/responsive_framework.dart';

class HeroSection extends StatefulWidget {
  final Map<String, String> personalInfo;
  final VoidCallback onScrollToProjects;
  final VoidCallback onScrollToContact;

  const HeroSection({
    Key? key,
    required this.personalInfo,
    required this.onScrollToProjects,
    required this.onScrollToContact,
  }) : super(key: key);

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection>
    with TickerProviderStateMixin {
  late AnimationController _floatingController;
  late AnimationController _pulseController;
  late Animation<double> _floatingAnimation;
  late Animation<double> _pulseAnimation;
  RiveAnimationController? _riveController;

  @override
  void initState() {
    super.initState();
    
    // Optimized animation controllers with better performance
    _floatingController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat(reverse: true);
    
    _pulseController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
    
    _floatingAnimation = Tween<double>(
      begin: -8,
      end: 8,
    ).animate(CurvedAnimation(
      parent: _floatingController,
      curve: Curves.easeInOutSine,
    ));
    
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.05,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOutSine,
    ));
    
    _riveController = SimpleAnimation('idle');
  }

  @override
  void dispose() {
    _floatingController.dispose();
    _pulseController.dispose();
    _riveController?.dispose();
    super.dispose();
  }

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
    final screenHeight = MediaQuery.of(context).size.height;
    final isDesktop = ResponsiveBreakpoints.of(context).largerThan(TABLET);
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final isTablet = ResponsiveBreakpoints.of(context).equals(TABLET);
    
    // Responsive padding calculation
    final horizontalPadding = isDesktop 
        ? (screenWidth > 1440 ? 120.0 : 80.0)
        : (isMobile ? 20.0 : 40.0);
    
    return Container(
      height: screenHeight,
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: isDesktop ? 60 : (isTablet ? 50 : 40),
      ),
      child: isDesktop ? _buildDesktopLayout(theme) : _buildMobileLayout(theme),
    );
  }

  Widget _buildDesktopLayout(ThemeData theme) {
    return Row(
      children: [
        // Left side - Text content
        Expanded(
          flex: 3,
          child: _buildTextContent(theme),
        ),
        const SizedBox(width: 80),
        // Right side - 3D Animation
        Expanded(
          flex: 2,
          child: _buildRiveAnimation(),
        ),
      ],
    );
  }

  Widget _buildMobileLayout(ThemeData theme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // 3D Animation
        SizedBox(
          height: 300,
          child: _buildRiveAnimation(),
        ),
        const SizedBox(height: 40),
        // Text content
        _buildTextContent(theme),
      ],
    );
  }

  Widget _buildTextContent(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Greeting
        Text(
          'Hi, I\'m',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.secondary,
            fontWeight: FontWeight.w500,
          ),
        ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.3),
        
        const SizedBox(height: 8),
        
        // Name with optimized animated text
        AnimatedTextKit(
          animatedTexts: [
            TypewriterAnimatedText(
              widget.personalInfo['name'] ?? 'Abdullah Shahid',
              textStyle: theme.textTheme.displayLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.onBackground,
                fontSize: _getResponsiveFontSize(context, 48, 36, 32),
                height: 1.2,
              ),
              speed: const Duration(milliseconds: 80),
            ),
          ],
          totalRepeatCount: 1,
          displayFullTextOnTap: true,
          stopPauseOnTap: true,
        ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.2, curve: Curves.easeOutCubic),
        
        const SizedBox(height: 16),
        
        // Title with optimized animated text
        AnimatedTextKit(
          animatedTexts: [
            FadeAnimatedText(
              widget.personalInfo['title'] ?? 'Flutter Developer',
              textStyle: theme.textTheme.headlineMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w600,
                fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                height: 1.3,
              ),
              duration: const Duration(milliseconds: 2500),
            ),
            FadeAnimatedText(
              'Mobile App Developer',
              textStyle: theme.textTheme.headlineMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w600,
                fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                height: 1.3,
              ),
              duration: const Duration(milliseconds: 2500),
            ),
            FadeAnimatedText(
              'UI/UX Enthusiast',
              textStyle: theme.textTheme.headlineMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w600,
                fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                height: 1.3,
              ),
              duration: const Duration(milliseconds: 2500),
            ),
          ],
          repeatForever: true,
          pause: const Duration(milliseconds: 1000),
        ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.2, curve: Curves.easeOutCubic),
        
        const SizedBox(height: 24),
        
        // Bio
        Container(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Text(
            widget.personalInfo['bio'] ?? 'Passionate Flutter developer with expertise in mobile app development.',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onBackground.withOpacity(0.8),
              height: 1.6,
            ),
          ),
        ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.3),
        
        const SizedBox(height: 40),
        
        // Action buttons
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: ElevatedButton.icon(
                    onPressed: widget.onScrollToProjects,
                    icon: const Icon(Icons.work_outline),
                    label: const Text('View My Work'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                );
              },
            ),
            OutlinedButton.icon(
              onPressed: widget.onScrollToContact,
              icon: const Icon(Icons.email_outlined),
              label: const Text('Get In Touch'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 16,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                side: BorderSide(color: theme.colorScheme.primary),
              ),
            ),
          ],
        ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.5),
        
        const SizedBox(height: 40),
        
        // Social links
        Row(
          children: [
            _buildSocialButton(
              FontAwesomeIcons.github,
              widget.personalInfo['github'] ?? '',
              theme,
            ),
            const SizedBox(width: 16),
            _buildSocialButton(
              FontAwesomeIcons.linkedin,
              widget.personalInfo['linkedin'] ?? '',
              theme,
            ),
            const SizedBox(width: 16),
            _buildSocialButton(
              FontAwesomeIcons.envelope,
              'mailto:${widget.personalInfo['email'] ?? ''}',
              theme,
            ),
          ],
        ).animate().fadeIn(delay: 1100.ms).slideX(begin: -0.3),
      ],
    );
  }

  Widget _buildRiveAnimation() {
    return AnimatedBuilder(
      animation: _floatingAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatingAnimation.value),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                  blurRadius: 30,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Container(
                width: double.infinity,
                height: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(context).colorScheme.primary.withOpacity(0.1),
                      Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                    ],
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Icons.code,
                    size: 120,
                    color: Colors.grey,
                  ),
                ),
                // TODO: Replace with actual Rive animation
                // child: RiveAnimation.asset(
                //   'assets/rive/developer_animation.riv',
                //   controllers: [_riveController!],
                //   fit: BoxFit.cover,
                // ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSocialButton(IconData icon, String url, ThemeData theme) {
    return InkWell(
      onTap: () => _launchUrl(url),
      borderRadius: BorderRadius.circular(25),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
        ),
        child: Icon(
          icon,
          color: theme.colorScheme.primary,
          size: 20,
        ),
      ),
    );
  }
}