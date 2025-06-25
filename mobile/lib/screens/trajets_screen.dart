import 'package:flutter/material.dart';
import '../models/trajet_model.dart';
import '../services/trajet_service.dart';
import '../utils/colors.dart';
import '../widgets/custom_button.dart';

class TrajetsScreen extends StatefulWidget {
  const TrajetsScreen({super.key});

  @override
  State<TrajetsScreen> createState() => _TrajetsScreenState();
}

class _TrajetsScreenState extends State<TrajetsScreen> {
  List<Trajet> _trajets = [];
  List<Trajet> _filteredTrajets = [];
  bool _isLoading = false;
  String _errorMessage = '';

  // Contrôleurs pour les filtres
  final TextEditingController _villeDepartController = TextEditingController();
  final TextEditingController _villeArriveeController = TextEditingController();
  DateTime? _selectedDate;
  String? _selectedVehicule;
  bool? _accepteColis;

  @override
  void initState() {
    super.initState();
    _loadTrajets();
  }

  @override
  void dispose() {
    _villeDepartController.dispose();
    _villeArriveeController.dispose();
    super.dispose();
  }

  Future<void> _loadTrajets() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final trajets = await TrajetService.getAllTrajets();
      setState(() {
        _trajets = trajets;
        _filteredTrajets = trajets;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  void _applyFilters() {
    setState(() {
      _filteredTrajets =
          _trajets.where((trajet) {
            // Filtre par ville de départ
            if (_villeDepartController.text.isNotEmpty) {
              if (!trajet.villeDepart.toLowerCase().contains(
                _villeDepartController.text.toLowerCase(),
              )) {
                return false;
              }
            }

            // Filtre par ville d'arrivée
            if (_villeArriveeController.text.isNotEmpty) {
              if (!trajet.villeArrivee.toLowerCase().contains(
                _villeArriveeController.text.toLowerCase(),
              )) {
                return false;
              }
            }

            // Filtre par date
            if (_selectedDate != null) {
              final trajetDate = DateTime(
                trajet.dateDepart.year,
                trajet.dateDepart.month,
                trajet.dateDepart.day,
              );
              final selectedDate = DateTime(
                _selectedDate!.year,
                _selectedDate!.month,
                _selectedDate!.day,
              );
              if (trajetDate != selectedDate) {
                return false;
              }
            }

            // Filtre par type de véhicule
            if (_selectedVehicule != null && _selectedVehicule!.isNotEmpty) {
              if (trajet.typeVehicule != _selectedVehicule) {
                return false;
              }
            }

            // Filtre par acceptation de colis
            if (_accepteColis != null) {
              if (trajet.accepteColis != _accepteColis) {
                return false;
              }
            }

            return true;
          }).toList();
    });
  }

  void _clearFilters() {
    setState(() {
      _villeDepartController.clear();
      _villeArriveeController.clear();
      _selectedDate = null;
      _selectedVehicule = null;
      _accepteColis = null;
      _filteredTrajets = _trajets;
    });
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      _applyFilters();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Rechercher des trajets',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _loadTrajets,
          ),
        ],
      ),
      body: Column(
        children: [
          // Section des filtres
          _buildFiltersSection(),

          // Section des résultats
          Expanded(child: _buildResultsSection()),
        ],
      ),
    );
  }

  Widget _buildFiltersSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Filtres de recherche',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 16),

          // Villes
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _villeDepartController,
                  decoration: const InputDecoration(
                    labelText: 'Ville de départ',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.location_on_outlined),
                  ),
                  onChanged: (value) => _applyFilters(),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _villeArriveeController,
                  decoration: const InputDecoration(
                    labelText: 'Ville d\'arrivée',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.location_on),
                  ),
                  onChanged: (value) => _applyFilters(),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Date et véhicule
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: _selectDate,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 16,
                    ),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.calendar_today,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _selectedDate != null
                              ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                              : 'Sélectionner une date',
                          style: TextStyle(
                            color:
                                _selectedDate != null
                                    ? Colors.black
                                    : Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedVehicule,
                  decoration: const InputDecoration(
                    labelText: 'Type de véhicule',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.directions_bus),
                  ),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Tous')),
                    ...TrajetService.getVehiculeTypes().map(
                      (type) => DropdownMenuItem(
                        value: type,
                        child: Text(_getVehiculeDisplayName(type)),
                      ),
                    ),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedVehicule = value;
                    });
                    _applyFilters();
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Options de colis
          Row(
            children: [
              const Text('Accepte les colis:'),
              const SizedBox(width: 16),
              ChoiceChip(
                label: const Text('Oui'),
                selected: _accepteColis == true,
                onSelected: (selected) {
                  setState(() {
                    _accepteColis = selected ? true : null;
                  });
                  _applyFilters();
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Non'),
                selected: _accepteColis == false,
                onSelected: (selected) {
                  setState(() {
                    _accepteColis = selected ? false : null;
                  });
                  _applyFilters();
                },
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Boutons d'action
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: 'Effacer les filtres',
                  onPressed: _clearFilters,
                  backgroundColor: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildResultsSection() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (_errorMessage.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Erreur: $_errorMessage',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.red),
            ),
            const SizedBox(height: 16),
            CustomButton(text: 'Réessayer', onPressed: _loadTrajets),
          ],
        ),
      );
    }

    if (_filteredTrajets.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.search_off, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            const Text(
              'Aucun trajet trouvé',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Essayez de modifier vos critères de recherche',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filteredTrajets.length,
      itemBuilder: (context, index) {
        final trajet = _filteredTrajets[index];
        return _buildTrajetCard(trajet);
      },
    );
  }

  Widget _buildTrajetCard(Trajet trajet) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // En-tête avec route et statut
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${trajet.villeDepart} → ${trajet.villeArrivee}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(
                            Icons.calendar_today,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${trajet.formattedDate} à ${trajet.formattedTime}',
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(trajet.statut),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    trajet.statusText,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Détails du trajet
            Row(
              children: [
                Expanded(
                  child: _buildDetailItem(
                    icon: Icons.attach_money,
                    label: 'Prix',
                    value: '${trajet.prix} FCFA',
                  ),
                ),
                Expanded(
                  child: _buildDetailItem(
                    icon: Icons.airline_seat_recline_normal,
                    label: 'Places',
                    value: '${trajet.placesDisponibles}/${trajet.nombrePlaces}',
                  ),
                ),
                Expanded(
                  child: _buildDetailItem(
                    icon: Icons.directions_bus,
                    label: 'Véhicule',
                    value: trajet.vehiculeTypeText,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Options de colis
            if (trajet.accepteColis) ...[
              Row(
                children: [
                  const Icon(Icons.inventory, size: 16, color: Colors.green),
                  const SizedBox(width: 4),
                  const Text(
                    'Colis acceptés',
                    style: TextStyle(
                      color: Colors.green,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (trajet.prixColis != null) ...[
                    const SizedBox(width: 8),
                    Text(
                      '(${trajet.prixColis} FCFA)',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 12),
            ],

            // Description
            if (trajet.description != null &&
                trajet.description!.isNotEmpty) ...[
              Text(
                trajet.description!,
                style: const TextStyle(color: Colors.grey),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),
            ],

            // Bouton de réservation
            if (trajet.isActive && trajet.hasAvailablePlaces)
              SizedBox(
                width: double.infinity,
                child: CustomButton(
                  text: 'Réserver une place',
                  onPressed: () => _showTrajetDetails(trajet),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Column(
      children: [
        Icon(icon, size: 20, color: AppColors.primary),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        Text(
          value,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  void _showTrajetDetails(Trajet trajet) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildTrajetDetailsSheet(trajet),
    );
  }

  Widget _buildTrajetDetailsSheet(Trajet trajet) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Poignée
          Container(
            margin: const EdgeInsets.only(top: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Titre
                  Text(
                    '${trajet.villeDepart} → ${trajet.villeArrivee}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Informations principales
                  _buildDetailRow('Date de départ', trajet.formattedDate),
                  _buildDetailRow('Heure de départ', trajet.formattedTime),
                  _buildDetailRow('Prix', '${trajet.prix} FCFA'),
                  _buildDetailRow(
                    'Places disponibles',
                    '${trajet.placesDisponibles}/${trajet.nombrePlaces}',
                  ),
                  _buildDetailRow('Type de véhicule', trajet.vehiculeTypeText),
                  _buildDetailRow('Statut', trajet.statusText),

                  if (trajet.pointDepart != null &&
                      trajet.pointDepart!.isNotEmpty)
                    _buildDetailRow('Point de départ', trajet.pointDepart!),
                  if (trajet.pointArrivee != null &&
                      trajet.pointArrivee!.isNotEmpty)
                    _buildDetailRow('Point d\'arrivée', trajet.pointArrivee!),

                  // Options de colis
                  if (trajet.accepteColis) ...[
                    const SizedBox(height: 16),
                    const Text(
                      'Options de colis',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildDetailRow('Accepte les colis', 'Oui'),
                    if (trajet.poidsMaxColis != null)
                      _buildDetailRow(
                        'Poids maximum',
                        '${trajet.poidsMaxColis} kg',
                      ),
                    if (trajet.prixColis != null)
                      _buildDetailRow(
                        'Prix par colis',
                        '${trajet.prixColis} FCFA',
                      ),
                  ],

                  // Description
                  if (trajet.description != null &&
                      trajet.description!.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      trajet.description!,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],

                  // Conditions
                  if (trajet.conditions != null &&
                      trajet.conditions!.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Text(
                      'Conditions spéciales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      trajet.conditions!,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],

                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),

          // Bouton de réservation
          if (trajet.isActive && trajet.hasAvailablePlaces)
            Padding(
              padding: const EdgeInsets.all(20),
              child: CustomButton(
                text: 'Réserver une place',
                onPressed: () {
                  Navigator.pop(context);
                  // TODO: Implémenter la logique de réservation
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Fonctionnalité de réservation à implémenter',
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  String _getVehiculeDisplayName(String type) {
    switch (type) {
      case 'bus':
        return 'Bus';
      case 'minibus':
        return 'Minibus';
      case 'voiture':
        return 'Voiture';
      case 'camion':
        return 'Camion';
      default:
        return type;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'actif':
        return Colors.green;
      case 'en_cours':
        return Colors.orange;
      case 'terminé':
        return Colors.blue;
      case 'annulé':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
