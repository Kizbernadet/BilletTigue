import 'package:flutter/material.dart';
import 'package:billettigue/screens/auth/register_screen.dart';
import 'package:billettigue/services/navigation_service.dart';
import 'package:billettigue/utils/colors.dart';
import 'package:billettigue/widgets/custom_button.dart';

// Écran de connexion (LoginScreen)
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _rememberMe = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        await Future.delayed(const Duration(seconds: 2));

        final email = _emailController.text;
        final token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
        final name = email.split('@')[0];

        await NavigationService.navigateAfterLogin(
          context,
          token: token,
          email: email,
          name: name,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Connexion réussie !'),
              backgroundColor: AppColors.success,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erreur lors de la connexion: $e'),
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
    // TODO: Implement Google Sign In
  }

  void _handleAppleSignIn() {
    // TODO: Implement Apple Sign In
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textBase),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Connexion',
          style: TextStyle(
            color: AppColors.textBase,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),

                // Titre et sous-titre
                const Text(
                  'BilletTigue',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textBase,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Votre billetterie moderne',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textBase.withOpacity(0.7),
                  ),
                ),

                const SizedBox(height: 40),

                // Champ Email
                const Text(
                  'Email',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textBase,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(
                      Icons.email_outlined,
                      color: AppColors.textBase,
                      size: 20,
                    ),
                    hintText: 'Email',
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

                const SizedBox(height: 20),

                // Champ Mot de passe
                const Text(
                  'Mot de passe',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textBase,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(
                      Icons.lock_outline,
                      color: AppColors.textBase,
                      size: 20,
                    ),
                    hintText: 'Mot de passe',
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: AppColors.textBase,
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty || value.length < 6) {
                      return 'Le mot de passe doit contenir au moins 6 caractères';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 16),

                // Options
                Wrap(
                  alignment: WrapAlignment.spaceBetween,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  runSpacing: 0,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (value) {
                            setState(() {
                              _rememberMe = value!;
                            });
                          },
                          materialTapTargetSize:
                              MaterialTapTargetSize.shrinkWrap,
                          visualDensity: VisualDensity.compact,
                          activeColor: AppColors.primary,
                        ),
                        const Text('Se souvenir de moi'),
                      ],
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Mot de passe oublié ?',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Bouton Next
                CustomButton(
                  text: 'Se connecter',
                  onPressed: _handleLogin,
                  isLoading: _isLoading,
                  isFullWidth: true,
                  backgroundColor: AppColors.primary,
                  height: 50,
                  borderRadius: 12,
                ),

                const SizedBox(height: 32),

                // Séparateur
                Row(
                  children: [
                    const Expanded(child: Divider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Ou',
                        style: TextStyle(
                          color: AppColors.textBase.withOpacity(0.6),
                        ),
                      ),
                    ),
                    const Expanded(child: Divider()),
                  ],
                ),

                const SizedBox(height: 32),

                // Connexion sociale
                CustomButton(
                  text: 'Continuer avec Apple',
                  onPressed: _handleAppleSignIn,
                  isFullWidth: true,
                  isOutlined: true,
                  textColor: AppColors.textBase,
                  height: 50,
                  borderRadius: 12,
                  icon: Icons.apple,
                ),

                const SizedBox(height: 16),

                CustomButton(
                  text: 'Continuer avec Google',
                  onPressed: _handleGoogleSignIn,
                  isFullWidth: true,
                  isOutlined: true,
                  textColor: AppColors.textBase,
                  height: 50,
                  borderRadius: 12,
                  icon: Icons.g_mobiledata,
                ),

                const SizedBox(height: 40),

                // Lien vers l'inscription
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Vous n'avez pas de compte ? ",
                      style: TextStyle(
                        color: AppColors.textBase.withOpacity(0.7),
                      ),
                    ),
                    TextButton(
                      onPressed:
                          () => NavigationService.navigateToWithBack(
                            context,
                            const RegisterScreen(),
                          ),
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text(
                        'S\'inscrire',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
