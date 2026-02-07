import express from 'express';
import { pool } from '../db/index';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { io } from '../server';

const router = express.Router();

// GET forecasts (filtered by horizon)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { horizon } = req.query;
    let query = 'SELECT * FROM forecasts WHERE 1=1';
    const params: any[] = [];

    if (horizon) {
      query += ' AND time_horizon = $1';
      params.push(horizon);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch forecasts' });
  }
});

// POST broadcast forecast/alert (Government only)
router.post('/broadcast', authMiddleware, requireRole('GOVERNMENT'), async (req: AuthRequest, res) => {
  try {
    const { time_horizon, phenomenon, province_id, risk_level, details } = req.body;
    const userId = req.user!.userId;

    if (!time_horizon || !phenomenon || !risk_level) {
      return res.status(400).json({ error: 'time_horizon, phenomenon, and risk_level required' });
    }

    const result = await pool.query(
      `INSERT INTO forecasts (time_horizon, phenomenon, province_id, risk_level, details, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [time_horizon, phenomenon, province_id || null, risk_level, details || {}, userId]
    );

    const forecast = result.rows[0];

    // Emit via WebSocket to all connected users
    io.emit('forecast_alert', {
      ...forecast,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(forecast);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to broadcast forecast' });
  }
});

// GET latest forecast by phenomenon
router.get('/:phenomenon', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { phenomenon } = req.params;
    const result = await pool.query(
      'SELECT * FROM forecasts WHERE phenomenon = $1 ORDER BY created_at DESC LIMIT 1',
      [phenomenon]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Forecast not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

export default router;
