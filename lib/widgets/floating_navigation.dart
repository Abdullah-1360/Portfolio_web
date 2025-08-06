import 'package:flutter/material.dart';
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
  late AnimationController _indicatorController;
  int _currentSection = 0;
  bool _isVisible = true;

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
    
    _indicatorController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    
    widget.scrollController.addListener(_onScroll);
  }
  
  @override
  void dispose() {
    widget.scrollController.removeListener(_onScroll);
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
    
    // Keep navigation always visible for better web compatibility
    if (!_isVisible) {
      setState(() {
        _isVisible = true;
      });
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
    
    if (!_isVisible) {
      return const SizedBox.shrink();
    }
    
    final screenHeight = MediaQuery.of(context).size.height;
    final maxHeight = screenHeight * 0.7; // Use 70% of screen height
    final topPosition = screenHeight * 0.15; // Start at 15% from top
    
    return Positioned(
                right: isTablet ? 10 : 20,
                top: topPosition,
                child: RepaintBoundary(
                   child: Container(
                     width: isTablet ? 50 : 60,
                     constraints: BoxConstraints(
                       maxHeight: maxHeight,
                     ),
                     padding: const EdgeInsets.symmetric(vertical: 8),
                     decoration: BoxDecoration(
                       color: widget.isDarkMode 
                           ? const Color(0xFF1E293B)
                           : Colors.white,
                       borderRadius: BorderRadius.circular(isTablet ? 25 : 30),
                       border: Border.all(
                         color: widget.isDarkMode 
                             ? const Color(0xFF10B981)
                             : const Color(0xFF1F2937),
                         width: 2.0,
                       ),
                       boxShadow: [
                         BoxShadow(
                           color: widget.isDarkMode 
                               ? Colors.black.withOpacity(0.3)
                               : Colors.grey.withOpacity(0.3),
                           blurRadius: 8,
                           offset: const Offset(0, 4),
                         ),
                       ],
                     ),
                  child: Flex(
                   direction: Axis.vertical,
                   mainAxisSize: MainAxisSize.min,
                   mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
      child: GestureDetector(
        onTap: () {
          _scrollToSection(index);
          // Haptic feedback for better UX
          if (isActive != (index == _currentSection)) {
            _indicatorController.forward().then((_) {
              _indicatorController.reverse();
            });
          }
        },
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
                    ? const Color(0xFF10B981).withOpacity(0.2)
                    : const Color(0xFF1F2937).withOpacity(0.1))
                : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
            border: isActive
                ? Border.all(
                    color: widget.isDarkMode 
                        ? const Color(0xFF10B981)
                        : const Color(0xFF1F2937),
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
                        ? const Color(0xFF10B981)
                        : const Color(0xFF1F2937))
                    : (widget.isDarkMode 
                        ? const Color(0xFFE2E8F0)
                        : const Color(0xFF6B7280)),
              ),
            ),
          ),
        ),
      ),
    );  
  }

  Widget _buildThemeToggle(ThemeData theme) {
    return Tooltip(
      message: widget.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      child: GestureDetector(
        onTap: widget.onThemeToggle,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(25),
          ),
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
                  ? const Color(0xFFE2E8F0)
                  : const Color(0xFF6B7280),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScrollToTop(ThemeData theme) {
    return Tooltip(
      message: 'Scroll to Top',
      child: GestureDetector(
        onTap: () {
          widget.scrollController.animateTo(
            0,
            duration: const Duration(milliseconds: 800),
            curve: Curves.easeInOut,
          );
        },
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(25),
          ),
          child: Icon(
            FontAwesomeIcons.arrowUp,
            size: 20,
            color: widget.isDarkMode 
                ? const Color(0xFFE2E8F0)
                : const Color(0xFF6B7280),
          ),
        ),
      ),
    );
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