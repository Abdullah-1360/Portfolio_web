import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class FloatingNavigation extends StatefulWidget {
  final ScrollController scrollController;
  final List<GlobalKey> sectionKeys;
  final VoidCallback onThemeToggle;
  final bool isDarkMode;

  const FloatingNavigation({
    Key? key,
    required this.scrollController,
    required this.sectionKeys,
    required this.onThemeToggle,
    required this.isDarkMode,
  }) : super(key: key);

  @override
  State<FloatingNavigation> createState() => _FloatingNavigationState();
}

class _FloatingNavigationState extends State<FloatingNavigation>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _indicatorController;
  int _currentSection = 0;
  bool _isVisible = false;

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: FontAwesomeIcons.home,
      label: 'Home',
      tooltip: 'Go to Home',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.user,
      label: 'About',
      tooltip: 'About Me',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.cogs,
      label: 'Skills',
      tooltip: 'My Skills',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.projectDiagram,
      label: 'Projects',
      tooltip: 'My Projects',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.briefcase,
      label: 'Experience',
      tooltip: 'Work Experience',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.envelope,
      label: 'Contact',
      tooltip: 'Get in Touch',
    ),
  ];

  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    
    _indicatorController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    
    widget.scrollController.addListener(_onScroll);
    
    // Show navigation after a shorter delay for better UX
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() {
          _isVisible = true;
        });
        _controller.forward();
      }
    });
  }
  
  @override
  void dispose() {
    widget.scrollController.removeListener(_onScroll);
    _controller.dispose();
    _indicatorController.dispose();
    super.dispose();
  }

  void _onScroll() {
    final scrollOffset = widget.scrollController.offset;
    final viewportHeight = MediaQuery.of(context).size.height;
    
    // Determine current section
    int newSection = 0;
    for (int i = 0; i < widget.sectionKeys.length; i++) {
      final key = widget.sectionKeys[i];
      final context = key.currentContext;
      if (context != null) {
        final box = context.findRenderObject() as RenderBox?;
        if (box != null) {
          final position = box.localToGlobal(Offset.zero);
          if (position.dy <= viewportHeight * 0.5) {
            newSection = i;
          }
        }
      }
    }
    
    if (newSection != _currentSection) {
      setState(() {
        _currentSection = newSection;
      });
      _indicatorController.reset();
      _indicatorController.forward();
    }
    
    // Show/hide navigation based on scroll position
    final shouldShow = scrollOffset > 100;
    if (shouldShow != _isVisible) {
      setState(() {
        _isVisible = shouldShow;
      });
      
      if (shouldShow) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    }
  }

  void _scrollToSection(int index) {
    if (index < widget.sectionKeys.length) {
      final key = widget.sectionKeys[index];
      final context = key.currentContext;
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
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth <= 768;
    
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(
            (isTablet ? 60 : 100) * (1 - _controller.value), 
            0
          ),
          child: Opacity(
            opacity: _controller.value,
            child: Positioned(
              right: isTablet ? 10 : 20,
              top: MediaQuery.of(context).size.height * 0.25,
              child: Container(
                  width: isTablet ? 50 : 60,
                  constraints: BoxConstraints(
                    minHeight: _navigationItems.length * (isTablet ? 45 : 50) + 120,
                  ),
                  decoration: BoxDecoration(
                    color: widget.isDarkMode 
                        ? const Color(0xFF0F1419)
                        : const Color(0xFFFAFAFA),
                    borderRadius: BorderRadius.circular(isTablet ? 25 : 30),
                    border: Border.all(
                      color: widget.isDarkMode 
                          ? const Color(0xFF64FFDA)
                          : const Color(0xFF2D3748),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: widget.isDarkMode 
                            ? const Color(0xFF000000).withOpacity(0.3)
                            : const Color(0xFF000000).withOpacity(0.1),
                        blurRadius: 15,
                        spreadRadius: 0,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Navigation items
                    ..._navigationItems.asMap().entries.map((entry) {
                      final index = entry.key;
                      final item = entry.value;
                      final isActive = index == _currentSection;
                      
                      return _buildNavigationItem(
                        item,
                        index,
                        isActive,
                        theme,
                      );
                    }).toList(),
                    
                    // Divider
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      width: 30,
                      height: 1,
                      color: theme.colorScheme.primary.withOpacity(0.3),
                    ),
                    
                    // Theme toggle
                    _buildThemeToggle(theme),
                    
                    // Scroll to top
                    _buildScrollToTop(theme),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNavigationItem(
    NavigationItem item,
    int index,
    bool isActive,
    ThemeData theme,
  ) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth <= 768;
    final iconSize = isTablet ? 18.0 : 20.0;
    final padding = isTablet ? 10.0 : 12.0;
    
    return Tooltip(
      message: item.tooltip,
      preferBelow: false,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            _scrollToSection(index);
            // Haptic feedback for better UX
            if (isActive != (index == _currentSection)) {
              _indicatorController.forward().then((_) {
                _indicatorController.reverse();
              });
            }
          },
          borderRadius: BorderRadius.circular(20),
          splashColor: theme.colorScheme.primary.withOpacity(0.1),
          highlightColor: theme.colorScheme.primary.withOpacity(0.05),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOutCubic,
            margin: EdgeInsets.symmetric(
              vertical: isTablet ? 3 : 4, 
              horizontal: isTablet ? 6 : 8
            ),
            padding: EdgeInsets.all(padding),
            decoration: BoxDecoration(
              color: isActive
                  ? (widget.isDarkMode 
                      ? const Color(0xFF64FFDA).withOpacity(0.15)
                      : const Color(0xFF0A192F).withOpacity(0.1))
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(20),
              border: isActive
                  ? Border.all(
                      color: widget.isDarkMode 
                          ? const Color(0xFF64FFDA).withOpacity(0.4)
                          : const Color(0xFF0A192F).withOpacity(0.3),
                      width: 1,
                    )
                  : null,
            ),
            child: Center(
              child: AnimatedScale(
                scale: isActive ? 1.1 : 1.0,
                duration: const Duration(milliseconds: 200),
                child: Icon(
                  item.icon,
                  size: iconSize,
                  color: isActive
                      ? (widget.isDarkMode 
                          ? const Color(0xFF64FFDA)
                          : const Color(0xFF2D3748))
                      : (widget.isDarkMode 
                          ? const Color(0xFFCCD6F6).withOpacity(0.8)
                          : const Color(0xFF4A5568).withOpacity(0.8)),
                ),
              ),
          ),
        ),
      ).animate().fadeIn(delay: (index * 100).ms).scale(begin: const Offset(0.5, 0.5)),
    ));  
  }

  Widget _buildThemeToggle(ThemeData theme) {
    return Tooltip(
      message: widget.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      child: InkWell(
        onTap: widget.onThemeToggle,
        borderRadius: BorderRadius.circular(25),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.all(12),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (child, animation) {
              return RotationTransition(
                turns: animation,
                child: child,
              );
            },
            child: Icon(
              widget.isDarkMode
                  ? FontAwesomeIcons.sun
                  : FontAwesomeIcons.moon,
              key: ValueKey(widget.isDarkMode),
              size: 20,
              color: widget.isDarkMode 
                  ? const Color(0xFFCCD6F6).withOpacity(0.8)
                  : const Color(0xFF4A5568).withOpacity(0.8),
            ),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 500.ms).scale(begin: const Offset(0.8, 0.8), curve: Curves.easeOutBack);
  }

  Widget _buildScrollToTop(ThemeData theme) {
    return Tooltip(
      message: 'Scroll to Top',
      child: InkWell(
        onTap: () {
          widget.scrollController.animateTo(
            0,
            duration: const Duration(milliseconds: 800),
            curve: Curves.easeInOut,
          );
        },
        borderRadius: BorderRadius.circular(25),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.all(12),
          child: Icon(
            FontAwesomeIcons.arrowUp,
            size: 20,
            color: widget.isDarkMode 
                ? const Color(0xFFCCD6F6).withOpacity(0.8)
                : const Color(0xFF4A5568).withOpacity(0.8),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 600.ms).scale(begin: const Offset(0.8, 0.8), curve: Curves.easeOutBack);
  }
}

class NavigationItem {
  final IconData icon;
  final String label;
  final String tooltip;

  const NavigationItem({
    required this.icon,
    required this.label,
    required this.tooltip,
  });
}