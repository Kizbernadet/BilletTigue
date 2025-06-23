import 'package:flutter/material.dart';
import 'package:billettigue/services/navigation_service.dart';
import 'package:billettigue/utils/colors.dart';
import 'package:billettigue/widgets/custom_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      title: 'Bienvenue sur BilletTigue',
      subtitle: 'Votre billetterie moderne',
      description:
          'Découvrez et réservez vos événements préférés en toute simplicité.',
      icon: Icons.event_available,
      color: AppColors.primary,
    ),
    OnboardingPage(
      title: 'Réservation Simple',
      subtitle: 'En quelques clics',
      description:
          'Trouvez rapidement vos événements et réservez vos places en toute sécurité.',
      icon: Icons.confirmation_number,
      color: AppColors.accent,
    ),
    OnboardingPage(
      title: 'Suivi en Temps Réel',
      subtitle: 'Restez informé',
      description:
          'Suivez vos réservations et recevez des notifications pour vos événements.',
      icon: Icons.notifications_active,
      color: AppColors.success,
    ),
    OnboardingPage(
      title: 'Prêt à Commencer ?',
      subtitle: 'Rejoignez-nous',
      description:
          'Créez votre compte et commencez à explorer les meilleurs événements.',
      icon: Icons.rocket_launch,
      color: AppColors.primary,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _startApp();
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _startApp() async {
    // Marquer que l'application a été lancée pour la première fois
    await NavigationService.navigateAfterRegister(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: TextButton(
                  onPressed: _startApp,
                  child: Text(
                    'Passer',
                    style: TextStyle(
                      color: AppColors.textBase.withOpacity(0.7),
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),

            // Page content
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  return _buildPage(_pages[index]);
                },
              ),
            ),

            // Bottom navigation
            _buildBottomNavigation(),
          ],
        ),
      ),
    );
  }

  Widget _buildPage(OnboardingPage page) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon with animation
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: page.color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(60),
            ),
            child: Icon(page.icon, size: 60, color: page.color),
          ),
          const SizedBox(height: 40),

          // Title
          Text(
            page.title,
            style: const TextStyle(
              fontFamily: 'Comfortaa',
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppColors.textBase,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),

          // Subtitle
          Text(
            page.subtitle,
            style: TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 18,
              color: page.color,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),

          // Description
          Text(
            page.description,
            style: const TextStyle(
              fontFamily: 'Montserrat',
              fontSize: 16,
              color: AppColors.textBase,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigation() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Page indicators
          Row(
            children: List.generate(
              _pages.length,
              (index) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.only(right: 8),
                width: _currentPage == index ? 24 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color:
                      _currentPage == index
                          ? AppColors.primary
                          : AppColors.border,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),

          // Next/Start button
          GradientButton(
            text: _currentPage == _pages.length - 1 ? 'DÉMARRER' : 'SUIVANT',
            onPressed: _nextPage,
            width: 120,
            height: 50,
            borderRadius: 25,
            icon:
                _currentPage == _pages.length - 1
                    ? Icons.rocket_launch
                    : Icons.arrow_forward,
          ),
        ],
      ),
    );
  }
}

class OnboardingPage {
  final String title;
  final String subtitle;
  final String description;
  final IconData icon;
  final Color color;

  OnboardingPage({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.icon,
    required this.color,
  });
}
