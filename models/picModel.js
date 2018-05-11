const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picModelSchema = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    }
});

const picModel = mongoose.model('picModels', picModelSchema);