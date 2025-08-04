import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CustomAppBar extends StatefulWidget {
  final VoidCallback onThemeToggle;
  final Function(int) onNavigate;
  final int currentSection;

  const CustomAppBar({
    Key? key,
    required this.onThemeToggle,
    required this.onNavigate,
    required this.currentSection,
  }) : super(key: key);

  @override
  State<CustomAppBar> createState() => _CustomAppBarState();
}

class _CustomAppBarState extends State<CustomAppBar>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late Animation<double> _logoAnimation;
  bool _isMenuOpen = false;

  final List<String> _navItems = [
    'Home',
    'About',
    'Skills',
    'Projects',
    'Experience',
    'Contact',
  ];

  @override
  void initState() {
    super.initState();
    _logoController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    
    _logoAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _logoController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _logoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDesktop = ResponsiveBreakpoints.of(context).largerThan(TABLET);
    
    return SliverAppBar(
      expandedHeight: 0,
      floating: true,
      pinned: true,
      elevation: 0,
      backgroundColor: theme.colorScheme.background.withOpacity(0.95),
      surfaceTintColor: Colors.transparent,
      flexibleSpace: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.background.withOpacity(0.95),
          border: Border(
            bottom: BorderSide(
              color: theme.colorScheme.primary.withOpacity(0.1),
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: isDesktop ? 80 : 20,
              vertical: 8,
            ),
            child: Row(
              children: [
                // Logo
                _buildLogo(theme),
                
                const Spacer(),
                
                // Navigation items (desktop)
                if (isDesktop) ..._buildDesktopNavigation(theme),
                
                // Theme toggle
                _buildThemeToggle(theme),
                
                // Mobile menu button
                if (!isDesktop) _buildMobileMenuButton(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogo(ThemeData theme) {
    return AnimatedBuilder(
      animation: _logoAnimation,
      builder: (context, child) {
        return Transform.rotate(
          angle: _logoAnimation.value * 0.1,
          child: InkWell(
            onTap: () => widget.onNavigate(0),
            borderRadius: BorderRadius.circular(25),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary,
                    theme.colorScheme.secondary,
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.3),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Text(
                'AS',
                style: theme.textTheme.titleLarge?.copyWith(
                  color: theme.colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        );
      },
    ).animate().fadeIn(delay: 100.ms).scale(begin: const Offset(0.5, 0.5));
  }

  List<Widget> _buildDesktopNavigation(ThemeData theme) {
    return [
      Row(
        children: _navItems.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          final isActive = widget.currentSection == index;
          
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: _buildNavItem(item, index, isActive, theme),
          );
        }).toList(),
      ),
      const SizedBox(width: 24),
    ];
  }

  Widget _buildNavItem(String title, int index, bool isActive, ThemeData theme) {
    return InkWell(
      onTap: () => widget.onNavigate(index),
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: isActive
              ? theme.colorScheme.primary.withOpacity(0.1)
              : Colors.transparent,
          border: Border.all(
            color: isActive
                ? theme.colorScheme.primary
                : Colors.transparent,
            width: 1,
          ),
        ),
        child: Text(
          title,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: isActive
                ? theme.colorScheme.primary
                : theme.colorScheme.onBackground,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
          ),
        ),
      ),
    ).animate().fadeIn(delay: (100 + index * 50).ms).slideX(begin: 0.3);
  }

  Widget _buildThemeToggle(ThemeData theme) {
    return InkWell(
      onTap: widget.onThemeToggle,
      borderRadius: BorderRadius.circular(25),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: theme.colorScheme.primary.withOpacity(0.1),
          border: Border.all(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
        ),
        child: Icon(
          theme.brightness == Brightness.dark
              ? FontAwesomeIcons.sun
              : FontAwesomeIcons.moon,
          color: theme.colorScheme.primary,
          size: 20,
        ),
      ),
    ).animate().fadeIn(delay: 200.ms).scale(begin: const Offset(0.5, 0.5));
  }

  Widget _buildMobileMenuButton(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(left: 16),
      child: InkWell(
        onTap: () {
          setState(() {
            _isMenuOpen = !_isMenuOpen;
          });
          _showMobileMenu(theme);
        },
        borderRadius: BorderRadius.circular(25),
        child: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: theme.colorScheme.primary.withOpacity(0.1),
            border: Border.all(
              color: theme.colorScheme.primary.withOpacity(0.3),
            ),
          ),
          child: Icon(
            _isMenuOpen ? Icons.close : Icons.menu,
            color: theme.colorScheme.primary,
            size: 24,
          ),
        ),
      ),
    ).animate().fadeIn(delay: 300.ms).scale(begin: const Offset(0.5, 0.5));
  }

  void _showMobileMenu(ThemeData theme) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: BoxDecoration(
          color: theme.colorScheme.background,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(20),
          ),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.primary.withOpacity(0.1),
              blurRadius: 20,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Column(
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            
            // Navigation items
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _navItems.length,
                itemBuilder: (context, index) {
                  final item = _navItems[index];
                  final isActive = widget.currentSection == index;
                  
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: InkWell(
                      onTap: () {
                        widget.onNavigate(index);
                        Navigator.pop(context);
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          color: isActive
                              ? theme.colorScheme.primary.withOpacity(0.1)
                              : Colors.transparent,
                          border: Border.all(
                            color: isActive
                                ? theme.colorScheme.primary
                                : Colors.transparent,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _getIconForSection(index),
                              color: isActive
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.onBackground,
                              size: 24,
                            ),
                            const SizedBox(width: 16),
                            Text(
                              item,
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: isActive
                                    ? theme.colorScheme.primary
                                    : theme.colorScheme.onBackground,
                                fontWeight: isActive
                                    ? FontWeight.w600
                                    : FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ).animate().fadeIn(delay: (index * 100).ms).slideX(begin: 0.3),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconForSection(int index) {
    switch (index) {
      case 0:
        return Icons.home_outlined;
      case 1:
        return Icons.person_outline;
      case 2:
        return Icons.code_outlined;
      case 3:
        return Icons.work_outline;
      case 4:
        return Icons.timeline_outlined;
      case 5:
        return Icons.email_outlined;
      default:
        return Icons.circle_outlined;
    }
  }
}