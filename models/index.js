
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function(app) {

  var User = new Schema({
      "provider": { type: String, required: true }
    , "provider_id": { type: Number, required: true }
    , "username": { type: String, required: true }
    , "name": { type: String, required: true }
    , "email": { type: String, validate: /.+@.+\..+/ }
    , "picture": String
    , "admin_in": { type: [String], default: [] }
    , "bio": String
    , "created_at": {type: Date, default: Date.now }
  });

  mongoose.model('User', User);

  var Project = new Schema({
      "title": { type: String, required: true }
    , "domain": String
    , "description": { type: String, required: true }
    , "leader": { type: ObjectId, required: true, ref: 'User' }
    , "status": { type: String, enum: app.get('statuses'), default: app.get('statuses')[0] }
    , "contributors": [{ type: ObjectId, ref: 'User'}]
    , "followers": [{ type: ObjectId, ref: 'User'}]
    , "cover": String
    , "link": String
    , "tags": [String]
    , "created_at": { type: Date, default: Date.now }
  });

  mongoose.model('Project', Project);

  var Dashboard = new Schema({
      "domain": String
    , "title": { type: String, default: "HackDash" }
    , "description": { type: String, default: "A dashboard for Hackatons" }
    , "background": { type: String, default: "#333" }
    , "created_at": { type:Date, default: Date.now }
    , "created_at": { type: Date, default: Date.now }
  });

  Dashboard.path('description').validate(function(value) {
    value.length <= 140;
  });


  mongoose.model('Dashboard', Dashboard);
};
