
const pool = require('../db');


function isValidCoordinate(lat, lon) {
  return (
    typeof lat === 'number' && typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


exports.addSchool = async (req, res) => {
//  console.log(req.body);
  const { name, address, latitude, longitude } = req.body;


  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!isValidCoordinate(latitude, longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      address,
      latitude,
      longitude
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;
  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (!isValidCoordinate(userLat, userLon)) {
    return res.status(400).json({ error: 'Invalid user coordinates' });
  }

  try {
    const [schools] = await pool.query('SELECT * FROM schools');
    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      )
    })).sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (err) {
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};