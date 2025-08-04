class Experience {
  final String id;
  final String title;
  final String company;
  final String location;
  final DateTime startDate;
  final DateTime? endDate;
  final String description;
  final List<String> responsibilities;
  final List<String> technologies;
  final String? companyLogo;

  Experience({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.startDate,
    this.endDate,
    required this.description,
    required this.responsibilities,
    required this.technologies,
    this.companyLogo,
  });

  bool get isCurrent => endDate == null;

  String get duration {
    final start = '${_getMonthName(startDate.month)} ${startDate.year}';
    final end = endDate != null 
        ? '${_getMonthName(endDate!.month)} ${endDate!.year}'
        : 'Present';
    return '$start - $end';
  }

  String get durationInMonths {
    final endDateTime = endDate ?? DateTime.now();
    final difference = endDateTime.difference(startDate);
    final months = (difference.inDays / 30).round();
    
    if (months < 12) {
      return '$months month${months != 1 ? 's' : ''}';
    } else {
      final years = (months / 12).floor();
      final remainingMonths = months % 12;
      String result = '$years year${years != 1 ? 's' : ''}';
      if (remainingMonths > 0) {
        result += ' $remainingMonths month${remainingMonths != 1 ? 's' : ''}';
      }
      return result;
    }
  }

  String _getMonthName(int month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'company': company,
      'location': location,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'description': description,
      'responsibilities': responsibilities,
      'technologies': technologies,
      'companyLogo': companyLogo,
    };
  }

  factory Experience.fromJson(Map<String, dynamic> json) {
    return Experience(
      id: json['id'],
      title: json['title'],
      company: json['company'],
      location: json['location'],
      startDate: DateTime.parse(json['startDate']),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      description: json['description'],
      responsibilities: List<String>.from(json['responsibilities']),
      technologies: List<String>.from(json['technologies']),
      companyLogo: json['companyLogo'],
    );
  }
}