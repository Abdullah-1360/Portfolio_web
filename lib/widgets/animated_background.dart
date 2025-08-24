import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import 'package:simple_animations/simple_animations.dart';
import 'package:flutter_glow/flutter_glow.dart';
import 'package:wave/wave.dart';
import 'package:wave/config.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shimmer/shimmer.dart';
import '../providers/theme_provider.dart';

class AnimatedBackground extends StatefulWidget {
  const AnimatedBackground({Key? key}) : super(key: key);

  @override
  State<AnimatedBackground> createState() => _AnimatedBackgroundState();
}

class _AnimatedBackgroundState extends State<AnimatedBackground>
    with TickerProviderStateMixin {
  late AnimationController _controller1;
  late AnimationController _controller2;
  late AnimationController _controller3;
  late AnimationController _glowController;
  late AnimationController _morphController;
  late AnimationController _waveController;
  late AnimationController _particleFieldController;
  late Animation<double> _animation1;
  late Animation<double> _animation2;
  late Animation<double> _animation3;
  late Animation<double> _glowAnimation;
  late Animation<double> _morphAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _particleFieldAnimation;
  
  final List<Particle> _particles = [];
  final List<FloatingOrb> _orbs = [];
  final List<MorphableParticle> _morphableParticles = [];
  final int _particleCount = 50;
  final int _orbCount = 8;
  final int _morphableParticleCount = 15;
  
  late List<Color> _waveColors;
  late List<int> _waveDurations;
  late List<double> _waveHeights;

  @override
  void initState() {
    super.initState();
    
    _controller1 = AnimationController(
      duration: const Duration(seconds: 30),
      vsync: this,
    )..repeat();
    
    _controller2 = AnimationController(
      duration: const Duration(seconds: 24),
      vsync: this,
    )..repeat();
    
    _controller3 = AnimationController(
      duration: const Duration(seconds: 36),
      vsync: this,
    )..repeat();
    
    _glowController = AnimationController(
      duration: const Duration(seconds: 12),
      vsync: this,
    )..repeat(reverse: true);
    
    _morphController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();
    
    _waveController = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat();
    
    _particleFieldController = AnimationController(
      duration: const Duration(seconds: 15),
      vsync: this,
    )..repeat();
    
    _animation1 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(CurvedAnimation(
      parent: _controller1,
      curve: Curves.easeInOutSine,
    ));
    
    _animation2 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(CurvedAnimation(
      parent: _controller2,
      curve: Curves.easeInOutCubic,
    ));
    
    _animation3 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(CurvedAnimation(
      parent: _controller3,
      curve: Curves.elasticInOut,
    ));
    
    _glowAnimation = Tween<double>(
      begin: 0.4,
      end: 0.8,
    ).animate(CurvedAnimation(
      parent: _glowController,
      curve: Curves.easeInOutCubic,
    ));
    
    _morphAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _morphController,
      curve: Curves.easeInOutQuart,
    ));
    
    _waveAnimation = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(CurvedAnimation(
      parent: _waveController,
      curve: Curves.linear,
    ));
    
    _particleFieldAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _particleFieldController,
      curve: Curves.easeInOutSine,
    ));
    
    _initializeParticles();
    _initializeOrbs();
    _initializeMorphableParticles();
    _initializeWaveConfig();
  }
  
  void _initializeParticles() {
    final random = math.Random();
    for (int i = 0; i < _particleCount; i++) {
      _particles.add(Particle(
        x: random.nextDouble(),
        y: random.nextDouble(),
        size: random.nextDouble() * 4 + 1,
        speed: random.nextDouble() * 0.5 + 0.1,
        opacity: random.nextDouble() * 0.6 + 0.2,
        angle: random.nextDouble() * 2 * math.pi,
        rotationSpeed: (random.nextDouble() - 0.5) * 0.02,
      ));
    }
  }
  
  void _initializeOrbs() {
    final random = math.Random();
    for (int i = 0; i < _orbCount; i++) {
      _orbs.add(FloatingOrb(
        x: random.nextDouble(),
        y: random.nextDouble(),
        size: random.nextDouble() * 60 + 40,
        speed: random.nextDouble() * 0.3 + 0.1,
        opacity: random.nextDouble() * 0.4 + 0.1,
        hue: random.nextDouble() * 360,
        pulsePhase: random.nextDouble() * 2 * math.pi,
      ));
    }
  }
  
  void _initializeMorphableParticles() {
    final random = math.Random();
    for (int i = 0; i < _morphableParticleCount; i++) {
      _morphableParticles.add(MorphableParticle(
        x: random.nextDouble(),
        y: random.nextDouble(),
        size: random.nextDouble() * 30 + 20,
        speed: random.nextDouble() * 0.2 + 0.05,
        opacity: random.nextDouble() * 0.3 + 0.1,
        morphPhase: random.nextDouble() * 2 * math.pi,
        color: HSVColor.fromAHSV(
          1.0,
          random.nextDouble() * 360,
          0.7,
          0.9,
        ).toColor(),
      ));
    }
  }
  
  void _initializeWaveConfig() {
    _waveColors = [
      const Color(0xFF64FFDA).withOpacity(0.1),
      const Color(0xFF0A192F).withOpacity(0.05),
    ];
    _waveDurations = [5000, 4000];
    _waveHeights = [0.20, 0.25];
  }

  @override
  void dispose() {
    _controller1.dispose();
    _controller2.dispose();
    _controller3.dispose();
    _glowController.dispose();
    _morphController.dispose();
    _waveController.dispose();
    _particleFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;
    
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [
                  const Color(0xFF0A192F),
                  const Color(0xFF112240),
                  const Color(0xFF1A2332),
                ]
              : [
                  const Color(0xFFFFFFFF),
                  const Color(0xFFF8F9FA),
                  const Color(0xFFE9ECEF),
                ],
        ),
      ),
      child: Stack(
        children: [
          // Animated wave background
          AnimatedBuilder(
            animation: _waveController,
            builder: (context, child) {
              return WaveWidget(
                config: CustomConfig(
                  colors: _waveColors,
                  durations: _waveDurations,
                  heightPercentages: _waveHeights,
                ),
                backgroundColor: Colors.transparent,
                size: Size(double.infinity, double.infinity),
                waveAmplitude: 0,
              );
            },
          ),
          
          // Enhanced particle field with shimmer effect
          AnimatedBuilder(
            animation: _particleFieldController,
            builder: (context, child) {
              return Shimmer.fromColors(
                baseColor: isDark ? Colors.grey[800]! : Colors.grey[300]!,
                highlightColor: isDark ? Colors.grey[700]! : Colors.grey[100]!,
                period: Duration(milliseconds: 2000),
                child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.transparent,
                        (isDark ? const Color(0xFF64FFDA) : const Color(0xFF0A192F))
                            .withOpacity(0.05),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
          
          // Morphable shapes layer
          AnimatedBuilder(
            animation: _morphController,
            builder: (context, child) {
              return CustomPaint(
                painter: MorphableShapesPainter(
                  particles: _morphableParticles,
                  animationValue: _morphAnimation.value,
                  isDark: isDark,
                ),
                size: Size.infinite,
              );
            },
          ),
          
          // Geometric shapes
          AnimatedBuilder(
            animation: _animation1,
            builder: (context, child) {
              return CustomPaint(
                painter: GeometricShapesPainter(
                  animation1: _animation1.value,
                  animation2: _animation2.value,
                  animation3: _animation3.value,
                  isDark: isDark,
                ),
                size: Size.infinite,
              );
            },
          ),
          
          // Floating orbs with glow effect
          AnimatedBuilder(
            animation: Listenable.merge([_controller2, _glowController]),
            builder: (context, child) {
              return CustomPaint(
                painter: FloatingOrbsPainter(
                  orbs: _orbs,
                  animationValue: _controller2.value,
                  glowIntensity: _glowAnimation.value,
                  isDark: isDark,
                ),
                size: Size.infinite,
              );
            },
          ),
          
          // Enhanced floating particles
          AnimatedBuilder(
            animation: _controller1,
            builder: (context, child) {
              return CustomPaint(
                painter: EnhancedParticlesPainter(
                  particles: _particles,
                  animationValue: _controller1.value,
                  isDark: isDark,
                ),
                size: Size.infinite,
              );
            },
          ),
          
          // Interactive glow effects
          AnimatedBuilder(
            animation: _glowController,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    center: const Alignment(0.3, -0.7),
                    radius: 1.5,
                    colors: [
                      (isDark ? const Color(0xFF64FFDA) : const Color(0xFF0A192F))
                          .withOpacity(0.1 * _glowAnimation.value),
                      Colors.transparent,
                    ],
                  ),
                ),
              );
            },
          ),
          
          // Gradient overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  (isDark ? Colors.black : Colors.white).withOpacity(0.05),
                  Colors.transparent,
                ],
                stops: const [0.0, 0.5, 1.0],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class Particle {
  double x;
  double y;
  final double size;
  final double speed;
  final double opacity;
  double angle;
  final double rotationSpeed;
  
  Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
    required this.angle,
    required this.rotationSpeed,
  });
}

class FloatingOrb {
  double x;
  double y;
  final double size;
  final double speed;
  final double opacity;
  final double hue;
  final double pulsePhase;
  
  FloatingOrb({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
    required this.hue,
    required this.pulsePhase,
  });
}

class MorphableParticle {
  double x;
  double y;
  final double size;
  final double speed;
  final double opacity;
  final double morphPhase;
  final Color color;
  double currentMorphState = 0.0;
  
  MorphableParticle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
    required this.morphPhase,
    required this.color,
  });
}

class EnhancedParticlesPainter extends CustomPainter {
  final List<Particle> particles;
  final double animationValue;
  final bool isDark;
  
  EnhancedParticlesPainter({
    required this.particles,
    required this.animationValue,
    required this.isDark,
  });
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill;
    
    for (final particle in particles) {
      // Update particle position with rotation
      particle.y += particle.speed * 0.01;
      particle.x += math.sin(particle.angle) * 0.001;
      particle.angle += particle.rotationSpeed;
      
      if (particle.y > 1.0) {
        particle.y = -0.1;
        particle.x = math.Random().nextDouble();
      }
      if (particle.x < 0) particle.x = 1.0;
      if (particle.x > 1) particle.x = 0.0;
      
      final x = particle.x * size.width;
      final y = particle.y * size.height;
      
      // Enhanced particle with glow effect
      final glowPaint = Paint()
        ..color = (isDark ? const Color(0xFF64FFDA) : const Color(0xFF0A192F))
            .withOpacity(particle.opacity * 0.1)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      
      paint.color = (isDark ? Colors.white : Colors.black87)
          .withOpacity(particle.opacity * 0.6);
      
      // Draw glow effect
      canvas.drawCircle(
        Offset(x, y),
        particle.size * 3,
        glowPaint,
      );
      
      // Draw main particle
      canvas.drawCircle(
        Offset(x, y),
        particle.size,
        paint,
      );
      
      // Add sparkle effect for larger particles
      if (particle.size > 2.5) {
        final sparklePaint = Paint()
          ..color = (isDark ? Colors.white : Colors.black87)
              .withOpacity(particle.opacity * 0.8)
          ..strokeWidth = 0.5;
        
        final sparkleSize = particle.size * 0.5;
        canvas.drawLine(
          Offset(x - sparkleSize, y),
          Offset(x + sparkleSize, y),
          sparklePaint,
        );
        canvas.drawLine(
          Offset(x, y - sparkleSize),
          Offset(x, y + sparkleSize),
          sparklePaint,
        );
      }
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class MorphableShapesPainter extends CustomPainter {
  final List<MorphableParticle> particles;
  final double animationValue;
  final bool isDark;
  
  MorphableShapesPainter({
    required this.particles,
    required this.animationValue,
    required this.isDark,
  });
  
  @override
  void paint(Canvas canvas, Size size) {
    for (final particle in particles) {
      // Update particle position with morphing motion
      particle.y += particle.speed * 0.008;
      particle.x += math.sin(animationValue * 2 * math.pi + particle.morphPhase) * 0.002;
      particle.currentMorphState = math.sin(animationValue * 4 * math.pi + particle.morphPhase);
      
      if (particle.y > 1.1) {
        particle.y = -0.1;
        particle.x = math.Random().nextDouble();
      }
      if (particle.x < -0.1) particle.x = 1.1;
      if (particle.x > 1.1) particle.x = -0.1;
      
      final x = particle.x * size.width;
      final y = particle.y * size.height;
      
      // Create morphing shape based on current state
      final morphFactor = (particle.currentMorphState + 1) / 2; // 0 to 1
      final currentSize = particle.size * (0.5 + morphFactor * 0.5);
      
      // Create gradient paint for morphable particle
      final gradientPaint = Paint()
        ..shader = RadialGradient(
          colors: [
            particle.color.withOpacity(particle.opacity * 0.8),
            particle.color.withOpacity(particle.opacity * 0.4),
            particle.color.withOpacity(0.0),
          ],
          stops: const [0.0, 0.7, 1.0],
        ).createShader(Rect.fromCircle(
          center: Offset(x, y),
          radius: currentSize,
        ));
      
      // Draw morphing shape
      if (morphFactor < 0.5) {
        // Circle to triangle morph
        _drawMorphingCircleToTriangle(canvas, gradientPaint, x, y, currentSize, morphFactor * 2);
      } else {
        // Triangle to hexagon morph
        _drawMorphingTriangleToHexagon(canvas, gradientPaint, x, y, currentSize, (morphFactor - 0.5) * 2);
      }
      
      // Add glow effect
      final glowPaint = Paint()
        ..color = particle.color.withOpacity(particle.opacity * 0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
      
      canvas.drawCircle(
        Offset(x, y),
        currentSize * 1.5,
        glowPaint,
      );
    }
  }
  
  void _drawMorphingCircleToTriangle(Canvas canvas, Paint paint, double x, double y, double size, double morphFactor) {
    final path = Path();
    final vertices = 3;
    final angleStep = 2 * math.pi / vertices;
    
    for (int i = 0; i <= vertices; i++) {
      final angle = i * angleStep - math.pi / 2;
      final radius = size * (1 - morphFactor * 0.3); // Slight size change during morph
      final px = x + radius * math.cos(angle);
      final py = y + radius * math.sin(angle);
      
      if (i == 0) {
        path.moveTo(px, py);
      } else {
        path.lineTo(px, py);
      }
    }
    
    canvas.drawPath(path, paint);
  }
  
  void _drawMorphingTriangleToHexagon(Canvas canvas, Paint paint, double x, double y, double size, double morphFactor) {
    final path = Path();
    final startVertices = 3;
    final endVertices = 6;
    final currentVertices = (startVertices + (endVertices - startVertices) * morphFactor).round();
    final angleStep = 2 * math.pi / currentVertices;
    
    for (int i = 0; i <= currentVertices; i++) {
      final angle = i * angleStep - math.pi / 2;
      final radius = size * (1 + morphFactor * 0.2); // Slight size increase
      final px = x + radius * math.cos(angle);
      final py = y + radius * math.sin(angle);
      
      if (i == 0) {
        path.moveTo(px, py);
      } else {
        path.lineTo(px, py);
      }
    }
    
    canvas.drawPath(path, paint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class FloatingOrbsPainter extends CustomPainter {
  final List<FloatingOrb> orbs;
  final double animationValue;
  final double glowIntensity;
  final bool isDark;
  
  FloatingOrbsPainter({
    required this.orbs,
    required this.animationValue,
    required this.glowIntensity,
    required this.isDark,
  });
  
  @override
  void paint(Canvas canvas, Size size) {
    for (final orb in orbs) {
      // Update orb position with floating motion
      orb.y += orb.speed * 0.005;
      orb.x += math.sin(animationValue * 2 * math.pi + orb.pulsePhase) * 0.001;
      
      if (orb.y > 1.1) {
        orb.y = -0.1;
        orb.x = math.Random().nextDouble();
      }
      if (orb.x < -0.1) orb.x = 1.1;
      if (orb.x > 1.1) orb.x = -0.1;
      
      final x = orb.x * size.width;
      final y = orb.y * size.height;
      
      // Calculate pulsing size
      final pulseMultiplier = 1.0 + 0.3 * math.sin(animationValue * 4 * math.pi + orb.pulsePhase);
      final currentSize = orb.size * pulseMultiplier;
      
      // Create gradient for orb
      final orbColor = HSVColor.fromAHSV(
        orb.opacity * glowIntensity,
        orb.hue,
        isDark ? 0.8 : 0.6,
        isDark ? 0.9 : 0.7,
      ).toColor();
      
      // Draw outer glow
      final outerGlowPaint = Paint()
        ..shader = RadialGradient(
          colors: [
            orbColor.withOpacity(0.3 * glowIntensity),
            orbColor.withOpacity(0.1 * glowIntensity),
            Colors.transparent,
          ],
          stops: const [0.0, 0.7, 1.0],
        ).createShader(Rect.fromCircle(
          center: Offset(x, y),
          radius: currentSize * 2,
        ));
      
      canvas.drawCircle(
        Offset(x, y),
        currentSize * 2,
        outerGlowPaint,
      );
      
      // Draw main orb
      final orbPaint = Paint()
        ..shader = RadialGradient(
          colors: [
            orbColor.withOpacity(0.8 * glowIntensity),
            orbColor.withOpacity(0.4 * glowIntensity),
            orbColor.withOpacity(0.1 * glowIntensity),
          ],
          stops: const [0.0, 0.6, 1.0],
        ).createShader(Rect.fromCircle(
          center: Offset(x, y),
          radius: currentSize,
        ));
      
      canvas.drawCircle(
        Offset(x, y),
        currentSize,
        orbPaint,
      );
      
      // Draw inner highlight
      final highlightPaint = Paint()
        ..color = Colors.white.withOpacity(0.6 * glowIntensity)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);
      
      canvas.drawCircle(
        Offset(x - currentSize * 0.3, y - currentSize * 0.3),
        currentSize * 0.2,
        highlightPaint,
      );
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class GeometricShapesPainter extends CustomPainter {
  final double animation1;
  final double animation2;
  final double animation3;
  final bool isDark;
  
  GeometricShapesPainter({
    required this.animation1,
    required this.animation2,
    required this.animation3,
    required this.isDark,
  });
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;
    
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    
    // Draw rotating geometric shapes
    _drawRotatingShape(
      canvas,
      paint,
      centerX - 200,
      centerY - 100,
      100,
      animation1,
      6, // hexagon
    );
    
    _drawRotatingShape(
      canvas,
      paint,
      centerX + 300,
      centerY + 150,
      80,
      -animation2,
      8, // octagon
    );
    
    _drawRotatingShape(
      canvas,
      paint,
      centerX - 300,
      centerY + 200,
      60,
      animation3,
      5, // pentagon
    );
    
    // Draw connecting lines
    paint.color = (isDark ? Colors.blue : Colors.indigo)
        .withOpacity(0.1);
    
    canvas.drawLine(
      Offset(centerX - 200, centerY - 100),
      Offset(centerX + 300, centerY + 150),
      paint,
    );
    
    canvas.drawLine(
      Offset(centerX + 300, centerY + 150),
      Offset(centerX - 300, centerY + 200),
      paint,
    );
  }
  
  void _drawRotatingShape(
    Canvas canvas,
    Paint paint,
    double centerX,
    double centerY,
    double radius,
    double rotation,
    int sides,
  ) {
    paint.color = (isDark ? Colors.cyan : Colors.blue)
        .withOpacity(0.15);
    
    final path = Path();
    final angleStep = 2 * math.pi / sides;
    
    for (int i = 0; i <= sides; i++) {
      final angle = i * angleStep + rotation;
      final x = centerX + radius * math.cos(angle);
      final y = centerY + radius * math.sin(angle);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    
    canvas.drawPath(path, paint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}