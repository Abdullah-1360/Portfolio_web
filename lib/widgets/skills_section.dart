import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/skill.dart';

class SkillsSection extends StatefulWidget {
  final List<Skill> skills;
  final List<String> skillCategories;
  final List<Skill> Function(String) getSkillsByCategory;

  const SkillsSection({
    Key? key,
    required this.skills,
    required this.skillCategories,
    required this.getSkillsByCategory,
  }) : super(key: key);

  @override
  State<SkillsSection> createState() => _SkillsSectionState();
}

class _SkillsSectionState extends State<SkillsSection>
    with TickerProviderStateMixin {
  late AnimationController _progressController;
  late List<AnimationController> _skillControllers;
  late List<Animation<double>> _skillAnimations;
  String _selectedCategory = 'All';
  
  @override
  void initState() {
    super.initState();
    
    _progressController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    
    _skillControllers = List.generate(
      widget.skills.length,
      (index) => AnimationController(
        duration: Duration(milliseconds: 1000 + (index * 100)),
        vsync: this,
      ),
    );
    
    _skillAnimations = _skillControllers.map((controller) {
      return Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: controller, curve: Curves.easeOutCubic),
      );
    }).toList();
    
    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAnimations();
    });
  }
  
  void _startAnimations() {
    _progressController.forward();
    for (int i = 0; i < _skillControllers.length; i++) {
      Future.delayed(Duration(milliseconds: i * 100), () {
        if (mounted) {
          _skillControllers[i].forward();
        }
      });
    }
  }
  
  @override
  void dispose() {
    _progressController.dispose();
    for (final controller in _skillControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  List<Skill> get _filteredSkills {
    if (_selectedCategory == 'All') {
      return widget.skills;
    }
    return widget.getSkillsByCategory(_selectedCategory);
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
          
          // Category filters
          _buildCategoryFilters(theme, isDesktop),
          
          const SizedBox(height: 40),
          
          // Skills grid
          _buildSkillsGrid(theme, screenWidth, isDesktop, isMobile),
          
          const SizedBox(height: 60),
          
          // Skills summary
          _buildSkillsSummary(theme, isDesktop),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme) {
    return Row(
      children: [
        Text(
          '02.',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.secondary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 16),
        Text(
          'Skills & Technologies',
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
              ),
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.3);
  }

  Widget _buildCategoryFilters(ThemeData theme, bool isDesktop) {
    final categories = ['All', ...widget.skillCategories];
    
    return Container(
      width: double.infinity,
      child: isDesktop
          ? SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: categories.map((category) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: _buildCategoryChip(category, theme),
                  );
                }).toList(),
              ),
            )
          : Wrap(
              spacing: 12,
              runSpacing: 12,
              children: categories.map((category) {
                return _buildCategoryChip(category, theme);
              }).toList(),
            ),
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3);
  }

  Widget _buildCategoryChip(String category, ThemeData theme) {
    final isSelected = _selectedCategory == category;
    
    return InkWell(
      onTap: () {
        setState(() {
          _selectedCategory = category;
        });
      },
      borderRadius: BorderRadius.circular(25),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary
              : theme.colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: theme.colorScheme.primary,
            width: isSelected ? 0 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.3),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ]
              : null,
        ),
        child: Text(
          category,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: isSelected
                ? theme.colorScheme.onPrimary
                : theme.colorScheme.primary,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildSkillsGrid(ThemeData theme, double screenWidth, bool isDesktop, bool isMobile) {
    // Dynamic column count based on screen width
    int crossAxisCount;
    double childAspectRatio;
    double spacing;
    
    if (screenWidth > 1440) {
      crossAxisCount = 5;
      childAspectRatio = 1.1;
      spacing = 24;
    } else if (screenWidth > 1024) {
      crossAxisCount = 4;
      childAspectRatio = 1.2;
      spacing = 20;
    } else if (screenWidth > 768) {
      crossAxisCount = 3;
      childAspectRatio = 1.1;
      spacing = 18;
    } else if (screenWidth > 480) {
      crossAxisCount = 2;
      childAspectRatio = 1.0;
      spacing = 16;
    } else {
      crossAxisCount = 1;
      childAspectRatio = 1.2;
      spacing = 16;
    }
    
    return LayoutBuilder(
      builder: (context, constraints) {
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: spacing,
            mainAxisSpacing: spacing,
            childAspectRatio: childAspectRatio,
          ),
          itemCount: _filteredSkills.length,
          itemBuilder: (context, index) {
            final skill = _filteredSkills[index];
            final animationIndex = widget.skills.indexOf(skill);
            
            return _buildSkillCard(
              skill,
              theme,
              animationIndex < _skillAnimations.length
                  ? _skillAnimations[animationIndex]
                  : _skillAnimations.first,
              index,
            );
          },
        );
      },
    ).animate().fadeIn(delay: 500.ms);
  }

  Widget _buildSkillCard(Skill skill, ThemeData theme, Animation<double> animation, int index) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Transform.scale(
          scale: 0.8 + (animation.value * 0.2),
          child: Opacity(
            opacity: animation.value,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                ),
                boxShadow: [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Skill icon
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          theme.colorScheme.primary,
                          theme.colorScheme.secondary,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Icon(
                      _getSkillIcon(skill.name),
                      color: theme.colorScheme.onPrimary,
                      size: 30,
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Skill name
                  Text(
                    skill.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onBackground,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Progress bar
                  _buildProgressBar(skill.level, theme, animation),
                  
                  const SizedBox(height: 8),
                  
                  // Skill level text
                  Text(
                    '${skill.level}%',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    ).animate().fadeIn(delay: (500 + index * 100).ms).slideY(begin: 0.3);
  }

  Widget _buildProgressBar(int level, ThemeData theme, Animation<double> animation) {
    return Container(
      width: double.infinity,
      height: 6,
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(3),
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerLeft,
        widthFactor: (level / 100) * animation.value,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.colorScheme.primary,
                theme.colorScheme.secondary,
              ],
            ),
            borderRadius: BorderRadius.circular(3),
          ),
        ),
      ),
    );
  }

  Widget _buildSkillsSummary(ThemeData theme, bool isDesktop) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            theme.colorScheme.primary.withOpacity(0.1),
            theme.colorScheme.secondary.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.2),
        ),
      ),
      child: isDesktop ? _buildDesktopSummary(theme) : _buildMobileSummary(theme),
    ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3);
  }

  Widget _buildDesktopSummary(ThemeData theme) {
    return Row(
      children: [
        Expanded(
          flex: 2,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Technical Expertise',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onBackground,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'I specialize in mobile app development with Flutter, creating cross-platform applications that deliver exceptional user experiences. My expertise spans from frontend development to backend integration.',
                style: theme.textTheme.bodyLarge?.copyWith(
                  height: 1.6,
                  color: theme.colorScheme.onBackground.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 40),
        Expanded(
          child: _buildSkillStats(theme),
        ),
      ],
    );
  }

  Widget _buildMobileSummary(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Technical Expertise',
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onBackground,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'I specialize in mobile app development with Flutter, creating cross-platform applications that deliver exceptional user experiences.',
          style: theme.textTheme.bodyLarge?.copyWith(
            height: 1.6,
            color: theme.colorScheme.onBackground.withOpacity(0.8),
          ),
        ),
        const SizedBox(height: 24),
        _buildSkillStats(theme),
      ],
    );
  }

  Widget _buildSkillStats(ThemeData theme) {
    final totalSkills = widget.skills.length;
    final expertSkills = widget.skills.where((s) => s.level >= 80).length;
    final categories = widget.skillCategories.length;
    
    return Column(
      children: [
        _buildStatRow('Total Skills', totalSkills.toString(), theme),
        const SizedBox(height: 12),
        _buildStatRow('Expert Level', expertSkills.toString(), theme),
        const SizedBox(height: 12),
        _buildStatRow('Categories', categories.toString(), theme),
      ],
    );
  }

  Widget _buildStatRow(String label, String value, ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.colorScheme.onBackground.withOpacity(0.7),
          ),
        ),
        Text(
          value,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.primary,
          ),
        ),
      ],
    );
  }

  IconData _getSkillIcon(String skillName) {
    switch (skillName.toLowerCase()) {
      case 'flutter':
        return FontAwesomeIcons.mobile;
      case 'dart':
        return FontAwesomeIcons.code;
      case 'firebase':
        return FontAwesomeIcons.fire;
      case 'rest apis':
        return FontAwesomeIcons.server;
      case 'git':
        return FontAwesomeIcons.gitAlt;
      case 'ui/ux design':
        return FontAwesomeIcons.paintBrush;
      case 'node.js':
        return FontAwesomeIcons.nodeJs;
      case 'mongodb':
        return FontAwesomeIcons.database;
      case 'react native':
        return FontAwesomeIcons.react;
      case 'python':
        return FontAwesomeIcons.python;
      default:
        return FontAwesomeIcons.code;
    }
  }
}