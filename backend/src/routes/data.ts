import express from 'express';
import { pool } from '../db/index';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET all risk data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM risk_data ORDER BY province_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// POST/UPDATE risk data (Government only)
router.post('/update', authMiddleware, requireRole('GOVERNMENT'), async (req: AuthRequest, res) => {
  try {
    const { province_id, salinity_level, heat_index, flood_depth, pollution_index } = req.body;
    const userId = req.user!.userId;

    if (!province_id) {
      return res.status(400).json({ error: 'province_id required' });
    }

    const result = await pool.query(
      `INSERT INTO risk_data (province_id, salinity_level, heat_index, flood_depth, pollution_index, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (province_id)
       DO UPDATE SET salinity_level=$2, heat_index=$3, flood_depth=$4, pollution_index=$5, updated_by=$6, updated_at=NOW()
       RETURNING *`,
      [province_id, salinity_level || 0, heat_index || 0, flood_depth || 0, pollution_index || 0, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

export default router;
