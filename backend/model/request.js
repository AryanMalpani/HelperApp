var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = require("./user.js");
requestSchema = new Schema( {
	title: String,
	starttime: Date,
	desc: String,
	type: String,
	// image: String,
	seeker_id: {type: Schema.ObjectId, ref: user},
	is_delete: { type: Boolean, default: false },
	is_complete: { type: Boolean, default: false },
	volunteer_id: {type: Schema.ObjectId, ref: user, default:null},
	date : { type : Date, default: Date.now },
}),
request = mongoose.model('request', requestSchema);

module.exports = request;