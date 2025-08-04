import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactSection extends StatefulWidget {
  const ContactSection({Key? key}) : super(key: key);

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection>
    with TickerProviderStateMixin {
  late AnimationController _formController;
  late AnimationController _socialController;
  
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _subjectController = TextEditingController();
  final _messageController = TextEditingController();
  
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    
    _formController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    
    _socialController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAnimations();
    });
  }
  
  void _startAnimations() {
    _formController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        _socialController.forward();
      }
    });
  }
  
  @override
  void dispose() {
    _formController.dispose();
    _socialController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _subjectController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _launchEmail() async {
    final subject = Uri.encodeComponent('Portfolio Inquiry');
    final body = Uri.encodeComponent('Hello Abdullah,\n\nI would like to discuss...');
    final emailUrl = 'mailto:abdullah.shahid@example.com?subject=$subject&body=$body';
    await _launchUrl(emailUrl);
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() {
      _isSubmitting = true;
    });
    
    // Simulate form submission
    await Future.delayed(const Duration(seconds: 2));
    
    if (mounted) {
      setState(() {
        _isSubmitting = false;
      });
      
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Message sent successfully!'),
          backgroundColor: Theme.of(context).colorScheme.primary,
          behavior: SnackBarBehavior.floating,
        ),
      );
      
      // Clear form
      _nameController.clear();
      _emailController.clear();
      _subjectController.clear();
      _messageController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    
    // Dynamic padding based on screen width
    double horizontalPadding;
    double verticalPadding;
    
    if (screenWidth > 1440) {
      horizontalPadding = 120;
      verticalPadding = 100;
    } else if (screenWidth > 1024) {
      horizontalPadding = 80;
      verticalPadding = 80;
    } else if (screenWidth > 768) {
      horizontalPadding = 60;
      verticalPadding = 70;
    } else if (screenWidth > 480) {
      horizontalPadding = 40;
      verticalPadding = 60;
    } else {
      horizontalPadding = 20;
      verticalPadding = 50;
    }
    
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: verticalPadding,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section title
          _buildSectionTitle(theme),
          
          const SizedBox(height: 60),
          
          // Contact content
          _buildResponsiveLayout(theme, screenWidth),
          
          const SizedBox(height: 60),
          
          // Social links
          _buildSocialLinks(theme),
          
          const SizedBox(height: 40),
          
          // Footer
          _buildFooter(theme),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '05.',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.secondary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 16),
            Text(
              'Get In Touch',
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
        ),
        
        const SizedBox(height: 20),
        
        Text(
          'I\'m always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, I\'ll try my best to get back to you!',
          style: theme.textTheme.bodyLarge?.copyWith(
            height: 1.6,
            color: theme.colorScheme.onBackground.withOpacity(0.7),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.3);
  }

  Widget _buildResponsiveLayout(ThemeData theme, double screenWidth) {
    if (screenWidth > 1024) {
      // Large desktop and desktop layout
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Contact info
          Expanded(
            flex: 1,
            child: _buildContactInfo(theme),
          ),
          
          SizedBox(width: screenWidth > 1440 ? 80 : 60),
          
          // Contact form
          Expanded(
            flex: 2,
            child: _buildContactForm(theme, screenWidth),
          ),
        ],
      );
    } else {
      // Tablet and mobile layout
      return Column(
        children: [
          // Contact info
          _buildContactInfo(theme),
          
          SizedBox(height: screenWidth > 768 ? 50 : 40),
          
          // Contact form
          _buildContactForm(theme, screenWidth),
        ],
      );
    }
  }

  Widget _buildContactInfo(ThemeData theme) {
    final contactItems = [
      {
        'icon': FontAwesomeIcons.envelope,
        'title': 'Email',
        'value': 'abdullahshahid906@gmail.com',
        'action': _launchEmail,
      },
      {
        'icon': FontAwesomeIcons.phone,
        'title': 'Phone',
        'value': '+92 316 5182639',
        'action': () => _launchUrl('tel:+923165182639'),
      },
      {
        'icon': FontAwesomeIcons.mapMarkerAlt,
        'title': 'Location',
        'value': 'Rawalpindi, Pakistan',
        'action': null,
      },
      {
        'icon': FontAwesomeIcons.clock,
        'title': 'Response Time',
        'value': 'Within 1 hour',
        'action': null,
      },
    ];
    
    return AnimatedBuilder(
      animation: _socialController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(-50 * (1 - _socialController.value), 0),
          child: Opacity(
            opacity: _socialController.value,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Contact Information',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onBackground,
                  ),
                ),
                
                const SizedBox(height: 24),
                
                ...contactItems.asMap().entries.map((entry) {
                  final index = entry.key;
                  final item = entry.value;
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: InkWell(
                      onTap: item['action'] as VoidCallback?,
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                item['icon'] as IconData,
                                color: theme.colorScheme.primary,
                                size: 20,
                              ),
                            ),
                            
                            const SizedBox(width: 16),
                            
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['title'] as String,
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      color: theme.colorScheme.onBackground.withOpacity(0.6),
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['value'] as String,
                                    style: theme.textTheme.bodyLarge?.copyWith(
                                      color: theme.colorScheme.onBackground,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            
                            if (item['action'] != null)
                              Icon(
                                FontAwesomeIcons.externalLinkAlt,
                                size: 16,
                                color: theme.colorScheme.primary.withOpacity(0.6),
                              ),
                          ],
                        ),
                      ),
                    ).animate().fadeIn(delay: (300 + index * 100).ms).slideX(begin: -0.3),
                  );
                }).toList(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildContactForm(ThemeData theme, double screenWidth) {
    return AnimatedBuilder(
      animation: _formController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(50 * (1 - _formController.value), 0),
          child: Opacity(
            opacity: _formController.value,
            child: Container(
                padding: EdgeInsets.all(screenWidth > 768 ? 32 : 24),
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
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Send me a message',
                      style: theme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.onBackground,
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Name and Email row - responsive
                    screenWidth > 600
                        ? Row(
                            children: [
                              Expanded(
                                child: _buildTextField(
                                  controller: _nameController,
                                  label: 'Name',
                                  icon: FontAwesomeIcons.user,
                                  validator: (value) {
                                    if (value?.isEmpty ?? true) {
                                      return 'Please enter your name';
                                    }
                                    return null;
                                  },
                                  theme: theme,
                                ),
                              ),
                              
                              const SizedBox(width: 16),
                              
                              Expanded(
                                child: _buildTextField(
                                  controller: _emailController,
                                  label: 'Email',
                                  icon: FontAwesomeIcons.envelope,
                                  keyboardType: TextInputType.emailAddress,
                                  validator: (value) {
                                    if (value?.isEmpty ?? true) {
                                      return 'Please enter your email';
                                    }
                                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                                      return 'Please enter a valid email';
                                    }
                                    return null;
                                  },
                                  theme: theme,
                                ),
                              ),
                            ],
                          )
                        : Column(
                            children: [
                              _buildTextField(
                                controller: _nameController,
                                label: 'Name',
                                icon: FontAwesomeIcons.user,
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Please enter your name';
                                  }
                                  return null;
                                },
                                theme: theme,
                              ),
                              
                              const SizedBox(height: 16),
                              
                              _buildTextField(
                                controller: _emailController,
                                label: 'Email',
                                icon: FontAwesomeIcons.envelope,
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Please enter your email';
                                  }
                                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                                    return 'Please enter a valid email';
                                  }
                                  return null;
                                },
                                theme: theme,
                              ),
                            ],
                          ),
                    
                    const SizedBox(height: 24),
                    
                    // Subject
                    _buildTextField(
                      controller: _subjectController,
                      label: 'Subject',
                      icon: FontAwesomeIcons.tag,
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Please enter a subject';
                        }
                        return null;
                      },
                      theme: theme,
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Message
                    _buildTextField(
                      controller: _messageController,
                      label: 'Message',
                      icon: FontAwesomeIcons.comment,
                      maxLines: 5,
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Please enter your message';
                        }
                        if (value!.length < 10) {
                          return 'Message must be at least 10 characters';
                        }
                        return null;
                      },
                      theme: theme,
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Submit button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _submitForm,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: _isSubmitting
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        theme.colorScheme.onPrimary,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Text('Sending...'),
                                ],
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(FontAwesomeIcons.paperPlane, size: 16),
                                  const SizedBox(width: 8),
                                  const Text('Send Message'),
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
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required ThemeData theme,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      keyboardType: keyboardType,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.primary,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: theme.colorScheme.error,
          ),
        ),
        filled: true,
        fillColor: theme.colorScheme.surface,
      ),
    );
  }

  Widget _buildSocialLinks(ThemeData theme) {
    final socialLinks = [
      {
        'icon': FontAwesomeIcons.github,
        'label': 'GitHub',
        'url': 'https://github.com/Abdullah-1360',
      },
      {
        'icon': FontAwesomeIcons.linkedin,
        'label': 'LinkedIn',
        'url': 'https://www.linkedin.com/in/abdullah-shahid-ba978b221/',
      },
      {
        'icon': FontAwesomeIcons.twitter,
        'label': 'Twitter',
        'url': 'https://twitter.com/',
      },
      {
        'icon': FontAwesomeIcons.instagram,
        'label': 'Instagram',
        'url': 'https://instagram.com/abdull1h',
      },
    ];
    
    return Column(
      children: [
        Text(
          'Connect with me',
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onBackground,
          ),
        ),
        
        const SizedBox(height: 24),
        
        _buildResponsiveSocialLinks(theme, socialLinks),
      ],
    ).animate().fadeIn(delay: 700.ms);
  }

  Widget _buildResponsiveSocialLinks(ThemeData theme, List<Map<String, dynamic>> socialLinks) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    // Adjust icon size and spacing based on screen width
    double iconSize = screenWidth > 768 ? 60 : (screenWidth > 480 ? 50 : 45);
    double iconPadding = screenWidth > 768 ? 12 : (screenWidth > 480 ? 10 : 8);
    double iconInnerSize = screenWidth > 768 ? 24 : (screenWidth > 480 ? 20 : 18);
    
    return Wrap(
      alignment: WrapAlignment.center,
      spacing: iconPadding,
      runSpacing: iconPadding,
      children: socialLinks.asMap().entries.map((entry) {
        final index = entry.key;
        final social = entry.value;
        
        return InkWell(
          onTap: () => _launchUrl(social['url'] as String),
          borderRadius: BorderRadius.circular(50),
          child: Container(
            width: iconSize,
            height: iconSize,
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(
                color: theme.colorScheme.primary.withOpacity(0.3),
              ),
            ),
            child: Icon(
              social['icon'] as IconData,
              color: theme.colorScheme.primary,
              size: iconInnerSize,
            ),
          ),
        ).animate().fadeIn(delay: (800 + index * 100).ms).scale(begin: const Offset(0.5, 0.5));
      }).toList(),
    );
  }

  Widget _buildFooter(ThemeData theme) {
    return Center(
      child: Column(
        children: [
          Container(
            width: 100,
            height: 1,
            color: theme.colorScheme.primary.withOpacity(0.3),
          ),
          
          const SizedBox(height: 20),
          
          Text(
            '© 2024 Abdullah Shahid. Built with Flutter.',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onBackground.withOpacity(0.6),
            ),
          ),
          
          const SizedBox(height: 8),
          
          Text(
            'Designed & Developed with ❤️',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onBackground.withOpacity(0.6),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 1000.ms);
  }
}