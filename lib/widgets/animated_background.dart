import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
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
  late Animation<double> _animation1;
  late Animation<double> _animation2;
  late Animation<double> _animation3;
  
  final List<Particle> _particles = [];
  final int _particleCount = 50;

  @override
  void initState() {
    super.initState();
    
    _controller1 = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();
    
    _controller2 = AnimationController(
      duration: const Duration(seconds: 15),
      vsync: this,
    )..repeat();
    
    _controller3 = AnimationController(
      duration: const Duration(seconds: 25),
      vsync: this,
    )..repeat();
    
    _animation1 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(_controller1);
    
    _animation2 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(_controller2);
    
    _animation3 = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(_controller3);
    
    _initializeParticles();
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
      ));
    }
  }

  @override
  void dispose() {
    _controller1.dispose();
    _controller2.dispose();
    _controller3.dispose();
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
                  const Color(0xFF0F0F23),
                  const Color(0xFF1A1A2E),
                  const Color(0xFF16213E),
                ]
              : [
                  const Color(0xFFF8FAFC),
                  const Color(0xFFE2E8F0),
                  const Color(0xFFCBD5E1),
                ],
        ),
      ),
      child: Stack(
        children: [
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
          
          // Floating particles
          AnimatedBuilder(
            animation: _controller1,
            builder: (context, child) {
              return CustomPaint(
                painter: ParticlesPainter(
                  particles: _particles,
                  animationValue: _controller1.value,
                  isDark: isDark,
                ),
                size: Size.infinite,
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
                  (isDark ? Colors.black : Colors.white).withOpacity(0.1),
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
  
  Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
  });
}

class ParticlesPainter extends CustomPainter {
  final List<Particle> particles;
  final double animationValue;
  final bool isDark;
  
  ParticlesPainter({
    required this.particles,
    required this.animationValue,
    required this.isDark,
  });
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill;
    
    for (final particle in particles) {
      // Update particle position
      particle.y += particle.speed * 0.01;
      if (particle.y > 1.0) {
        particle.y = -0.1;
        particle.x = math.Random().nextDouble();
      }
      
      final x = particle.x * size.width;
      final y = particle.y * size.height;
      
      paint.color = (isDark ? Colors.white : Colors.black87)
          .withOpacity(particle.opacity * 0.3);
      
      canvas.drawCircle(
        Offset(x, y),
        particle.size,
        paint,
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