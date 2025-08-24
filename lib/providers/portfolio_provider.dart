import 'package:flutter/material.dart';
import '../models/project.dart';
import '../models/experience.dart';
import '../models/skill.dart';

class PortfolioProvider extends ChangeNotifier {
  bool _isLoading = false;
  String _selectedSection = 'home';
  
  bool get isLoading => _isLoading;
  String get selectedSection => _selectedSection;

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void setSelectedSection(String section) {
    _selectedSection = section;
    notifyListeners();
  }

  // Personal Information
  final Map<String, String> personalInfo = {
    'name': 'Abdullah Shahid',
    'title': 'Flutter Developer',
    'email': 'abdullahshahid1360@gmail.com',
    'phone': '+92 300 1234567',
    'location': 'Pakistan',
    'github': 'https://github.com/Abdullah-1360',
    'linkedin': 'https://www.linkedin.com/in/abdullah-shahid-ba978b221',
    'bio': 'Passionate Flutter developer with expertise in mobile app development, UI/UX design, and cross-platform solutions. Experienced in creating beautiful, performant applications with modern design principles.',
  };

  // Skills
  final List<Skill> skills = [
    Skill(name: 'Flutter', level: 90, category: 'Mobile Development'),
    Skill(name: 'Dart', level: 90, category: 'Programming Languages'),
    Skill(name: 'Firebase', level: 85, category: 'Backend Services'),
    Skill(name: 'REST APIs', level: 85, category: 'Backend Integration'),
    Skill(name: 'Git', level: 80, category: 'Version Control'),
    Skill(name: 'UI/UX Design', level: 75, category: 'Design'),
    Skill(name: 'Node.js', level: 70, category: 'Backend Development'),
    Skill(name: 'MongoDB', level: 70, category: 'Databases'),
    Skill(name: 'React Native', level: 65, category: 'Mobile Development'),
    Skill(name: 'Python', level: 60, category: 'Programming Languages'),
  ];

  // Projects
  final List<Project> projects = [
    Project(
      id: '1',
      title: 'Spotify Clone',
      description: 'A full-featured e-commerce mobile application built with Flutter, featuring user authentication, product catalog, shopping cart, and payment integration.',
      technologies: ['Flutter', 'FastAPI', 'Python', 'Riverpod'],
      category: 'Mobile Development',
      imageUrl: 'assets/images/ecommerce_app.png',
      githubUrl: 'https://github.com/Abdullah-1360/Spotify-clone',
      liveUrl: null,
      featured: true,
    ),
    Project(
      id: '2',
      title: 'Task Management App',
      description: 'A productivity app for task management with features like task creation, categorization, reminders, and progress tracking.',
      technologies: ['Flutter', 'SQLite', 'Provider', 'Local Notifications'],
      category: 'Mobile Development',
      imageUrl: 'assets/images/task_app.png',
      githubUrl: 'https://github.com/Abdullah-1360/task-manager',
      liveUrl: null,
      featured: true,
    ),
    Project(
      id: '3',
      title: 'Weather App',
      description: 'A beautiful weather application with real-time weather data, forecasts, and location-based services.',
      technologies: ['Flutter', 'OpenWeather API', 'Geolocator', 'Bloc'],
      category: 'Mobile Development',
      imageUrl: 'assets/images/weather_app.png',
      githubUrl: 'https://github.com/Abdullah-1360/weather-app',
      liveUrl: null,
      featured: false,
    ),
    Project(
      id: '4',
      title: 'Social Media App',
      description: 'A social networking app with features like posting, commenting, liking, and real-time messaging.',
      technologies: ['Flutter', 'Firebase', 'Cloud Firestore', 'Firebase Auth'],
      category: 'Mobile Development',
      imageUrl: 'assets/images/social_app.png',
      githubUrl: 'https://github.com/Abdullah-1360/social-app',
      liveUrl: null,
      featured: true,
    ),
  ];

  // Experience
  final List<Experience> experiences = [
    Experience(
      id: '1',
      title: 'Flutter Developer',
      company: 'Freelance',
      location: 'Remote',
      startDate: DateTime(2024, 5),
      endDate: DateTime.now(),
      description: 'Developing cross-platform mobile applications using Flutter framework. Working on multiple client projects with focus on performance optimization and user experience.',
      responsibilities: [
        'Developed cross-platform mobile applications using Flutter',
        'Optimized app performance and improved user experience',
        'Collaborated with design team to implement UI/UX requirements',
        'Integrated REST APIs and Firebase services',
        'Conducted code reviews and maintained code quality'
      ],
      technologies: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    ),
    Experience(
      id: '2',
      title: 'Mobile App Developer Intern',
      company: 'K-Soft',
      location: 'Pakistan',
      startDate: DateTime(2024, 6),
      endDate: DateTime(2024, 9),
      description: 'Worked on mobile app development. Gained experience in full-stack development and agile methodologies.',
      responsibilities: [
        'Developed mobile applications using Flutter framework',
        'Built backend services with Node.js and Express.js',
        'Worked with MongoDB for data management',
        'Participated in agile development processes',
        'Collaborated with senior developers on code reviews'
      ],
      technologies: ['Flutter', 'Node.js', 'MongoDB', 'Express.js'],
    ),
  ];

  List<Project> get featuredProjects => projects.where((p) => p.featured).toList();
  
  List<Skill> getSkillsByCategory(String category) {
    return skills.where((skill) => skill.category == category).toList();
  }
  
  List<String> get skillCategories {
    return skills.map((skill) => skill.category).toSet().toList();
  }
}