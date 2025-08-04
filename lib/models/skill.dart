class Skill {
  final String name;
  final int level; // 0-100
  final String category;
  final String? icon;
  final String? description;

  Skill({
    required this.name,
    required this.level,
    required this.category,
    this.icon,
    this.description,
  });

  String get proficiencyLevel {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    if (level >= 40) return 'Beginner';
    return 'Novice';
  }

  double get normalizedLevel => level / 100.0;

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'level': level,
      'category': category,
      'icon': icon,
      'description': description,
    };
  }

  factory Skill.fromJson(Map<String, dynamic> json) {
    return Skill(
      name: json['name'],
      level: json['level'],
      category: json['category'],
      icon: json['icon'],
      description: json['description'],
    );
  }
}