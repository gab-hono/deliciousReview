require('dotenv').config();

const express = require("express");
const { neon } = require('@neondatabase/serverless');
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("¡CORS está habilitado!");
});

// ============================================
// ROUTE GET — OBTENIR TOUTES LES PATISSERIES
// ============================================
app.get('/patisseries', async (_, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT * FROM "Patisseries" ORDER BY id ASC`;
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTE DELETE — EFFACER UN ÉLÉMENT
// ============================================
app.delete('/patisseries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`
      DELETE FROM "Patisseries" 
      WHERE id = ${id}
      RETURNING *
    `;

    if (response.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Pâtisserie avec l'id ${id} non trouvée`
      });
    }

    res.json({
      success: true,
      message: `L'élément ${id} a été effacé`,
      data: response[0]
    });

    console.log(`✅ Patisserie "${response[0].nom_patisserie}" (id: ${id}) effacée`);

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// ============================================
// ROUTE PUT — MODIFIER UN ÉLÉMENT
// ============================================
app.put('/patisseries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // On récupère uniquement les champs envoyés dans le body
    const { nom_patisserie, categorie, img, origine, description } = req.body;

    const sql = neon(process.env.DATABASE_URL);

    // On vérifie d'abord que la pâtisserie existe
    const existing = await sql`SELECT * FROM "Patisseries" WHERE id = ${id}`;

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Pâtisserie avec l'id ${id} non trouvée`
      });
    }

    // Pour chaque champ: si le nouveau est fourni on l'utilise, sinon on garde l'ancien
    const current = existing[0];

    const updated = await sql`
      UPDATE "Patisseries"
      SET
        nom_patisserie = ${nom_patisserie  ?? current.nom_patisserie},
        categorie      = ${categorie       ?? current.categorie},
        img            = ${img             ?? current.img},
        origine        = ${origine         ?? current.origine},
        description    = ${description     ?? current.description}
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({
      success: true,
      message: `Pâtisserie "${updated[0].nom_patisserie}" mise à jour`,
      data: updated[0]
    });

    console.log(`✅ Patisserie "${updated[0].nom_patisserie}" (id: ${id}) mise à jour`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
});

// ============================================
// ROUTE POST — AJOUTER UNE PATISSERIE
// ============================================
app.post('/patisseries', async (req, res) => {
  try {
    const { nom_patisserie, categorie, img, origine, description } = req.body;

    // Vérifier que tous les champs obligatoires sont présents
    if (!nom_patisserie || !categorie || !origine || !description) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants : nom_patisserie, categorie, origine, description'
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      INSERT INTO "Patisseries" (nom_patisserie, categorie, img, origine, description)
      VALUES (${nom_patisserie}, ${categorie}, ${img ?? null}, ${origine}, ${description})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      message: `Pâtisserie "${result[0].nom_patisserie}" ajoutée avec succès`,
      data: result[0]
    });

    console.log(`✅ Nouvelle pâtisserie "${result[0].nom_patisserie}" (id: ${result[0].id}) ajoutée`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout',
      error: error.message
    });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});