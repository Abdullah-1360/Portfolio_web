import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:responsive_framework/responsive_framework.dart';

class OptimizedImage extends StatelessWidget {
  final String? imageUrl;
  final String? assetPath;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? placeholder;
  final Widget? errorWidget;
  final bool enableMemoryCache;
  final bool enableDiskCache;
  final Duration? fadeInDuration;
  final BorderRadius? borderRadius;

  const OptimizedImage({
    super.key,
    this.imageUrl,
    this.assetPath,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.placeholder,
    this.errorWidget,
    this.enableMemoryCache = true,
    this.enableDiskCache = true,
    this.fadeInDuration,
    this.borderRadius,
  }) : assert(imageUrl != null || assetPath != null, 'Either imageUrl or assetPath must be provided');

  @override
  Widget build(BuildContext context) {
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final isTablet = ResponsiveBreakpoints.of(context).equals(TABLET);
    
    // Calculate responsive dimensions
    final responsiveWidth = _getResponsiveWidth(isMobile, isTablet);
    final responsiveHeight = _getResponsiveHeight(isMobile, isTablet);
    
    Widget imageWidget;
    
    if (assetPath != null) {
      // Local asset image
      imageWidget = Image.asset(
        assetPath!,
        width: responsiveWidth,
        height: responsiveHeight,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          return errorWidget ?? _buildDefaultErrorWidget(context, isMobile);
        },
      );
    } else {
      // Network image with caching
      imageWidget = CachedNetworkImage(
        imageUrl: imageUrl!,
        width: responsiveWidth,
        height: responsiveHeight,
        fit: fit,
        placeholder: (context, url) {
          return placeholder ?? _buildDefaultPlaceholder(context, isMobile);
        },
        errorWidget: (context, url, error) {
          return errorWidget ?? _buildDefaultErrorWidget(context, isMobile);
        },
        fadeInDuration: fadeInDuration ?? const Duration(milliseconds: 300),
        memCacheWidth: enableMemoryCache ? _getMemCacheWidth(isMobile, isTablet) : null,
        memCacheHeight: enableMemoryCache ? _getMemCacheHeight(isMobile, isTablet) : null,
        maxWidthDiskCache: enableDiskCache ? _getDiskCacheWidth(isMobile, isTablet) : null,
        maxHeightDiskCache: enableDiskCache ? _getDiskCacheHeight(isMobile, isTablet) : null,
      );
    }
    
    // Apply border radius if provided
    if (borderRadius != null) {
      imageWidget = ClipRRect(
        borderRadius: borderRadius!,
        child: imageWidget,
      );
    }
    
    return imageWidget;
  }
  
  double? _getResponsiveWidth(bool isMobile, bool isTablet) {
    if (width == null) return null;
    
    if (isMobile) {
      return width! * 0.8; // Reduce width by 20% on mobile
    } else if (isTablet) {
      return width! * 0.9; // Reduce width by 10% on tablet
    }
    return width;
  }
  
  double? _getResponsiveHeight(bool isMobile, bool isTablet) {
    if (height == null) return null;
    
    if (isMobile) {
      return height! * 0.8; // Reduce height by 20% on mobile
    } else if (isTablet) {
      return height! * 0.9; // Reduce height by 10% on tablet
    }
    return height;
  }
  
  int? _getMemCacheWidth(bool isMobile, bool isTablet) {
    if (isMobile) {
      return 400; // Lower resolution for mobile
    } else if (isTablet) {
      return 600; // Medium resolution for tablet
    }
    return 800; // High resolution for desktop
  }
  
  int? _getMemCacheHeight(bool isMobile, bool isTablet) {
    if (isMobile) {
      return 300; // Lower resolution for mobile
    } else if (isTablet) {
      return 450; // Medium resolution for tablet
    }
    return 600; // High resolution for desktop
  }
  
  int? _getDiskCacheWidth(bool isMobile, bool isTablet) {
    if (isMobile) {
      return 800; // Moderate disk cache for mobile
    } else if (isTablet) {
      return 1200; // Higher disk cache for tablet
    }
    return 1600; // Full disk cache for desktop
  }
  
  int? _getDiskCacheHeight(bool isMobile, bool isTablet) {
    if (isMobile) {
      return 600; // Moderate disk cache for mobile
    } else if (isTablet) {
      return 900; // Higher disk cache for tablet
    }
    return 1200; // Full disk cache for desktop
  }
  
  Widget _buildDefaultPlaceholder(BuildContext context, bool isMobile) {
    return Container(
      width: width,
      height: height,
      color: Theme.of(context).colorScheme.surface.withOpacity(0.1),
      child: Center(
        child: SizedBox(
          width: isMobile ? 20 : 24,
          height: isMobile ? 20 : 24,
          child: CircularProgressIndicator(
            strokeWidth: isMobile ? 2 : 3,
            valueColor: AlwaysStoppedAnimation<Color>(
              Theme.of(context).colorScheme.primary,
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildDefaultErrorWidget(BuildContext context, bool isMobile) {
    return Container(
      width: width,
      height: height,
      color: Theme.of(context).colorScheme.surface.withOpacity(0.1),
      child: Center(
        child: Icon(
          Icons.broken_image_outlined,
          size: isMobile ? 32 : 48,
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
        ),
      ),
    );
  }
}

// Utility class for image optimization settings
class ImageOptimizationSettings {
  static const Duration defaultFadeInDuration = Duration(milliseconds: 300);
  static const Duration fastFadeInDuration = Duration(milliseconds: 150);
  static const Duration slowFadeInDuration = Duration(milliseconds: 500);
  
  // Mobile-optimized cache sizes
  static const int mobileMemCacheWidth = 400;
  static const int mobileMemCacheHeight = 300;
  static const int mobileDiskCacheWidth = 800;
  static const int mobileDiskCacheHeight = 600;
  
  // Tablet-optimized cache sizes
  static const int tabletMemCacheWidth = 600;
  static const int tabletMemCacheHeight = 450;
  static const int tabletDiskCacheWidth = 1200;
  static const int tabletDiskCacheHeight = 900;
  
  // Desktop-optimized cache sizes
  static const int desktopMemCacheWidth = 800;
  static const int desktopMemCacheHeight = 600;
  static const int desktopDiskCacheWidth = 1600;
  static const int desktopDiskCacheHeight = 1200;
}