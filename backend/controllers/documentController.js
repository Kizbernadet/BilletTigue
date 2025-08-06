/**
 * Contrôleur pour l'affichage ou le téléchargement de la facture et des billets électroniques (PDF ou web)
 */
const Reservation = require('../models/reservation');
const PDFDocument = require('pdfkit');

// Générer et envoyer le PDF de la facture
exports.getInvoicePdf = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (!reservation || !reservation.invoice) {
            return res.status(404).json({ success: false, message: 'Facture non trouvée' });
        }
        const invoice = reservation.invoice;
        // Création du PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="facture-${invoice.invoiceId}.pdf"`);
        doc.text(`Facture N°: ${invoice.invoiceId}`);
        doc.text(`Réservation: ${invoice.reservationId}`);
        doc.text(`Client: ${invoice.customerName}`);
        doc.text(`Date: ${invoice.date}`);
        doc.text(`Nombre de places: ${invoice.places}`);
        doc.text(`Montant total: ${invoice.totalAmount} FCFA`);
        doc.text(`Transporteur: ${invoice.transporter.name} (${invoice.transporter.contact})`);
        doc.text(`Statut: ${invoice.status}`);
        doc.text('Billets associés:');
        invoice.tickets.forEach(t => doc.text(`- ${t}`));
        doc.text(invoice.legal || '');
        doc.end();
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF', error: error.message });
    }
};

// Générer et envoyer le PDF d'un billet
exports.getTicketPdf = async (req, res) => {
    try {
        const { id, ticketId } = req.params;
        const reservation = await Reservation.findByPk(id);
        if (!reservation || !reservation.tickets) {
            return res.status(404).json({ success: false, message: 'Billet non trouvé' });
        }
        const ticket = reservation.tickets.find(t => t.ticketId === ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Billet non trouvé' });
        }
        // Création du PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="billet-${ticket.ticketId}.pdf"`);
        doc.text(`Billet N°: ${ticket.ticketId}`);
        doc.text(`Réservation: ${ticket.reservationId}`);
        doc.text(`Client: ${ticket.customerName}`);
        doc.text(`Date du trajet: ${ticket.date}`);
        doc.text(`Départ: ${ticket.departure}`);
        doc.text(`Arrivée: ${ticket.arrival}`);
        doc.text(`Bus/Transporteur: ${ticket.busNumber}`);
        doc.text(`Statut: ${ticket.status}`);
        doc.text('QR Code:');
        // Affichage du QR code (en base64)
        if (ticket.qrCode) {
            doc.image(Buffer.from(ticket.qrCode.split(",")[1], 'base64'), { width: 100, height: 100 });
        }
        doc.end();
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF', error: error.message });
    }
};
