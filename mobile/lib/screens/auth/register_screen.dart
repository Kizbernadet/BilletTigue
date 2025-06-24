import 'package:flutter/material.dart';
import 'package:billettigue/screens/auth/login_screen.dart';
import 'package:billettigue/services/navigation_service.dart';
import 'package:billettigue/utils/colors.dart';
import 'package:billettigue/widgets/custom_button.dart';
import 'package:billettigue/services/auth_service.dart';

// Écran d'inscription (RegisterScreen)
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomController = TextEditingController();
  final _prenomController = TextEditingController();
  final _emailController = TextEditingController();
  final _adresseController = TextEditingController();
  final _telephoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _nomController.dispose();
    _prenomController.dispose();
    _emailController.dispose();
    _adresseController.dispose();
    _telephoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegistration() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        // Appeler le service d'inscription avec les données du formulaire
        final response = await AuthService.register(
          nom: _nomController.text,
          prenom: _prenomController.text,
          email: _emailController.text,
          password: _passwordController.text,
          address: _adresseController.text,
          phone: _telephoneController.text,
        );

        if (mounted) {
          if (response.user != null) {
            // Afficher un message de succès
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text(
                  'Inscription réussie ! Vous pouvez maintenant vous connecter.',
                ),
                backgroundColor: AppColors.success,
                duration: const Duration(seconds: 3),
              ),
            );
            // Naviguer vers l'écran de connexion après un court délai
            await Future.delayed(const Duration(seconds: 1));
            if (mounted) {
              NavigationService.navigateAfterRegister(context);
            }
          } else {
            // Afficher le message d'erreur de l'API
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  response.message ?? 'Une erreur inconnue est survenue.',
                ),
                backgroundColor: AppColors.error,
              ),
            );
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erreur lors de l\'inscription: $e'),
              backgroundColor: AppColors.error,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  void _handleGoogleSignIn() {
    // TODO: Implémenter la connexion Google (MVP - non développé)
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Connexion Google sera disponible dans une prochaine version',
        ),
        backgroundColor: AppColors.accent,
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textBase),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Créer un compte",
          style: TextStyle(
            color: AppColors.textBase,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),

              // Logo et titre
              Center(
                child: Column(
                  children: [
                    Image.asset(
                      'lib/pictures/logo bt.png',
                      width: 80,
                      height: 80,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      "Bienvenue sur BilletTigue",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textBase,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Créez votre compte pour commencer",
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.textBase.withOpacity(0.7),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // Options de connexion
              Column(
                children: [
                  // Bouton Google
                  Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(12),
                      color: AppColors.surface,
                    ),
                    child: ElevatedButton.icon(
                      onPressed: _handleGoogleSignIn,
                      icon: const Icon(
                        Icons.g_mobiledata,
                        size: 24,
                        color: Colors.red,
                      ),
                      label: const Text(
                        'Continuer avec Google',
                        style: TextStyle(
                          color: AppColors.textBase,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Séparateur
                  Row(
                    children: [
                      Expanded(
                        child: Container(height: 1, color: AppColors.border),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'ou',
                          style: TextStyle(
                            color: AppColors.textBase.withOpacity(0.6),
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Container(height: 1, color: AppColors.border),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Bouton créer un nouveau compte
                  CustomButton(
                    text: 'Créer un nouveau compte',
                    onPressed: () {
                      _showRegistrationForm();
                    },
                    isFullWidth: true,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: AppColors.primary,
                    icon: Icons.person_add,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showRegistrationForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder:
          (context) => Container(
            height: MediaQuery.of(context).size.height * 0.85,
            decoration: const BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Handle
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Titre
                  const Text(
                    "Créer un compte",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textBase,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 30),

                  // Formulaire
                  Expanded(
                    child: Form(
                      key: _formKey,
                      child: SingleChildScrollView(
                        child: Column(
                          children: [
                            // Champ Nom
                            TextFormField(
                              controller: _nomController,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Nom",
                                prefixIcon: const Icon(
                                  Icons.person,
                                  color: AppColors.textBase,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez entrer votre nom';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Prénom
                            TextFormField(
                              controller: _prenomController,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Prénom",
                                prefixIcon: const Icon(
                                  Icons.person_outline,
                                  color: AppColors.textBase,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez entrer votre prénom';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Email
                            TextFormField(
                              controller: _emailController,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Email",
                                prefixIcon: const Icon(
                                  Icons.email,
                                  color: AppColors.textBase,
                                ),
                              ),
                              keyboardType: TextInputType.emailAddress,
                              validator: (value) {
                                if (value == null ||
                                    value.isEmpty ||
                                    !value.contains('@')) {
                                  return 'Veuillez entrer un email valide';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Adresse
                            TextFormField(
                              controller: _adresseController,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Adresse",
                                prefixIcon: const Icon(
                                  Icons.location_on,
                                  color: AppColors.textBase,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez entrer votre adresse';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Téléphone
                            TextFormField(
                              controller: _telephoneController,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Numéro de téléphone",
                                prefixIcon: const Icon(
                                  Icons.phone,
                                  color: AppColors.textBase,
                                ),
                              ),
                              keyboardType: TextInputType.phone,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez entrer votre numéro';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Mot de passe
                            TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Mot de passe",
                                prefixIcon: const Icon(
                                  Icons.lock,
                                  color: AppColors.textBase,
                                ),
                              ),
                              validator: (value) {
                                if (value == null ||
                                    value.isEmpty ||
                                    value.length < 6) {
                                  return 'Le mot de passe doit contenir au moins 6 caractères';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 16),

                            // Champ Confirmation Mot de passe
                            TextFormField(
                              controller: _confirmPasswordController,
                              obscureText: true,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.inputBackground,
                                hintText: "Confirmez le mot de passe",
                                prefixIcon: const Icon(
                                  Icons.lock_outline,
                                  color: AppColors.textBase,
                                ),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez confirmer votre mot de passe';
                                }
                                if (value != _passwordController.text) {
                                  return 'Les mots de passe ne correspondent pas';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 30),

                            // Bouton S'INSCRIRE
                            CustomButton(
                              text: "S'INSCRIRE",
                              onPressed:
                                  _isLoading ? null : _handleRegistration,
                              isLoading: _isLoading,
                              isFullWidth: true,
                              height: 50,
                              borderRadius: 12,
                              backgroundColor: AppColors.primary,
                            ),

                            const SizedBox(height: 20),

                            // Lien vers connexion
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                NavigationService.navigateToWithBack(
                                  context,
                                  const LoginScreen(),
                                );
                              },
                              child: const Text(
                                'Déjà un compte ? Se connecter',
                                style: TextStyle(
                                  color: AppColors.primary,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
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
