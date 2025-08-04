import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/experience.dart';

class ExperienceSection extends StatefulWidget {
  final List<Experience> experiences;

  const ExperienceSection({
    Key? key,
    required this.experiences,
  }) : super(key: key);

  @override
  State<ExperienceSection> createState() => _ExperienceSectionState();
}

class _ExperienceSectionState extends State<ExperienceSection>
    with TickerProviderStateMixin {
  late AnimationController _timelineController;
  late List<AnimationController> _itemControllers;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    
    _timelineController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _itemControllers = List.generate(
      widget.experiences.length,
      (index) => AnimationController(
        duration: Duration(milliseconds: 600 + (index * 100)),
        vsync: this,
      ),
    );
    
    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAnimations();
    });
  }
  
  void _startAnimations() {
    _timelineController.forward();
    
    for (int i = 0; i < _itemControllers.length; i++) {
      Future.delayed(Duration(milliseconds: 300 + (i * 200)), () {
        if (mounted) {
          _itemControllers[i].forward();
        }
      });
    }
  }
  
  @override
  void dispose() {
    _timelineController.dispose();
    for (final controller in _itemControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = ResponsiveBreakpoints.of(context).largerThan(TABLET);
    final isMobile = ResponsiveBreakpoints.of(context).equals(MOBILE);
    final isSmallDesktop = ResponsiveBreakpoints.of(context).equals('SMALL_DESKTOP');
    
    // Dynamic padding based on screen size
    double horizontalPadding;
    if (screenWidth > 1440) {
      horizontalPadding = 120;
    } else if (screenWidth > 1024) {
      horizontalPadding = 80;
    } else if (screenWidth > 768) {
      horizontalPadding = 60;
    } else if (screenWidth > 480) {
      horizontalPadding = 40;
    } else {
      horizontalPadding = 20;
    }
    
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: screenWidth > 768 ? 80 : 60,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section title
          _buildSectionTitle(theme),
          
          const SizedBox(height: 60),
          
          // Experience content
          _buildResponsiveLayout(theme, screenWidth, isDesktop, isSmallDesktop, isMobile),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme) {
    return Row(
      children: [
        Text(
          '04.',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.secondary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 16),
        Text(
          'Experience',
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.colorScheme.primary.withOpacity(0.5),
                  Colors.transparent,
                ],
              )
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.3);
  }

  Widget _buildResponsiveLayout(ThemeData theme, double screenWidth, bool isDesktop, bool isSmallDesktop, bool isMobile) {
    if (screenWidth > 1024) {
      // Large desktop layout
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: screenWidth > 1440 ? 300 : 250,
            child: _buildCompanyTabs(theme),
          ),
          SizedBox(width: screenWidth > 1440 ? 60 : 40),
          Expanded(
            child: _buildExperienceDetails(theme),
          ),
        ],
      );
    } else if (screenWidth > 768) {
      // Small desktop/tablet landscape layout
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 200,
            child: _buildCompanyTabs(theme),
          ),
          const SizedBox(width: 30),
          Expanded(
            child: _buildExperienceDetails(theme),
          ),
        ],
      );
    } else {
      // Mobile/tablet portrait layout
      return Column(
        children: [
          _buildCompanySelector(theme),
          SizedBox(height: screenWidth > 480 ? 30 : 20),
          _buildExperienceDetails(theme),
        ],
      );
    }
  }

  Widget _buildCompanyTabs(ThemeData theme) {
    return Column(
      children: widget.experiences.asMap().entries.map((entry) {
        final index = entry.key;
        final experience = entry.value;
        final isSelected = _selectedIndex == index;
        
        return AnimatedBuilder(
          animation: _itemControllers[index],
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(-50 * (1 - _itemControllers[index].value), 0),
              child: Opacity(
                opacity: _itemControllers[index].value,
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _selectedIndex = index;
                    });
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
          
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? theme.colorScheme.primary.withOpacity(0.1)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      border: Border(
                        left: BorderSide(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.colorScheme.primary.withOpacity(0.3),
                          width: isSelected ? 3 : 1,
                        ),
                      ),
                    ),
                    child: Text(
                      experience.company,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: isSelected
                            ? theme.colorScheme.primary
                            : theme.colorScheme.onBackground.withOpacity(0.7),
                        fontWeight: isSelected
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        );
      }).toList(),
    ).animate().fadeIn(delay: 300.ms);
  }

  Widget _buildCompanySelector(ThemeData theme) {
    return Container(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: widget.experiences.length,
        itemBuilder: (context, index) {
          final experience = widget.experiences[index];
          final isSelected = _selectedIndex == index;
          
          return AnimatedBuilder(
            animation: _itemControllers[index],
            builder: (context, child) {
              return Transform.scale(
                scale: _itemControllers[index].value,
                child: Opacity(
                  opacity: _itemControllers[index].value,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: InkWell(
                      onTap: () {
                        setState(() {
                          _selectedIndex = index;
                        });
                      },
                      borderRadius: BorderRadius.circular(25),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? theme.colorScheme.primary
                              : theme.colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(25),
                          border: Border.all(
                            color: theme.colorScheme.primary,
                            width: isSelected ? 0 : 1,
                          ),
                        ),
                        child: Text(
                          experience.company,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: isSelected
                                ? theme.colorScheme.onPrimary
                                : theme.colorScheme.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    ).animate().fadeIn(delay: 300.ms);
  }

  Widget _buildExperienceDetails(ThemeData theme) {
    if (widget.experiences.isEmpty) return const SizedBox();
    
    final experience = widget.experiences[_selectedIndex];
    
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      transitionBuilder: (child, animation) {
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.3, 0),
              end: Offset.zero,
            ).animate(animation),
            child: child,
          ),
        );
      },
      child: Container(
        key: ValueKey(_selectedIndex),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Position and company
            Row(
              children: [
                Expanded(
                  child: Text(
                    '${experience.title} @ ${experience.company}',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onBackground,
                    ),
                  ),
                ),
                // Location display
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.secondary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          FontAwesomeIcons.home,
                          size: 12,
                          color: theme.colorScheme.secondary,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Remote',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            
            const SizedBox(height: 8),
            
            // Duration and location
            Row(
              children: [
                Icon(
                  FontAwesomeIcons.calendar,
                  size: 16,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  '${experience.startDate} - ${experience.endDate ?? "Present"}',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                if (experience.location.isNotEmpty) ...[
                  const SizedBox(width: 20),
                  Icon(
                    FontAwesomeIcons.mapMarkerAlt,
                    size: 16,
                    color: theme.colorScheme.onBackground.withOpacity(0.6),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    experience.location!,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onBackground.withOpacity(0.6),
                    ),
                  ),
                ],
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Description
            Text(
              experience.description,
              style: theme.textTheme.bodyLarge?.copyWith(
                height: 1.6,
                color: theme.colorScheme.onBackground.withOpacity(0.8),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Responsibilities
            Text(
              'Key Responsibilities:',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.onBackground,
              ),
            ),
            const SizedBox(height: 16),
            ...experience.responsibilities.map((responsibility) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(top: 8),
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          responsibility,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            height: 1.5,
                            color: theme.colorScheme.onBackground.withOpacity(0.7),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
              
              const SizedBox(height: 24),
            
            // Technologies
            if (experience.technologies.isNotEmpty) ...[
              Text(
                'Technologies Used:',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: experience.technologies.map((tech) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: theme.colorScheme.primary.withOpacity(0.3),
                      ),
                    ),
                    child: Text(
                      tech,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
        ]),
      ),
    ).animate().fadeIn(delay: 500.ms);
  }
}