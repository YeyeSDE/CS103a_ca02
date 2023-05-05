const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const codeSchema = new mongoose.Schema ({
    codesBeforeDebug: String,
    codesAfterDebug: String,
    userId: {type:ObjectId, ref: 'user'}
});

module.exports = mongoose.model('Code', codeSchema);