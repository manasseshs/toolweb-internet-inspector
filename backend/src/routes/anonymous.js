
const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware to validate IP address
const validateIP = (req, res, next) => {
  const { ip_address } = req.body;
  
  if (!ip_address) {
    return res.status(400).json({ error: 'IP address is required' });
  }
  
  // Basic IP validation
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (!ipRegex.test(ip_address) && !ipv6Regex.test(ip_address)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }
  
  next();
};

// Check usage limit for anonymous users
router.post('/check-limit', validateIP, async (req, res) => {
  try {
    console.log('=== ANONYMOUS USAGE LIMIT CHECK START ===');
    console.log('Request body:', req.body);
    
    const { ip_address, tool_id } = req.body;
    
    if (!tool_id) {
      return res.status(400).json({ error: 'Tool ID is required' });
    }
    
    // Call stored procedure to check usage limit
    const [results] = await pool.execute(
      'CALL CheckAnonymousUsageLimit(?, ?, @can_use, @used_today, @daily_limit, @remaining)',
      [ip_address, tool_id]
    );
    
    // Get output parameters
    const [outputParams] = await pool.execute(
      'SELECT @can_use as can_use, @used_today as used_today, @daily_limit as daily_limit, @remaining as remaining'
    );
    
    const result = outputParams[0];
    
    console.log('Usage check result:', result);
    console.log('=== ANONYMOUS USAGE LIMIT CHECK END ===');
    
    res.json({
      can_use: !!result.can_use,
      used_today: result.used_today || 0,
      daily_limit: result.daily_limit || 10,
      remaining: result.remaining || 0
    });
    
  } catch (error) {
    console.error('💥 Error checking anonymous usage limit:', error);
    res.status(500).json({ 
      error: 'Failed to check usage limit',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Track usage for anonymous users
router.post('/track-usage', validateIP, async (req, res) => {
  try {
    console.log('=== ANONYMOUS USAGE TRACKING START ===');
    console.log('Request body:', req.body);
    
    const { 
      ip_address, 
      tool_id, 
      input_data, 
      success = true, 
      execution_time, 
      error_message, 
      user_agent 
    } = req.body;
    
    if (!tool_id) {
      return res.status(400).json({ error: 'Tool ID is required' });
    }
    
    // Call stored procedure to increment usage
    await pool.execute(
      'CALL IncrementAnonymousUsage(?, ?, ?, ?, ?, ?, ?)',
      [
        ip_address,
        tool_id,
        success,
        input_data || '',
        execution_time || null,
        error_message || null,
        user_agent || null
      ]
    );
    
    console.log('✅ Anonymous usage tracked successfully');
    console.log('=== ANONYMOUS USAGE TRACKING END ===');
    
    res.json({ success: true, message: 'Usage tracked successfully' });
    
  } catch (error) {
    console.error('💥 Error tracking anonymous usage:', error);
    res.status(500).json({ 
      error: 'Failed to track usage',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get usage statistics for anonymous users
router.get('/usage-stats', async (req, res) => {
  try {
    console.log('=== ANONYMOUS USAGE STATS START ===');
    console.log('Query params:', req.query);
    
    const { ip_address, date_from, date_to } = req.query;
    
    if (!ip_address) {
      return res.status(400).json({ error: 'IP address is required' });
    }
    
    const dateFrom = date_from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateTo = date_to || new Date().toISOString().split('T')[0];
    
    // Call stored procedure to get usage stats
    const [results] = await pool.execute(
      'CALL GetAnonymousUsageStats(?, ?, ?)',
      [ip_address, dateFrom, dateTo]
    );
    
    console.log('Usage stats result:', results[0]);
    console.log('=== ANONYMOUS USAGE STATS END ===');
    
    res.json(results[0] || []);
    
  } catch (error) {
    console.error('💥 Error getting anonymous usage stats:', error);
    res.status(500).json({ 
      error: 'Failed to get usage stats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Cleanup old usage data (admin endpoint)
router.post('/cleanup', async (req, res) => {
  try {
    console.log('=== ANONYMOUS USAGE CLEANUP START ===');
    
    // Call stored procedure to cleanup old data
    const [results] = await pool.execute('CALL CleanupOldAnonymousUsage()');
    
    console.log('Cleanup result:', results[0]);
    console.log('=== ANONYMOUS USAGE CLEANUP END ===');
    
    res.json({ 
      success: true, 
      message: 'Cleanup completed successfully',
      deleted_records: results[0]?.[0]?.deleted_records || 0
    });
    
  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    res.status(500).json({ 
      error: 'Cleanup failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
