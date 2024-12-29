const express = require("express");
const router = express.Router();
const cors = require("cors");

require("../db/conn");
const Service = require("../model/serviceSchema");

router.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// API Endpoint to Send the services-data to MongDB 
router.post('/add-services', async (req, res) => {
  try {
    const { name, category, price, shortDescription, fullDescription, image} = req.body;
    
    const newService = new Service({
      name,
      category,
      price,
      shortDescription,
      fullDescription,
      image
    });
    console.log(newService);
    await newService.save();
    res.status(201).json({ message: 'Service data saved successfully' });
  } catch (error) {
    console.error('Error saving service data:', error);
    res.status(500).json({ error: 'INTERNAL server error' });
  }
});

// API endpoint to retrieve services
router.get('/get-services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;