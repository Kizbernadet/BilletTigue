const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');

// Route pour télécharger la facture PDF d'une réservation
router.get('/invoice/:id', protect, documentController.getInvoicePdf);

// Route pour télécharger un billet PDF d'une réservation
router.get('/ticket/:id/:ticketId', protect, documentController.getTicketPdf);

module.exports = router;
