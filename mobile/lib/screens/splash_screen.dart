import 'package:flutter/material.dart';
import 'package:billettigue/services/navigation_service.dart';
import 'package:billettigue/utils/colors.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _textController;
  late AnimationController _loadingController;

  late Animation<double> _logoAnimation;
  late Animation<double> _textAnimation;
  late Animation<double> _loadingAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _checkAppState();
  }

  void _initializeAnimations() {
    // Logo animation
    _logoController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _logoAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.elasticOut),
    );

    // Text animation
    _textController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _textAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeInOut),
    );

    // Loading animation
    _loadingController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _loadingAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _loadingController, curve: Curves.easeInOut),
    );

    // Start animations
    _logoController.forward();
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _textController.forward();
    });
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) _loadingController.forward();
    });
  }

  @override
  void dispose() {
    _logoController.dispose();
    _textController.dispose();
    _loadingController.dispose();
    super.dispose();
  }

  Future<void> _checkAppState() async {
    // Attendre que les animations soient terminées
    await Future.delayed(const Duration(milliseconds: 2500));

    if (mounted) {
      // Utiliser le service de navigation pour déterminer l'écran approprié
      await NavigationService.navigateToAppropriateScreen(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: Container(
        decoration: const BoxDecoration(color: AppColors.surface),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo avec animation
                AnimatedBuilder(
                  animation: _logoAnimation,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _logoAnimation.value,
                      child: Image.asset(
                        'lib/pictures/logo bt.png',
                        width: 120,
                        height: 120,
                        fit: BoxFit.contain,
                      ),
                    );
                  },
                ),
                const SizedBox(height: 40),

                // Titre avec animation
                AnimatedBuilder(
                  animation: _textAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, 20 * (1 - _textAnimation.value)),
                      child: Opacity(
                        opacity: _textAnimation.value,
                        child: const Text(
                          'BilletTigue',
                          style: TextStyle(
                            fontFamily: 'Comfortaa',
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 10),

                // Sous-titre avec animation
                AnimatedBuilder(
                  animation: _textAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, 20 * (1 - _textAnimation.value)),
                      child: Opacity(
                        opacity: _textAnimation.value,
                        child: Text(
                          'Votre billetterie moderne',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 16,
                            color: AppColors.textBase.withOpacity(0.8),
                            fontWeight: FontWeight.w500,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 60),

                // Indicateur de chargement avec animation
                AnimatedBuilder(
                  animation: _loadingAnimation,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _loadingAnimation.value,
                      child: Column(
                        children: [
                          const CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              AppColors.primary,
                            ),
                            strokeWidth: 3,
                          ),
                          const SizedBox(height: 20),
                          Text(
                            'Chargement...',
                            style: TextStyle(
                              color: AppColors.textBase.withOpacity(0.7),
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
