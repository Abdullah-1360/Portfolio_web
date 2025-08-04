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
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    
    _indicatorController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    
    widget.scrollController.addListener(_onScroll);
    
    // Show navigation after a delay
    Future.delayed(const Duration(milliseconds: 2000), () {
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
    
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(100 * (1 - _controller.value), 0),
          child: Opacity(
            opacity: _controller.value,
            child: Positioned(
              right: 20,
              top: MediaQuery.of(context).size.height * 0.3,
              child: Container(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: theme.colorScheme.primary.withOpacity(0.2),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: theme.colorScheme.shadow.withOpacity(0.1),
                      blurRadius: 20,
                      spreadRadius: 5,
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
    return Tooltip(
      message: item.tooltip,
      child: InkWell(
        onTap: () => _scrollToSection(index),
        borderRadius: BorderRadius.circular(25),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isActive
                ? theme.colorScheme.primary.withOpacity(0.2)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(
                item.icon,
                size: 20,
                color: isActive
                    ? theme.colorScheme.primary
                    : theme.colorScheme.onSurface.withOpacity(0.6),
              ),
              
              // Active indicator
              if (isActive)
                AnimatedBuilder(
                  animation: _indicatorController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: 1 + (0.3 * _indicatorController.value),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: theme.colorScheme.primary.withOpacity(
                              0.5 * _indicatorController.value,
                            ),
                            width: 2,
                          ),
                        ),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ).animate().fadeIn(delay: (index * 100).ms).scale(begin: const Offset(0.5, 0.5)),
    );
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
              color: theme.colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 700.ms).scale(begin: const Offset(0.5, 0.5));
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
            color: theme.colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 800.ms).scale(begin: const Offset(0.5, 0.5));
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