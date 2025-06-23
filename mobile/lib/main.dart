/**
 * FICHIER: main.dart
 * 
 * RÔLE: Point d'entrée principal de l'application mobile Billettigue
 * 
 * LOGIQUE:
 * - Configure le thème global de l'application avec les couleurs de la charte graphique
 * - Définit les styles des composants (boutons, champs de saisie, cartes)
 * - Lance l'écran de démarrage (SplashScreen) qui gère le flux d'initialisation
 * - Utilise Material 3 pour une interface moderne et cohérente
 * 
 * ARCHITECTURE:
 * - MyApp: Widget racine qui configure le MaterialApp
 * - Thème personnalisé basé sur AppColors pour la cohérence visuelle
 * - Navigation automatique vers SplashScreen au démarrage
 * 
 * FLUX D'EXÉCUTION:
 * 1. Application démarre → MyApp
 * 2. Configuration du thème et des styles
 * 3. Lancement de SplashScreen
 * 4. SplashScreen détermine l'écran suivant selon l'état de l'utilisateur
 */

import 'package:flutter/material.dart';
import 'package:billettigue/screens/splash_screen.dart';
import 'package:billettigue/screens/auth/login_screen.dart';
import 'package:billettigue/screens/tickets_screen.dart';
import 'package:billettigue/screens/parcels_screen.dart';
import 'package:billettigue/screens/history_screen.dart';
import 'package:billettigue/screens/profile_screen.dart';
import 'package:billettigue/screens/auth/register_screen.dart';
import 'package:billettigue/utils/colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Billettigue',
      debugShowCheckedModeBanner: false, // Masque la bannière de debug
      // Configuration du thème global de l'application
      theme: ThemeData(
        // Schéma de couleurs basé sur la charte graphique
        colorScheme: ColorScheme(
          brightness: Brightness.light,
          primary: AppColors.primary, // Bleu marine (couleur primaire)
          onPrimary: AppColors.textLight,
          secondary: AppColors.accent, // Orange (couleur d'accent)
          onSecondary: AppColors.textLight,
          error: AppColors.error,
          onError: AppColors.textLight,
          surface: AppColors.surface,
          onSurface: AppColors.textBase, // Gris foncé (couleur de texte)
        ),

        // Couleur de fond par défaut
        scaffoldBackgroundColor: AppColors.background,

        // Utilisation de Material 3 pour un design moderne
        useMaterial3: true,

        // Police par défaut
        fontFamily: 'Roboto',

        // Configuration des boutons élevés (ElevatedButton)
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary, // Bleu marine
            foregroundColor: AppColors.textLight,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30), // Coins arrondis
            ),
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
            elevation: 0, // Pas d'ombre pour un look moderne
          ),
        ),

        // Configuration des boutons avec contour (OutlinedButton)
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.primary, // Bleu marine
            side: const BorderSide(color: AppColors.primary),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),

        // Configuration des champs de saisie (TextField)
        inputDecorationTheme: InputDecorationTheme(
          filled: true, // Fond rempli
          fillColor: AppColors.inputBackground, // Gris très clair
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: const BorderSide(color: AppColors.border), // Gris clair
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(20),
            borderSide: const BorderSide(
              color: AppColors.borderFocused,
            ), // Orange
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 16,
          ),
        ),

        // Configuration des cartes (Card)
        cardTheme: CardTheme(
          color: AppColors.surface,
          elevation: 2, // Ombre légère
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24), // Coins très arrondis
          ),
        ),
      ),

      // Écran de démarrage - gère le flux d'initialisation
      home: const SplashScreen(),
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'lib/pictures/logo bt.png',
                width: 140,
                height: 140,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 40),
              const Text(
                'BilletTigue',
                style: TextStyle(
                  fontFamily: 'Comfortaa',
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFB86B2B),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Votre billetterie moderne',
                style: TextStyle(
                  fontFamily: 'Montserrat',
                  fontSize: 16,
                  color: Colors.black54,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 60),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoginScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF54A64A),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(200, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'SE CONNECTER',
                  style: TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RegisterScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF54A64A),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(200, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  "S'INSCRIRE",
                  style: TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
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

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        child: Scaffold(
          extendBody: true,
          backgroundColor: Theme.of(
            context,
          ).colorScheme.secondary.withOpacity(0.08),
          body: _screens[_selectedIndex],
          bottomNavigationBar: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: BottomNavigationBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              currentIndex: _selectedIndex,
              onTap: _onItemTapped,
              type: BottomNavigationBarType.fixed,
              selectedItemColor: Theme.of(context).colorScheme.primary,
              unselectedItemColor: Colors.grey,
              showSelectedLabels: false,
              showUnselectedLabels: false,
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.confirmation_number),
                  label: '',
                ),
                BottomNavigationBarItem(icon: Icon(Icons.luggage), label: ''),
                BottomNavigationBarItem(
                  icon: Icon(Icons.receipt_long),
                  label: '',
                ),
                BottomNavigationBarItem(icon: Icon(Icons.person), label: ''),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
