const { patientSchema,specificpatientSchema,RegisterSchema,LoginSchema,medicineSchema,visitSchema} = require("../validation/user.schema");


module.exports = {
     addPatientValidation : async (req, res, next) => {
        try {
            console.log("🟢 Validating Request Data:", req.body); // Log the received request body
            await patientSchema.validateAsync(req.body, { abortEarly: false }); // Capture all errors
            next();
        } catch (error) {
            console.error("❌ Validation Failed:", error.details.map(err => err.message)); // Log errors
            return res.status(400).json({
                success: false,
                errors: error.details.map(err => err.message),
            });
        }
    },
    
     specificPatientValidation : async (req, res, next) => {
        try {
          // Validate params
          await specificpatientSchema.validateAsync(req.params);
          
          // Validate body
          await visitSchema.validateAsync(req.body);
      
          next();
        } catch (error) {
          console.error("❌ Validation Error:", error.details ? error.details.map(err => err.message) : error.message);
          return res.status(400).json({
            success: false,
            errors: error.details ? error.details.map(err => err.message) : [error.message],
          });
        }
      },
      
    Registervalidation: async (req, res, next) => {
        try {
            await RegisterSchema.validateAsync(req.body,{ abortEarly: false });
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
    Loginvalidation: async (req, res, next) => {
        try {
            await LoginSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
    medicinevalidation: async (req, res, next) => {
        try {
            await medicineSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
}