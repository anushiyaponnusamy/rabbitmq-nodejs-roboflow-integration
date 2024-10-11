const express = require('express');
const KitchenSafetyController = require('../controllers/kitchensafetcontroller'); 

class KitchenSafetyRoutes {
  constructor() {
    this.router = express.Router(); 
    this.initializeRoutes();  
    this.controller=new KitchenSafetyController();
  }

  initializeRoutes() {
    this.router.post('/create', this.createPrediction.bind(this));


    this.router.put('/update', this.updatePrediction.bind(this));
  }

  async createPrediction(req, res) {
    try {
    
      const newPrediction = await this.controller.createPrediction(req);
      res.status(201).json({
        message: 'Prediction saved successfully',
        data: newPrediction,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePrediction(req, res) {
    try {
      const updatedPrediction = await this.controller.updatePrediction(req);
      if (!updatedPrediction) {
        return res.status(404).json({ message: 'Prediction not found' });
      }
      res.status(200).json(updatedPrediction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new KitchenSafetyRoutes().router;
