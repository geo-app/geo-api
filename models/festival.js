const mongoose = require('mongoose');
const festivalSchema = new mongoose.Schema({
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

const Festival = mongoose.model('festival', festivalSchema);
module.exports = Festival;