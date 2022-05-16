const mongoose = require('mongoose');
const regionSchema = new mongoose.Schema({
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

const Region = mongoose.model('region', regionSchema);
module.exports = Region;