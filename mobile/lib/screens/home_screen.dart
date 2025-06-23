import 'package:flutter/material.dart';
import 'package:billettigue/screens/history_screen.dart';
import 'package:billettigue/screens/parcels_screen.dart';
import 'package:billettigue/screens/profile_screen.dart';
import 'package:billettigue/screens/tickets_screen.dart';
import 'package:billettigue/utils/colors.dart';
import 'package:billettigue/services/navigation_service.dart';
import 'package:billettigue/models/category_model.dart';
import 'package:billettigue/models/event_model.dart';
import 'package:billettigue/models/user_model.dart';
import 'package:billettigue/services/data_service.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    const MainHomeScreen(), // Le contenu principal de l'accueil
    const TicketsScreen(),
    const ParcelsScreen(),
    const HistoryScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Future<void> _handleLogout(BuildContext context) async {
    // Afficher une boîte de dialogue de confirmation
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Déconnexion'),
          content: const Text('Êtes-vous sûr de vouloir vous déconnecter ?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
              ),
              child: const Text('Déconnexion'),
            ),
          ],
        );
      },
    );

    if (shouldLogout == true && context.mounted) {
      await NavigationService.logoutAndNavigateToLogin(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: _widgetOptions.elementAt(_selectedIndex)),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Accueil'),
          BottomNavigationBarItem(
            icon: Icon(Icons.confirmation_num),
            label: 'Billets',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_shipping),
            label: 'Colis',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Historique',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textBase.withOpacity(0.6),
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        showUnselectedLabels: true,
      ),
    );
  }
}

class MainHomeScreen extends StatefulWidget {
  const MainHomeScreen({super.key});

  @override
  State<MainHomeScreen> createState() => _MainHomeScreenState();
}

class _MainHomeScreenState extends State<MainHomeScreen> {
  final DataService _dataService = DataService();
  final TextEditingController _searchController = TextEditingController();

  User? _user;
  List<Event> _featuredEvents = [];
  List<Category> _categories = [];
  List<Event> _upcomingEvents = [];
  List<Event> _filteredUpcomingEvents = [];

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
    _searchController.addListener(_filterEvents);
  }

  @override
  void dispose() {
    _searchController.removeListener(_filterEvents);
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      // Chargement en parallèle
      final results = await Future.wait([
        _dataService.getUser(),
        _dataService.getFeaturedEvents(),
        _dataService.getCategories(),
        _dataService.getUpcomingEvents(),
      ]);

      setState(() {
        _user = results[0] as User;
        _featuredEvents = results[1] as List<Event>;
        _categories = results[2] as List<Category>;
        _upcomingEvents = results[3] as List<Event>;
        _filteredUpcomingEvents = _upcomingEvents;
        _isLoading = false;
      });
    } catch (e) {
      // Gérer l'erreur (afficher un message, etc.)
      print("Erreur de chargement des données: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _filterEvents() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredUpcomingEvents =
          _upcomingEvents.where((event) {
            return event.title.toLowerCase().contains(query) ||
                event.location.toLowerCase().contains(query);
          }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('BilletTigue'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textBase,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
            tooltip: 'Notifications',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _handleLogout(context),
            tooltip: 'Déconnexion',
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Message
              Text(
                'Bonjour, ${_user?.firstName ?? 'Utilisateur'} !',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Où voulez-vous aller aujourd\'hui ?',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(color: Colors.grey[600]),
              ),
              const SizedBox(height: 24),

              // Search Bar
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Rechercher un événement...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: AppColors.inputBackground,
                ),
              ),
              const SizedBox(height: 24),

              // Featured Events Carousel
              _buildSectionTitle(context, 'À la une'),
              const SizedBox(height: 16),
              SizedBox(
                height: 200,
                child: PageView.builder(
                  controller: PageController(viewportFraction: 0.9),
                  itemCount: _featuredEvents.length,
                  itemBuilder: (context, index) {
                    final event = _featuredEvents[index];
                    return _buildFeaturedEventCard(context, event);
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Categories
              _buildSectionTitle(context, 'Catégories'),
              const SizedBox(height: 16),
              SizedBox(
                height: 100,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _categories.length,
                  separatorBuilder:
                      (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final category = _categories[index];
                    return _buildCategoryChip(context, category);
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Upcoming Events
              _buildSectionTitle(context, 'Événements à venir'),
              const SizedBox(height: 16),
              _filteredUpcomingEvents.isEmpty
                  ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20.0),
                      child: Text("Aucun événement trouvé."),
                    ),
                  )
                  : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _filteredUpcomingEvents.length,
                    itemBuilder: (context, index) {
                      final event = _filteredUpcomingEvents[index];
                      return _buildUpcomingEventTile(context, event);
                    },
                  ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
    );
  }

  Widget _buildFeaturedEventCard(BuildContext context, Event event) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        image: DecorationImage(
          image: NetworkImage(event.imageUrl),
          fit: BoxFit.cover,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [Colors.black.withOpacity(0.7), Colors.transparent],
              ),
            ),
          ),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.location_on,
                      color: Colors.white,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      event.location,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(BuildContext context, Category category) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            category.icon,
            color: Theme.of(context).primaryColor,
            size: 30,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          category.name,
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildUpcomingEventTile(BuildContext context, Event event) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      clipBehavior: Clip.antiAlias,
      child: Row(
        children: [
          SizedBox(
            width: 100,
            height: 100,
            child: Image.network(event.imageUrl, fit: BoxFit.cover),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 6),
                      Text(
                        DateFormat('d MMM yyyy').format(event.date),
                        style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          event.location,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleLogout(BuildContext context) async {
    // Afficher une boîte de dialogue de confirmation
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Déconnexion'),
          content: const Text('Êtes-vous sûr de vouloir vous déconnecter ?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                foregroundColor: Colors.white,
              ),
              child: const Text('Déconnexion'),
            ),
          ],
        );
      },
    );

    if (shouldLogout == true && context.mounted) {
      await NavigationService.logoutAndNavigateToLogin(context);
    }
  }
}
