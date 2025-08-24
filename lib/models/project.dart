class Project {
  final String id;
  final String title;
  final String description;
  final List<String> technologies;
  final String? githubUrl;
  final String? liveUrl;
  final String category;
  final bool featured;
  final String? imageUrl;
  final String? assetImagePath;
  final DateTime? createdAt;

  const Project({
    required this.id,
    required this.title,
    required this.description,
    required this.technologies,
    this.githubUrl,
    this.liveUrl,
    required this.category,
    this.featured = false,
    this.imageUrl,
    this.assetImagePath,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'technologies': technologies,
      'imageUrl': imageUrl,
      'githubUrl': githubUrl,
      'liveUrl': liveUrl,
      'featured': featured,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      technologies: List<String>.from(json['technologies']),
      imageUrl: json['imageUrl'],
      githubUrl: json['githubUrl'],
      liveUrl: json['liveUrl'],
      category: json['category'] ?? 'General',
      featured: json['featured'] ?? false,
      assetImagePath: json['assetImagePath'],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }
}