import 'package:flutter/material.dart';

class ParcelsScreen extends StatelessWidget {
  const ParcelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // Optionnel : revenir à l'accueil ou à l'écran précédent
          },
        ),
        title: const Text('Envoi de colis'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: const Center(child: Text('Écran d\'envoi de colis')),
    );
  }
}
