import 'package:flutter/material.dart' as flutter;
import 'package:flutter/material.dart' hide RadialGradient;
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:rive/rive.dart' hide LinearGradient;
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:simple_animations/simple_animations.dart';
import 'package:flutter_glow/flutter_glow.dart';
import 'package:shimmer/shimmer.dart';
import 'package:confetti/confetti.dart';
import 'package:neon/neon.dart';

import 'package:spring/spring.dart';
import 'package:wave/wave.dart';
import 'package:wave/config.dart';
import 'package:flutter_bounceable/flutter_bounceable.dart';

import 'dart:math' as math;
import '../utils/mobile_animation_optimizer.dart';

class HeroSection extends flutter.StatefulWidget {
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
  flutter.State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends flutter.State<HeroSection>
    with flutter.TickerProviderStateMixin {
  late flutter.AnimationController _floatingController;
  late flutter.AnimationController _pulseController;
  late flutter.AnimationController _glowController;
  late flutter.AnimationController _particleController;
  late flutter.AnimationController _waveController;
  late ConfettiController _confettiController;
  late flutter.Animation<double> _floatingAnimation;
  late flutter.Animation<double> _pulseAnimation;
  late flutter.Animation<double> _glowAnimation;
  late flutter.Animation<double> _particleAnimation;
  late flutter.Animation<double> _waveAnimation;
  RiveAnimationController? _riveController;
  bool _isHovered = false;
  bool _isNameHovered = false;
  bool _isButtonHovered = false;

  @override
  void initState() {
    super.initState();
    
    // Initialize controllers after first frame to access context
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeAnimationControllers();
    });
  }
  
  void _initializeAnimationControllers() {
    // Synchronized animation controllers with mobile optimization
    _floatingController = MobileAnimationOptimizer.createOptimizedController(
      vsync: this,
      duration: const Duration(seconds: 6),
      context: context,
    );
    
    _pulseController = MobileAnimationOptimizer.createOptimizedController(
      vsync: this,
      duration: const Duration(seconds: 4),
      context: context,
    );
    
    _glowController = MobileAnimationOptimizer.createOptimizedController(
      vsync: this,
      duration: const Duration(seconds: 8),
      context: context,
    );
    
    _particleController = MobileAnimationOptimizer.createOptimizedController(
      vsync: this,
      duration: const Duration(seconds: 10),
      context: context,
    );
    
    _waveController = MobileAnimationOptimizer.createOptimizedController(
      vsync: this,
      duration: const Duration(seconds: 3),
      context: context,
    );
    
    // Start animations with mobile optimization
    if (!MobileAnimationOptimizer.shouldDisableComplexAnimations(context)) {
      _floatingController.repeatOptimized(context, reverse: true);
      _pulseController.repeatOptimized(context, reverse: true);
      _glowController.repeatOptimized(context, reverse: true);
      _particleController.repeatOptimized(context);
      _waveController.repeatOptimized(context);
    }
    
    _confettiController = ConfettiController(
      duration: const Duration(seconds: 2),
    );
    
    _floatingAnimation = flutter.Tween<double>(
      begin: -8,
      end: 8,
    ).animate(flutter.CurvedAnimation(
      parent: _floatingController,
      curve: MobileAnimationOptimizer.getOptimizedCurve(context, flutter.Curves.easeInOutSine),
    ));
    
    _pulseAnimation = flutter.Tween<double>(
      begin: 1.0,
      end: 1.05,
    ).animate(flutter.CurvedAnimation(
      parent: _pulseController,
      curve: MobileAnimationOptimizer.getOptimizedCurve(context, flutter.Curves.easeInOutCubic),
    ));
    
    _glowAnimation = flutter.Tween<double>(
      begin: 0.2,
      end: 1.0,
    ).animate(flutter.CurvedAnimation(
      parent: _glowController,
      curve: MobileAnimationOptimizer.getOptimizedCurve(context, flutter.Curves.easeInOutSine),
    ));
    
    _particleAnimation = flutter.Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(flutter.CurvedAnimation(
      parent: _particleController,
      curve: flutter.Curves.linear,
    ));
    
    _waveAnimation = flutter.Tween<double>(
      begin: 0.0,
      end: 2 * math.pi,
    ).animate(flutter.CurvedAnimation(
      parent: _waveController,
      curve: flutter.Curves.linear,
    ));
    
    _riveController = SimpleAnimation('idle');
  }

  @override
  void dispose() {
    _floatingController.dispose();
    _pulseController.dispose();
    _glowController.dispose();
    _particleController.dispose();
    _waveController.dispose();
    _confettiController.dispose();
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
  flutter.Widget build(flutter.BuildContext context) {
    final theme = flutter.Theme.of(context);
    final screenWidth = flutter.MediaQuery.of(context).size.width;
    final screenHeight = flutter.MediaQuery.of(context).size.height;
    final isDesktop = ResponsiveBreakpoints.of(context).largerThan(TABLET);
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final isTablet = ResponsiveBreakpoints.of(context).equals(TABLET);
    
    // Responsive padding calculation
    final horizontalPadding = isDesktop 
        ? (screenWidth > 1440 ? 120.0 : 80.0)
        : (isMobile ? 20.0 : 40.0);
    
    return flutter.Container(
      width: double.infinity,
      constraints: flutter.BoxConstraints(
        minHeight: isMobile ? screenHeight * 0.8 : screenHeight,
      ),
      child: flutter.Stack(
        children: [
          // Animated wave background
          AnimatedBuilder(
            animation: _waveAnimation,
            builder: (context, child) {
              return WaveWidget(
                config: CustomConfig(
                  gradients: theme.brightness == Brightness.dark
                      ? [
                          [const Color(0xFF0A192F), const Color(0xFF112240)],
                          [const Color(0xFF112240), const Color(0xFF1A2332)],
                          [const Color(0xFF1A2332), const Color(0xFF0A192F)],
                        ]
                      : [
                          [const Color(0xFFFFFFFF), const Color(0xFFF8F9FA)],
                          [const Color(0xFFF8F9FA), const Color(0xFFE9ECEF)],
                          [const Color(0xFFE9ECEF), const Color(0xFFFFFFFF)],
                        ],
                  durations: [35000, 19440, 10800],
                  heightPercentages: [0.20, 0.23, 0.25],
                  gradientBegin: Alignment.bottomLeft,
                  gradientEnd: Alignment.topRight,
                ),
                waveAmplitude: 0,
                size: Size(screenWidth, screenHeight),
              );
            },
          ),
          // Particle overlay with mobile optimization
          if (!MobileAnimationOptimizer.shouldDisableComplexAnimations(context))
            AnimatedBuilder(
              animation: _particleAnimation,
              builder: (context, child) {
                return CustomPaint(
                  painter: ParticlesPainter(
                    animation: _particleAnimation.value,
                    isDark: theme.brightness == Brightness.dark,
                    particleCount: MobileAnimationOptimizer.getOptimizedParticleCount(context, 50),
                  ),
                  size: Size(screenWidth, screenHeight),
                );
              },
            ),
          // Gradient overlay
          flutter.Container(
            decoration: flutter.BoxDecoration(
              gradient: flutter.LinearGradient(
                begin: flutter.Alignment.topLeft,
                end: flutter.Alignment.bottomRight,
                colors: theme.brightness == Brightness.dark
                    ? [
                        const Color(0xFF0A192F).withOpacity(0.8),
                        const Color(0xFF112240).withOpacity(0.6),
                        const Color(0xFF1A2332).withOpacity(0.4),
                      ]
                    : [
                        const Color(0xFFFFFFFF).withOpacity(0.8),
                        const Color(0xFFF8F9FA).withOpacity(0.6),
                        const Color(0xFFE9ECEF).withOpacity(0.4),
                      ],
              ),
            ),
          ),
           // Confetti overlay with mobile optimization
           if (!MobileAnimationOptimizer.shouldDisableComplexAnimations(context))
             Align(
               alignment: Alignment.topCenter,
               child: ConfettiWidget(
                 confettiController: _confettiController,
                 blastDirection: math.pi / 2,
                 maxBlastForce: ResponsiveBreakpoints.of(context).equals(MOBILE) ? 3 : 5,
                 minBlastForce: ResponsiveBreakpoints.of(context).equals(MOBILE) ? 1 : 2,
                 emissionFrequency: ResponsiveBreakpoints.of(context).equals(MOBILE) ? 0.02 : 0.05,
                 numberOfParticles: MobileAnimationOptimizer.getOptimizedParticleCount(context, 50),
                 gravity: 0.05,
               ),
             ),
           // Main content
           flutter.Padding(
             padding: flutter.EdgeInsets.symmetric(
               horizontal: horizontalPadding,
               vertical: isDesktop ? 60 : (isTablet ? 50 : 40),
             ),
             child: isDesktop ? _buildDesktopLayout(theme) : _buildMobileLayout(theme),
           ),
         ],
       ),
     );
  }

  flutter.Widget _buildDesktopLayout(flutter.ThemeData theme) {
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

  flutter.Widget _buildMobileLayout(flutter.ThemeData theme) {
    final screenHeight = MediaQuery.of(context).size.height;
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: isMobile ? 20 : 40),
          // Optimized animation for mobile
          SizedBox(
            height: isMobile ? 200 : 250,
            child: _buildOptimizedRiveAnimation(),
          ),
          SizedBox(height: isMobile ? 24 : 32),
          // Text content
          _buildTextContent(theme),
          SizedBox(height: isMobile ? 20 : 40),
        ],
      ),
    );
  }

  flutter.Widget _buildTextContent(flutter.ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Greeting text with mobile-optimized animation
        _buildOptimizedGreeting(theme),
        
        const SizedBox(height: 8),
        
        // Main name with mobile-optimized animations
        _buildOptimizedNameSection(theme),
        
        const SizedBox(height: 16),
        
        // Role with enhanced gradient typing animation
        SizedBox(
          height: 80,
          child: AnimatedBuilder(
            animation: _glowAnimation,
            builder: (context, child) {
              return AnimatedTextKit(
                animatedTexts: [
                  TypewriterAnimatedText(
                    'Flutter Developer',
                    textStyle: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                      color: const Color(0xFF64FFDA),
                      shadows: [
                        Shadow(
                          color: const Color(0xFF64FFDA).withOpacity(_glowAnimation.value * 0.6),
                          blurRadius: _glowAnimation.value * 8,
                        ),
                      ],
                    ),
                    speed: const Duration(milliseconds: 80),
                  ),
                  TypewriterAnimatedText(
                    'Mobile App Developer',
                    textStyle: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                      color: const Color(0xFF64B5F6),
                      shadows: [
                        Shadow(
                          color: const Color(0xFF64B5F6).withOpacity(_glowAnimation.value * 0.6),
                          blurRadius: _glowAnimation.value * 8,
                        ),
                      ],
                    ),
                    speed: const Duration(milliseconds: 80),
                  ),
                  TypewriterAnimatedText(
                    'UI/UX Enthusiast',
                    textStyle: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                      color: const Color(0xFF42A5F5),
                      shadows: [
                        Shadow(
                          color: const Color(0xFF42A5F5).withOpacity(_glowAnimation.value * 0.6),
                          blurRadius: _glowAnimation.value * 8,
                        ),
                      ],
                    ),
                    speed: const Duration(milliseconds: 80),
                  ),
                  TypewriterAnimatedText(
                    'Cross-Platform Expert',
                    textStyle: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      fontSize: _getResponsiveFontSize(context, 32, 28, 24),
                      color: const Color(0xFF2196F3),
                      shadows: [
                        Shadow(
                          color: const Color(0xFF2196F3).withOpacity(_glowAnimation.value * 0.6),
                          blurRadius: _glowAnimation.value * 8,
                        ),
                      ],
                    ),
                    speed: const Duration(milliseconds: 80),
                  ),
                ],
                totalRepeatCount: 4,
                pause: const Duration(milliseconds: 2000),
                displayFullTextOnTap: true,
                stopPauseOnTap: true,
              ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3).then().shimmer(duration: 1500.ms);
            },
          ),
        ),
        
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
        
        // Mobile-optimized action buttons
        _buildOptimizedActionButtons(theme),
        
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

  flutter.Widget _buildRiveAnimation() {
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

  flutter.Widget _buildOptimizedRiveAnimation() {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    if (isMobile) {
      // Simplified animation for mobile performance
      return Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [
              const Color(0xFF64B5F6).withOpacity(0.3),
              const Color(0xFF2196F3).withOpacity(0.1),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Icon(
          Icons.code,
          size: 80,
          color: const Color(0xFF64FFDA),
        ),
      );
    }
    
    return _buildRiveAnimation();
  }

  flutter.Widget _buildOptimizedGreeting(flutter.ThemeData theme) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    if (isMobile) {
      // Simplified greeting for mobile
      return Text(
        'Hi, I\'m',
        style: theme.textTheme.headlineSmall?.copyWith(
          color: theme.colorScheme.secondary,
          fontWeight: FontWeight.w500,
          fontSize: 18,
        ),
      ).animate().fadeIn(delay: 100.ms);
    }
    
    // Desktop version with full animations
    return AnimatedBuilder(
      animation: _floatingAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatingAnimation.value),
          child: MouseRegion(
            onEnter: (_) => setState(() => _isHovered = true),
            onExit: (_) => setState(() => _isHovered = false),
            child: AnimatedBuilder(
              animation: _glowAnimation,
              builder: (context, child) {
                return GlowText(
                  'Hi, I\'m',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    color: theme.colorScheme.secondary,
                    fontWeight: FontWeight.w500,
                  ),
                  glowColor: _isHovered ? Colors.cyanAccent.withOpacity(0.6) : Colors.white24,
                  blurRadius: _glowAnimation.value * 5,
                );
              },
            ),
          ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.3),
        );
      },
    );
  }

  flutter.Widget _buildOptimizedNameSection(flutter.ThemeData theme) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    if (isMobile) {
      // Simplified name section for mobile
      return GestureDetector(
        onTap: () {
          _confettiController.play();
          setState(() => _isNameHovered = !_isNameHovered);
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFF64FFDA).withOpacity(0.5),
              width: 1,
            ),
          ),
          child: Text(
            widget.personalInfo['name'] ?? 'Abdullah Shahid',
            style: theme.textTheme.headlineMedium?.copyWith(
              color: const Color(0xFF64FFDA),
              fontWeight: FontWeight.bold,
              fontSize: _getResponsiveFontSize(context, 32, 28, 24),
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ).animate().fadeIn(delay: 300.ms);
    }
    
    // Desktop version with full animations
    return Bounceable(
      onTap: () {
        _confettiController.play();
        setState(() => _isNameHovered = !_isNameHovered);
      },
      child: AnimatedBuilder(
        animation: _pulseAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _pulseAnimation.value,
            child: MouseRegion(
              onEnter: (_) {
                setState(() => _isNameHovered = true);
                _confettiController.play();
              },
              onExit: (_) => setState(() => _isNameHovered = false),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF64FFDA).withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: AnimatedBuilder(
                  animation: _glowAnimation,
                  builder: (context, child) {
                    return Neon(
                      text: widget.personalInfo['name'] ?? 'Abdullah Shahid',
                      color: _isNameHovered ? flutter.Colors.green : flutter.Colors.blue,
                      font: NeonFont.Beon,
                      flickeringText: _isNameHovered,
                      flickeringLetters: _isNameHovered ? [0, 1, 2] : [],
                      glowing: true,
                      blurRadius: _glowAnimation.value * 15,
                      textStyle: TextStyle(
                        fontSize: _getResponsiveFontSize(context, 48, 40, 32),
                        fontWeight: FontWeight.bold,
                      ),
                    );
                  },
                ),
              ),
            ),
          ).animate().fadeIn(delay: 300.ms).slideX(begin: -0.3).then().shimmer(duration: 2000.ms);
        },
      ),
    );
  }

  flutter.Widget _buildOptimizedActionButtons(flutter.ThemeData theme) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    if (isMobile) {
      // Mobile-optimized buttons with better touch targets
      return Column(
        children: [
          // Primary button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: widget.onScrollToProjects,
              icon: const Icon(Icons.work_outline, color: Colors.white),
              label: const Text(
                'View My Work',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2196F3),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 4,
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Secondary button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: OutlinedButton.icon(
              onPressed: widget.onScrollToContact,
              icon: const Icon(
                Icons.email_outlined,
                color: Color(0xFF64FFDA),
              ),
              label: const Text(
                'Get In Touch',
                style: TextStyle(
                  color: Color(0xFF64FFDA),
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(
                  color: Color(0xFF64FFDA),
                  width: 2,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ).animate().fadeIn(delay: 600.ms);
    }
    
    // Desktop version with full animations
    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: [
        // Primary button with spring animation
        GestureDetector(
          onTap: widget.onScrollToProjects,
          child: AnimatedBuilder(
            animation: _glowAnimation,
            builder: (context, child) {
              return MouseRegion(
                onEnter: (_) {
                  setState(() => _isButtonHovered = true);
                  _confettiController.play();
                },
                onExit: (_) => setState(() => _isButtonHovered = false),
                child: Bounceable(
                  onTap: widget.onScrollToProjects,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      gradient: LinearGradient(
                        colors: _isButtonHovered
                            ? [const Color(0xFF64FFDA), const Color(0xFF2196F3)]
                            : [const Color(0xFF2196F3), const Color(0xFF1976D2)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: (_isButtonHovered ? const Color(0xFF64FFDA) : const Color(0xFF2196F3))
                              .withOpacity(_glowAnimation.value * 0.6),
                          blurRadius: _glowAnimation.value * 20,
                          spreadRadius: _glowAnimation.value * 2,
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: widget.onScrollToProjects,
                      icon: Icon(
                        Icons.work_outline,
                        color: _isButtonHovered ? Colors.black : Colors.white,
                      ),
                      label: Text(
                        'View My Work',
                        style: TextStyle(
                          color: _isButtonHovered ? Colors.black : Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        // Secondary button with neon outline
        GestureDetector(
          onTap: widget.onScrollToContact,
          child: AnimatedBuilder(
            animation: _glowAnimation,
            builder: (context, child) {
              return MouseRegion(
                onEnter: (_) => setState(() => _isHovered = true),
                onExit: (_) => setState(() => _isHovered = false),
                child: Bounceable(
                  onTap: widget.onScrollToContact,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: _isHovered ? const Color(0xFF64FFDA) : const Color(0xFF64B5F6),
                        width: 2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: (_isHovered ? const Color(0xFF64FFDA) : const Color(0xFF64B5F6))
                              .withOpacity(_glowAnimation.value * 0.4),
                          blurRadius: _glowAnimation.value * 15,
                          spreadRadius: _glowAnimation.value * 1,
                        ),
                      ],
                    ),
                    child: OutlinedButton.icon(
                      onPressed: widget.onScrollToContact,
                      icon: Icon(
                        Icons.email_outlined,
                        color: _isHovered ? const Color(0xFF64FFDA) : Colors.white,
                      ),
                      label: Text(
                        'Get In Touch',
                        style: TextStyle(
                          color: _isHovered ? const Color(0xFF64FFDA) : Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        side: BorderSide.none,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.5).then().shimmer(duration: 2000.ms);
  }

  flutter.Widget _buildSocialButton(flutter.IconData icon, String url, flutter.ThemeData theme) {
    return Bounceable(
      onTap: () => _launchUrl(url),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.primary.withOpacity(0.2),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Icon(
          icon,
          color: theme.colorScheme.primary,
          size: 20,
        ),
      ).animate().scale(delay: (1200 + (icon.hashCode % 300)).ms),
    );
  }
}

// Custom painter for particle effects
class ParticlesPainter extends flutter.CustomPainter {
  final double animation;
  final bool isDark;
  final int particleCount;
  
  ParticlesPainter({
    required this.animation,
    required this.isDark,
    required this.particleCount,
  });
  
  @override
  void paint(flutter.Canvas canvas, flutter.Size size) {
    final paint = flutter.Paint()
      ..style = flutter.PaintingStyle.fill;
    
    // Generate particles
    final random = math.Random(42); // Fixed seed for consistent animation
    
    for (int i = 0; i < particleCount; i++) {
      final x = random.nextDouble() * size.width;
      final y = random.nextDouble() * size.height;
      final radius = random.nextDouble() * 3 + 1;
      
      // Animate particle position
      final animatedX = x + math.sin(animation * 2 * math.pi + i) * 20;
      final animatedY = y + math.cos(animation * 2 * math.pi + i * 0.5) * 15;
      
      // Particle color with opacity animation
      final opacity = (math.sin(animation * 2 * math.pi + i * 0.3) + 1) * 0.3;
      
      paint.color = isDark
          ? const Color(0xFF64FFDA).withOpacity(opacity)
          : const Color(0xFF2196F3).withOpacity(opacity);
      
      canvas.drawCircle(
        flutter.Offset(animatedX % size.width, animatedY % size.height),
        radius,
        paint,
      );
    }
    
    // Add some larger glowing particles
    for (int i = 0; i < 10; i++) {
      final x = random.nextDouble() * size.width;
      final y = random.nextDouble() * size.height;
      final radius = random.nextDouble() * 8 + 4;
      
      final animatedX = x + math.sin(animation * math.pi + i * 0.7) * 30;
      final animatedY = y + math.cos(animation * math.pi + i * 0.4) * 25;
      
      final opacity = (math.sin(animation * math.pi + i * 0.5) + 1) * 0.15;
      
      // Create gradient effect
      final gradient = flutter.RadialGradient(
        colors: [
          (isDark ? const flutter.Color(0xFF64FFDA) : const flutter.Color(0xFF2196F3))
              .withOpacity(opacity),
          (isDark ? const flutter.Color(0xFF64FFDA) : const flutter.Color(0xFF2196F3))
              .withOpacity(0),
        ],
      );
      
      paint.shader = gradient.createShader(
        flutter.Rect.fromCircle(
          center: flutter.Offset(animatedX % size.width, animatedY % size.height),
          radius: radius,
        ),
      );
      
      canvas.drawCircle(
        flutter.Offset(animatedX % size.width, animatedY % size.height),
        radius,
        paint,
      );
    }
  }
  
  @override
  bool shouldRepaint(covariant flutter.CustomPainter oldDelegate) => true;
}