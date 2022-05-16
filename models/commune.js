const mongoose = require('mongoose');
const communeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    codeDepartment: { type: String, required: true },
    codeRegion: { type: String, required: true },
    codesPostaux: {type: String, required: true},
    population: { type: Number, required: true },
},
{
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at'
    } 
});

const Commune = mongoose.model('commune', communeSchema);
module.exports = Commune;