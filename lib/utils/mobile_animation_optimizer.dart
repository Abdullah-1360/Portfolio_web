import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';

/// Utility class for optimizing animations on mobile devices
class MobileAnimationOptimizer {
  /// Checks if device prefers reduced motion for accessibility
  static bool prefersReducedMotion(BuildContext context) {
    return MediaQuery.of(context).accessibleNavigation;
  }

  /// Returns optimized animation duration based on device type
  static Duration getOptimizedDuration(BuildContext context, Duration defaultDuration) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) {
      return Duration.zero;
    }
    
    if (isMobile) {
      // Reduce animation duration by 40% on mobile for better performance
      return Duration(milliseconds: (defaultDuration.inMilliseconds * 0.6).round());
    }
    
    return defaultDuration;
  }

  /// Returns optimized curve for mobile devices
  static Curve getOptimizedCurve(BuildContext context, Curve defaultCurve) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) {
      return Curves.linear;
    }
    
    if (isMobile) {
      // Use simpler curves on mobile for better performance
      if (defaultCurve == Curves.easeInOutCubic) return Curves.easeInOut;
      if (defaultCurve == Curves.easeInOutSine) return Curves.easeInOut;
      if (defaultCurve == Curves.elasticOut) return Curves.easeOut;
      if (defaultCurve == Curves.bounceOut) return Curves.easeOut;
    }
    
    return defaultCurve;
  }

  /// Creates an optimized AnimationController for mobile
  static AnimationController createOptimizedController({
    required TickerProvider vsync,
    required Duration duration,
    required BuildContext context,
    Duration? reverseDuration,
  }) {
    final optimizedDuration = getOptimizedDuration(context, duration);
    final optimizedReverseDuration = reverseDuration != null 
        ? getOptimizedDuration(context, reverseDuration)
        : null;
    
    return AnimationController(
      duration: optimizedDuration,
      reverseDuration: optimizedReverseDuration,
      vsync: vsync,
    );
  }

  /// Determines if complex animations should be disabled on mobile
  static bool shouldDisableComplexAnimations(BuildContext context) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    return isMobile || reducedMotion;
  }

  /// Returns optimized particle count for mobile devices
  static int getOptimizedParticleCount(BuildContext context, int defaultCount) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) return 0;
    if (isMobile) return (defaultCount * 0.3).round(); // Reduce by 70% on mobile
    
    return defaultCount;
  }

  /// Returns optimized animation frame rate for mobile
  static int getOptimizedFrameRate(BuildContext context) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    
    return isMobile ? 30 : 60; // Lower frame rate on mobile for battery life
  }

  /// Creates a mobile-optimized fade transition
  static Widget buildOptimizedFadeTransition({
    required BuildContext context,
    required Widget child,
    required Animation<double> animation,
  }) {
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) {
      return child;
    }
    
    return FadeTransition(
      opacity: animation,
      child: child,
    );
  }

  /// Creates a mobile-optimized slide transition
  static Widget buildOptimizedSlideTransition({
    required BuildContext context,
    required Widget child,
    required Animation<Offset> animation,
  }) {
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) {
      return child;
    }
    
    return SlideTransition(
      position: animation,
      child: child,
    );
  }

  /// Creates a mobile-optimized scale transition
  static Widget buildOptimizedScaleTransition({
    required BuildContext context,
    required Widget child,
    required Animation<double> animation,
  }) {
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) {
      return child;
    }
    
    return ScaleTransition(
      scale: animation,
      child: child,
    );
  }

  /// Optimizes Rive animation settings for mobile
  static Map<String, dynamic> getOptimizedRiveSettings(BuildContext context) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    return {
      'antialiasing': !isMobile, // Disable antialiasing on mobile for performance
      'useArtboardSize': isMobile, // Use artboard size on mobile to reduce scaling
      'fit': isMobile ? BoxFit.contain : BoxFit.cover,
      'alignment': Alignment.center,
      'enableInteraction': !reducedMotion,
    };
  }

  /// Creates an optimized staggered animation delay
  static Duration getStaggeredDelay(BuildContext context, int index, Duration baseDelay) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final reducedMotion = prefersReducedMotion(context);
    
    if (reducedMotion) return Duration.zero;
    
    final multiplier = isMobile ? 0.5 : 1.0; // Reduce stagger delay on mobile
    return Duration(milliseconds: (baseDelay.inMilliseconds * multiplier * index).round());
  }
}

/// Extension for easy access to mobile animation optimization
extension AnimationControllerOptimization on AnimationController {
  /// Starts animation with mobile optimization
  void forwardOptimized(BuildContext context) {
    if (MobileAnimationOptimizer.prefersReducedMotion(context)) {
      value = 1.0;
      return;
    }
    forward();
  }

  /// Reverses animation with mobile optimization
  void reverseOptimized(BuildContext context) {
    if (MobileAnimationOptimizer.prefersReducedMotion(context)) {
      value = 0.0;
      return;
    }
    reverse();
  }

  /// Repeats animation with mobile optimization
  void repeatOptimized(BuildContext context, {bool reverse = false}) {
    if (MobileAnimationOptimizer.prefersReducedMotion(context)) {
      return;
    }
    repeat(reverse: reverse);
  }
}