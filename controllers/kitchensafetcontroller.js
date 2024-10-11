const KitchenSafetyModel = require("../models/kitchensafetymodel"); // Import the model

class kitchenSafetyController {
  async createPrediction(req, res) {
    try {
      console.log(req.body)
      const { image, trace_id, model_prediction } = req.body;
      if (!image && !trace_id) throw error("Bad request");
      const existingPrediction = await KitchenSafetyModel.countDocuments({ traceId: trace_id });

      if (existingPrediction) {
        // If exists, return the existing prediction
        return { message: "Prediction already exists" };
      }
  
      const newPrediction = new KitchenSafetyModel({
        image,
        traceId:trace_id,
        modelPrediction: model_prediction,
      });

      const res= await newPrediction.save();
  
      return res

    } catch (error) {
 console.log(err)
    }
  }
  async updatePrediction(req, res) {

      const { roboflow_prediction, trace_id } = req.body;
  
      if (!trace_id ) {
        return { message: "Missing required fields" };
      }
  
      const updatedPrediction = await KitchenSafetyModel.findOneAndUpdate(
        { traceId: trace_id },
        { roboflowPrediction:roboflow_prediction },
        { new: true }  
      );
  
      if (!updatedPrediction) {
        return { message: "Prediction not found" };
      }
      return updatedPrediction;
    
  }
  
}
module.exports = kitchenSafetyController;
