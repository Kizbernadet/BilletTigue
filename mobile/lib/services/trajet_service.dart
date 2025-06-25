import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/trajet_model.dart';

class TrajetService {
  static const String baseUrl = 'http://192.168.8.128:5000/api';

  // Récupérer tous les trajets disponibles
  static Future<List<Trajet>> getAllTrajets({
    String? villeDepart,
    String? villeArrivee,
    String? dateDepart,
    String? statut,
    String? typeVehicule,
    bool? accepteColis,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
      };

      if (villeDepart != null && villeDepart.isNotEmpty) {
        queryParams['villeDepart'] = villeDepart;
      }
      if (villeArrivee != null && villeArrivee.isNotEmpty) {
        queryParams['villeArrivee'] = villeArrivee;
      }
      if (dateDepart != null && dateDepart.isNotEmpty) {
        queryParams['dateDepart'] = dateDepart;
      }
      if (statut != null && statut.isNotEmpty) {
        queryParams['statut'] = statut;
      }
      if (typeVehicule != null && typeVehicule.isNotEmpty) {
        queryParams['typeVehicule'] = typeVehicule;
      }
      if (accepteColis != null) {
        queryParams['accepteColis'] = accepteColis.toString();
      }

      final uri = Uri.parse(
        '$baseUrl/trajets',
      ).replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          final List<dynamic> trajetsData = responseData['data'];
          return trajetsData.map((json) => Trajet.fromJson(json)).toList();
        } else {
          throw Exception(
            responseData['message'] ??
                'Erreur lors de la récupération des trajets',
          );
        }
      } else {
        throw Exception('Erreur HTTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer un trajet par ID
  static Future<Trajet> getTrajetById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/trajets/$id'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          return Trajet.fromJson(responseData['data']);
        } else {
          throw Exception(responseData['message'] ?? 'Trajet non trouvé');
        }
      } else if (response.statusCode == 404) {
        throw Exception('Trajet non trouvé');
      } else {
        throw Exception('Erreur HTTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Créer un nouveau trajet (pour les transporteurs)
  static Future<Trajet> createTrajet(
    Map<String, dynamic> trajetData,
    String token,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/trajets'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(trajetData),
      );

      if (response.statusCode == 201) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          return Trajet.fromJson(responseData['data']);
        } else {
          throw Exception(
            responseData['message'] ?? 'Erreur lors de la création du trajet',
          );
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Erreur lors de la création du trajet',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Mettre à jour un trajet (pour les transporteurs)
  static Future<Trajet> updateTrajet(
    int id,
    Map<String, dynamic> trajetData,
    String token,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/trajets/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(trajetData),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          return Trajet.fromJson(responseData['data']);
        } else {
          throw Exception(
            responseData['message'] ??
                'Erreur lors de la mise à jour du trajet',
          );
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Erreur lors de la mise à jour du trajet',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Supprimer un trajet (pour les transporteurs)
  static Future<void> deleteTrajet(int id, String token) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/trajets/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] != true) {
          throw Exception(
            responseData['message'] ??
                'Erreur lors de la suppression du trajet',
          );
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Erreur lors de la suppression du trajet',
        );
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Récupérer les trajets d'un transporteur
  static Future<List<Trajet>> getTrajetsByTransporteur(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/transporteur/trajets'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          final List<dynamic> trajetsData = responseData['data'];
          return trajetsData.map((json) => Trajet.fromJson(json)).toList();
        } else {
          throw Exception(
            responseData['message'] ??
                'Erreur lors de la récupération des trajets',
          );
        }
      } else {
        throw Exception('Erreur HTTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Rechercher des trajets avec filtres
  static Future<List<Trajet>> searchTrajets({
    required String villeDepart,
    required String villeArrivee,
    DateTime? dateDepart,
    String? typeVehicule,
    bool? accepteColis,
  }) async {
    try {
      final queryParams = <String, String>{
        'villeDepart': villeDepart,
        'villeArrivee': villeArrivee,
      };

      if (dateDepart != null) {
        queryParams['dateDepart'] = dateDepart.toIso8601String();
      }
      if (typeVehicule != null && typeVehicule.isNotEmpty) {
        queryParams['typeVehicule'] = typeVehicule;
      }
      if (accepteColis != null) {
        queryParams['accepteColis'] = accepteColis.toString();
      }

      final uri = Uri.parse(
        '$baseUrl/trajets',
      ).replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          final List<dynamic> trajetsData = responseData['data'];
          return trajetsData.map((json) => Trajet.fromJson(json)).toList();
        } else {
          throw Exception(
            responseData['message'] ?? 'Erreur lors de la recherche',
          );
        }
      } else {
        throw Exception('Erreur HTTP: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erreur de connexion: $e');
    }
  }

  // Obtenir les types de véhicules disponibles
  static List<String> getVehiculeTypes() {
    return ['bus', 'minibus', 'voiture', 'camion'];
  }

  // Obtenir les statuts disponibles
  static List<String> getStatusTypes() {
    return ['actif', 'en_cours', 'terminé', 'annulé'];
  }

  // Valider les données d'un trajet
  static bool validateTrajetData(Map<String, dynamic> data) {
    final requiredFields = [
      'villeDepart',
      'villeArrivee',
      'dateDepart',
      'heureDepart',
      'prix',
      'nombrePlaces',
    ];

    for (final field in requiredFields) {
      if (data[field] == null || data[field].toString().isEmpty) {
        return false;
      }
    }

    // Vérifier que la date de départ est dans le futur
    if (data['dateDepart'] != null) {
      final dateDepart = DateTime.parse(data['dateDepart']);
      if (dateDepart.isBefore(DateTime.now())) {
        return false;
      }
    }

    // Vérifier que le prix est positif
    if (data['prix'] != null) {
      final prix = double.tryParse(data['prix'].toString());
      if (prix == null || prix <= 0) {
        return false;
      }
    }

    // Vérifier que le nombre de places est positif
    if (data['nombrePlaces'] != null) {
      final nombrePlaces = int.tryParse(data['nombrePlaces'].toString());
      if (nombrePlaces == null || nombrePlaces <= 0) {
        return false;
      }
    }

    return true;
  }
}
