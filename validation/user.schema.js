const Joi = require('@hapi/joi');

const patientSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.max': 'Name cannot be more than 50 characters.',
        'any.required': 'Name is required.'
    }),

    number: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Number must be exactly 10 digits.',
        'any.required': 'Number is required.'
    }),

    medicines: Joi.array().items(
        Joi.object({
            medicine: Joi.string().required().messages({
                'any.required': 'Medicine name is required.'
            }),
            dose: Joi.string().required().messages({
                'any.required': 'Dose is required.'
            })
        })
    ).default([]),  // Default empty array if not provided

    totalAmountPaid: Joi.number().min(0).required().messages({
        'number.base': 'Total amount paid must be a number.',
        'number.min': 'Total amount paid cannot be negative.',
        'any.required': 'Total amount paid is required.'
    }),

    // lastVisit: Joi.date().iso().required().messages({
    //     'date.base': 'Last visit must be a valid date.',
    //     'date.format': 'Last visit must be in ISO format (YYYY-MM-DD).',
    //     'any.required': 'Last visit date is required.'
    // }),

    investigations: Joi.array().items(
        Joi.object().unknown(true) // ✅ Allows unknown keys if any extra fields exist
    ).default([]),

    chargesStatus: Joi.string()
    .valid('Paid', 'Unpaid', 'Pending')
    .insensitive()  // ✅ Allows case-insensitive match
    .required()
    .messages({
        'any.only': 'Charges status must be either Paid, Unpaid, or Pending.',
        'any.required': 'Charges status is required.'
    }),

    pendingAmount: Joi.number().min(0).required().messages({
        'number.base': 'Pending amount must be a number.',
        'number.min': 'Pending amount cannot be negative.',
        'any.required': 'Pending amount is required.'
    })
});
// const Joi = require("joi");

const specificpatientSchema = Joi.object({
  patient_id: Joi.number().integer().required(),
});

const visitSchema = Joi.object({
  medicines: Joi.array().items(
    Joi.object({
      medicine: Joi.string().required(),
      dose: Joi.string().required(),
    })
  ).required(),
  totalAmountPaid: Joi.number().required(),
  lastVisit: Joi.date().required(),
  Investigations: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
    })
  ).optional(),
//   chargesStatus: Joi.string().required(),
  pendingAmount: Joi.number().required(),
});

const RegisterSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.max': 'Name cannot be more than 50 characters.',
        'any.required': 'Name is required.'
    }),

    number: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Number must be exactly 10 digits.',
        'any.required': 'Number is required.'
    }),

    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required.'
    }),

    password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 20 characters.',
        'string.pattern.base': 'Password must contain at least one letter and one number.',
        'any.required': 'Password is required.'
    }) 
});
const LoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required.'
    }),

    password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 20 characters.',
        'string.pattern.base': 'Password must contain at least one letter and one number.',
        'any.required': 'Password is required.'
    }) 
})

const medicineSchema = Joi.object({
    name_medicine: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Medicine name cannot be empty.',
        'string.min': 'Medicine name must be at least 2 characters long.',
        'string.max': 'Medicine name cannot exceed 50 characters.',
        'any.required': 'Medicine name is required.'
    })
});

module.exports = {patientSchema,specificpatientSchema,RegisterSchema,LoginSchema,medicineSchema,visitSchema};
