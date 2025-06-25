class Trajet {
  final int? idTrajet;
  final int idCompte;
  final String villeDepart;
  final String villeArrivee;
  final DateTime dateDepart;
  final String heureDepart;
  final double prix;
  final int nombrePlaces;
  final int placesDisponibles;
  final String? description;
  final String typeVehicule;
  final String statut;
  final bool accepteColis;
  final double? poidsMaxColis;
  final double? prixColis;
  final String? pointDepart;
  final String? pointArrivee;
  final String? conditions;
  final DateTime? dateCreation;
  final DateTime? dateModification;

  Trajet({
    this.idTrajet,
    required this.idCompte,
    required this.villeDepart,
    required this.villeArrivee,
    required this.dateDepart,
    required this.heureDepart,
    required this.prix,
    required this.nombrePlaces,
    required this.placesDisponibles,
    this.description,
    required this.typeVehicule,
    required this.statut,
    required this.accepteColis,
    this.poidsMaxColis,
    this.prixColis,
    this.pointDepart,
    this.pointArrivee,
    this.conditions,
    this.dateCreation,
    this.dateModification,
  });

  factory Trajet.fromJson(Map<String, dynamic> json) {
    return Trajet(
      idTrajet: json['idTrajet'],
      idCompte: json['idCompte'],
      villeDepart: json['villeDepart'],
      villeArrivee: json['villeArrivee'],
      dateDepart: DateTime.parse(json['dateDepart']),
      heureDepart: json['heureDepart'],
      prix: double.parse(json['prix'].toString()),
      nombrePlaces: json['nombrePlaces'],
      placesDisponibles: json['placesDisponibles'],
      description: json['description'],
      typeVehicule: json['typeVehicule'],
      statut: json['statut'],
      accepteColis: json['accepteColis'],
      poidsMaxColis:
          json['poidsMaxColis'] != null
              ? double.parse(json['poidsMaxColis'].toString())
              : null,
      prixColis:
          json['prixColis'] != null
              ? double.parse(json['prixColis'].toString())
              : null,
      pointDepart: json['pointDepart'],
      pointArrivee: json['pointArrivee'],
      conditions: json['conditions'],
      dateCreation:
          json['dateCreation'] != null
              ? DateTime.parse(json['dateCreation'])
              : null,
      dateModification:
          json['dateModification'] != null
              ? DateTime.parse(json['dateModification'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idTrajet': idTrajet,
      'idCompte': idCompte,
      'villeDepart': villeDepart,
      'villeArrivee': villeArrivee,
      'dateDepart': dateDepart.toIso8601String(),
      'heureDepart': heureDepart,
      'prix': prix,
      'nombrePlaces': nombrePlaces,
      'placesDisponibles': placesDisponibles,
      'description': description,
      'typeVehicule': typeVehicule,
      'statut': statut,
      'accepteColis': accepteColis,
      'poidsMaxColis': poidsMaxColis,
      'prixColis': prixColis,
      'pointDepart': pointDepart,
      'pointArrivee': pointArrivee,
      'conditions': conditions,
      'dateCreation': dateCreation?.toIso8601String(),
      'dateModification': dateModification?.toIso8601String(),
    };
  }

  Trajet copyWith({
    int? idTrajet,
    int? idCompte,
    String? villeDepart,
    String? villeArrivee,
    DateTime? dateDepart,
    String? heureDepart,
    double? prix,
    int? nombrePlaces,
    int? placesDisponibles,
    String? description,
    String? typeVehicule,
    String? statut,
    bool? accepteColis,
    double? poidsMaxColis,
    double? prixColis,
    String? pointDepart,
    String? pointArrivee,
    String? conditions,
    DateTime? dateCreation,
    DateTime? dateModification,
  }) {
    return Trajet(
      idTrajet: idTrajet ?? this.idTrajet,
      idCompte: idCompte ?? this.idCompte,
      villeDepart: villeDepart ?? this.villeDepart,
      villeArrivee: villeArrivee ?? this.villeArrivee,
      dateDepart: dateDepart ?? this.dateDepart,
      heureDepart: heureDepart ?? this.heureDepart,
      prix: prix ?? this.prix,
      nombrePlaces: nombrePlaces ?? this.nombrePlaces,
      placesDisponibles: placesDisponibles ?? this.placesDisponibles,
      description: description ?? this.description,
      typeVehicule: typeVehicule ?? this.typeVehicule,
      statut: statut ?? this.statut,
      accepteColis: accepteColis ?? this.accepteColis,
      poidsMaxColis: poidsMaxColis ?? this.poidsMaxColis,
      prixColis: prixColis ?? this.prixColis,
      pointDepart: pointDepart ?? this.pointDepart,
      pointArrivee: pointArrivee ?? this.pointArrivee,
      conditions: conditions ?? this.conditions,
      dateCreation: dateCreation ?? this.dateCreation,
      dateModification: dateModification ?? this.dateModification,
    );
  }

  // Méthodes utilitaires
  String get formattedDate {
    return '${dateDepart.day.toString().padLeft(2, '0')}/${dateDepart.month.toString().padLeft(2, '0')}/${dateDepart.year}';
  }

  String get formattedTime {
    return heureDepart;
  }

  String get vehiculeTypeText {
    switch (typeVehicule) {
      case 'bus':
        return 'Bus';
      case 'minibus':
        return 'Minibus';
      case 'voiture':
        return 'Voiture';
      case 'camion':
        return 'Camion';
      default:
        return typeVehicule;
    }
  }

  String get statusText {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'en_cours':
        return 'En cours';
      case 'terminé':
        return 'Terminé';
      case 'annulé':
        return 'Annulé';
      default:
        return statut;
    }
  }

  bool get isActive => statut == 'actif';
  bool get hasAvailablePlaces => placesDisponibles > 0;
  bool get acceptsPackages => accepteColis;

  @override
  String toString() {
    return 'Trajet(idTrajet: $idTrajet, villeDepart: $villeDepart, villeArrivee: $villeArrivee, dateDepart: $dateDepart, prix: $prix)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Trajet && other.idTrajet == idTrajet;
  }

  @override
  int get hashCode {
    return idTrajet.hashCode;
  }
}
