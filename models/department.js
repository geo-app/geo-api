const mongoose = require('mongoose');
const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberPlaces: { type: Number, required: true },
},
{
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at'
    } 
});

const Department = mongoose.model('department', departmentSchema);
module.exports = Department;