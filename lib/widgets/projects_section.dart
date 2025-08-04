import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/project.dart';

class ProjectsSection extends StatefulWidget {
  final List<Project> projects;
  final List<Project> featuredProjects;

  const ProjectsSection({
    Key? key,
    required this.projects,
    required this.featuredProjects,
  }) : super(key: key);

  @override
  State<ProjectsSection> createState() => _ProjectsSectionState();
}

class _ProjectsSectionState extends State<ProjectsSection>
    with TickerProviderStateMixin {
  late AnimationController _filterController;
  late List<AnimationController> _cardControllers;
  String _selectedFilter = 'All';
  bool _showFeaturedOnly = false;

  @override
  void initState() {
    super.initState();
    
    _filterController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    
    _cardControllers = List.generate(
      widget.projects.length,
      (index) => AnimationController(
        duration: Duration(milliseconds: 800 + (index * 100)),
        vsync: this,
      ),
    );
    
    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAnimations();
    });
  }
  
  void _startAnimations() {
    for (int i = 0; i < _cardControllers.length; i++) {
      Future.delayed(Duration(milliseconds: i * 150), () {
        if (mounted) {
          _cardControllers[i].forward();
        }
      });
    }
  }
  
  @override
  void dispose() {
    _filterController.dispose();
    for (final controller in _cardControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  List<Project> get _filteredProjects {
    List<Project> projects = _showFeaturedOnly ? widget.featuredProjects : widget.projects;
    
    if (_selectedFilter == 'All') {
      return projects;
    }
    
    return projects.where((project) {
      return project.technologies.any((tech) => 
        tech.toLowerCase().contains(_selectedFilter.toLowerCase()));
    }).toList();
  }

  Set<String> get _availableFilters {
    final filters = <String>{'All'};
    for (final project in widget.projects) {
      filters.addAll(project.technologies);
    }
    return filters;
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
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
          
          // Filter controls
          _buildFilterControls(theme, isDesktop),
          
          const SizedBox(height: 40),
          
          // Projects grid
          _buildProjectsGrid(theme, screenWidth, isDesktop, isMobile),
          
          const SizedBox(height: 60),
          
          // View all projects button
          _buildViewAllButton(theme),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme) {
    return Row(
      children: [
        Text(
          '03.',
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.secondary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 16),
        Text(
          'Featured Projects',
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

  Widget _buildFilterControls(ThemeData theme, bool isDesktop) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Featured toggle
        Row(
          children: [
            Text(
              'Show Featured Only',
              style: theme.textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w500,
                color: theme.colorScheme.onBackground,
              ),
            ),
            const SizedBox(width: 16),
            Switch(
              value: _showFeaturedOnly,
              onChanged: (value) {
                setState(() {
                  _showFeaturedOnly = value;
                });
              },
              activeColor: theme.colorScheme.primary,
            ),
          ],
        ),
        
        const SizedBox(height: 20),
        
        // Technology filters
        Container(
          width: double.infinity,
          child: isDesktop
              ? Row(
                  children: _availableFilters.take(6).map((filter) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: _buildFilterChip(filter, theme),
                    );
                  }).toList(),
                )
              : Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _availableFilters.map((filter) {
                    return _buildFilterChip(filter, theme);
                  }).toList(),
                ),
        ),
      ],
    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.3);
  }

  Widget _buildFilterChip(String filter, ThemeData theme) {
    final isSelected = _selectedFilter == filter;
    
    return InkWell(
      onTap: () {
        setState(() {
          _selectedFilter = filter;
        });
      },
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary
              : theme.colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: theme.colorScheme.primary,
            width: isSelected ? 0 : 1,
          ),
        ),
        child: Text(
          filter,
          style: theme.textTheme.bodySmall?.copyWith(
            color: isSelected
                ? theme.colorScheme.onPrimary
                : theme.colorScheme.primary,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildProjectsGrid(ThemeData theme, double screenWidth, bool isDesktop, bool isMobile) {
    final projects = _filteredProjects;
    
    if (projects.isEmpty) {
      return _buildEmptyState(theme);
    }
    
    // Dynamic grid configuration based on screen width
    int crossAxisCount;
    double childAspectRatio;
    double spacing;
    
    if (screenWidth > 1440) {
      crossAxisCount = 3;
      childAspectRatio = 1.2;
      spacing = 32;
    } else if (screenWidth > 1024) {
      crossAxisCount = 2;
      childAspectRatio = 1.3;
      spacing = 24;
    } else if (screenWidth > 768) {
      crossAxisCount = 2;
      childAspectRatio = 1.1;
      spacing = 20;
    } else if (screenWidth > 480) {
      crossAxisCount = 1;
      childAspectRatio = 1.0;
      spacing = 20;
    } else {
      crossAxisCount = 1;
      childAspectRatio = 0.8;
      spacing = 16;
    }
    
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: spacing,
        mainAxisSpacing: spacing,
        childAspectRatio: childAspectRatio,
      ),
      itemCount: projects.length,
      itemBuilder: (context, index) {
        final project = projects[index];
        final originalIndex = widget.projects.indexOf(project);
        
        return _buildProjectCard(
          project,
          theme,
          originalIndex < _cardControllers.length
              ? _cardControllers[originalIndex]
              : _cardControllers.first,
          index,
        );
      },
    ).animate().fadeIn(delay: 500.ms);
  }

  Widget _buildEmptyState(ThemeData theme) {
    return Container(
      height: 300,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              FontAwesomeIcons.folderOpen,
              size: 64,
              color: theme.colorScheme.primary.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No projects found',
              style: theme.textTheme.titleLarge?.copyWith(
                color: theme.colorScheme.onBackground.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onBackground.withOpacity(0.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectCard(Project project, ThemeData theme, AnimationController controller, int index) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, 50 * (1 - controller.value)),
          child: Opacity(
            opacity: controller.value,
            child: Container(
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                ),
                boxShadow: [
                  BoxShadow(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Project image
                    _buildProjectImage(project, theme),
                    
                    // Project content
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Project title and featured badge
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    project.title,
                                    style: theme.textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: theme.colorScheme.onBackground,
                                    ),
                                  ),
                                ),
                                if (project.featured)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: theme.colorScheme.secondary,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      'Featured',
                                      style: theme.textTheme.bodySmall?.copyWith(
                                        color: theme.colorScheme.onSecondary,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            
                            const SizedBox(height: 12),
                            
                            // Project description
                            Expanded(
                              child: Text(
                                project.description,
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  height: 1.5,
                                  color: theme.colorScheme.onBackground.withOpacity(0.7),
                                ),
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            
                            const SizedBox(height: 16),
                            
                            // Technologies
                            _buildTechnologies(project.technologies, theme),
                            
                            const SizedBox(height: 20),
                            
                            // Action buttons
                            _buildProjectActions(project, theme),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    ).animate().fadeIn(delay: (500 + index * 150).ms);
  }

  Widget _buildProjectImage(Project project, ThemeData theme) {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            theme.colorScheme.primary.withOpacity(0.3),
            theme.colorScheme.secondary.withOpacity(0.3),
          ],
        ),
      ),
      child: Stack(
        children: [
          // Placeholder for project image
          Center(
            child: Icon(
              FontAwesomeIcons.mobileAlt,
              size: 64,
              color: theme.colorScheme.onPrimary.withOpacity(0.7),
            ),
          ),
          
          // Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withOpacity(0.3),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTechnologies(List<String> technologies, ThemeData theme) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: technologies.take(4).map((tech) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
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
    );
  }

  Widget _buildProjectActions(Project project, ThemeData theme) {
    return Row(
      children: [
        if (project.githubUrl != null)
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () => _launchUrl(project.githubUrl!),
              icon: const Icon(FontAwesomeIcons.github, size: 16),
              label: const Text('Code'),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: theme.colorScheme.primary),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        
        if (project.githubUrl != null && project.liveUrl != null)
          const SizedBox(width: 12),
        
        if (project.liveUrl != null)
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () => _launchUrl(project.liveUrl!),
              icon: const Icon(FontAwesomeIcons.externalLinkAlt, size: 16),
              label: const Text('Live'),
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildViewAllButton(ThemeData theme) {
    return Center(
      child: OutlinedButton.icon(
        onPressed: () {
          // TODO: Navigate to projects page
        },
        icon: const Icon(FontAwesomeIcons.folderOpen),
        label: const Text('View All Projects'),
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          side: BorderSide(color: theme.colorScheme.primary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
        ),
      ),
    ).animate().fadeIn(delay: 1000.ms).scale(begin: const Offset(0.8, 0.8));
  }
}