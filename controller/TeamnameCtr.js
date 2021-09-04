const TeamModel = require("../models/TeamnameModel");
exports.getname = (req, res) => {
    TeamModel.find().then(e => res.send(e)).catch(err => console.log(err))
}