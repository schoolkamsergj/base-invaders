/**
 * Vercel Serverless API: збереження та завантаження прогресу гри в Supabase.
 * ENV: SUPABASE_URL, SUPABASE_KEY. Таблиця: player_progress.
 */
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Перевірка методу
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Перевірка ENV
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('[api/progress] Missing SUPABASE_URL or SUPABASE_KEY');
    return res.status(500).json({ error: 'Server config missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (req.method === 'GET') {
      // GET логіка
      const fid = req.query.fid;
      if (!fid || typeof fid !== 'string') {
        return res.status(400).json({ error: 'Missing fid' });
      }

      const { data, error } = await supabase
        .from('player_progress')
        .select('*')
        .eq('fid', fid)
        .maybeSingle();

      if (error) {
        console.error('[api/progress] GET error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(200).json({});
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // POST логіка
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ error: 'Invalid JSON body' });
        }
      }

      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Body required' });
      }

      const fid = body.fid;
      if (!fid || typeof fid !== 'string') {
        return res.status(400).json({ error: 'Missing fid' });
      }

      const upgradesObj = body.upgrades && typeof body.upgrades === 'object' ? body.upgrades : { fireRate: 300, damage: 1, multiShot: 1, maxHP: 100, speed: 300 };
      const achievementsObj = body.achievements && typeof body.achievements === 'object' ? body.achievements : {};
      const row = {
        fid,
        gold: Number(body.gold) || 0,
        diamonds: Number(body.diamonds) || 0,
        lightning: Number(body.lightning) || 0,
        wave: Number(body.wave) || 1,
        mission: Number(body.mission) || 1,
        level: Number(body.level) || 1,
        best_score: Number(body.best_score) || 0,
        upgrades: upgradesObj,
        achievements: achievementsObj,
        daily_streak: Number(body.daily_streak) || 0,
        last_checkin: body.last_checkin != null ? String(body.last_checkin) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('player_progress')
        .upsert(row, { onConflict: 'fid' });

      if (error) {
        console.error('[api/progress] POST upsert error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error('[api/progress] Unexpected error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
