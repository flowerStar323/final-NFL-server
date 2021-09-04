const MatchModel = require("../models/MatchModel");
const ActionModel = require("../models/ActionModel");
exports.saveMatch = (req, res) => {
    MatchModel.findOne({ weekNum: req.body.weekNum }).then(e => {
        if (e) {
            e.matches = req.body.matches;
            e.isLocked = req.body.isLocked;
            e.isOverflow = req.body.isOverflow;
            e.save().then(ee => {
                if (ee) res.json("update")
            }).catch(es => console.log(es))
        } else {
            new MatchModel(req.body)
                .save()
                .then(e => {
                    if (e) res.json("add");
                })
                .catch(err => console.log(err))
        }
        if (req.body.isOverflow === true) {
            var winteam = [], loseteam = [];
            req.body.matches.map((v, k) => {
                if (v.flag === 1) {
                    winteam.push(v.first);
                    loseteam.push(v.sec);
                }
                else if (v.flag === 2) {
                    winteam.push(v.sec);
                    loseteam.push(v.first);
                }
            });
            winteam.map((v, k) => {
                ActionModel.findOne({ selectTeamNo: v, weekNo: req.body.weekNum }).then(e => {
                    if (e) {
                        e.isOut = 1;
                        e.save().then();
                    }
                })
            });
            loseteam.map((v, k) => {
                ActionModel.findOne({ selectTeamNo: v, weekNo: req.body.weekNum }).then(e => {
                    if (e) {
                        e.isOut = 2;
                        e.save().then();
                    }
                })
            });
        }
    }).catch(er => console.log(er))
}
exports.getMatch = (req, res) => {
    MatchModel.find().then(e => res.json(e)).catch(er => console.log(er))
}
exports.getnowmatch = (req, res) => {
    MatchModel.findOne({ weekNum: req.body.weeknum }).then(e => res.json(e)).catch(er => console.log(er));
}
exports.getuseraction = (req, res) => {
    ActionModel.find({ userID: req.body.userid }).then(e => res.json(e)).catch(er => console.log(er));
}
exports.confirmaction = (req, res) => {//weekNum, entryname, userID
    var weeknum = req.body.weekNum - 1;
    ActionModel
        .find({ userID: req.body.userID, isOut: 2, entryname: req.body.entryname })
        .then(e => {
            if (e.length === 0) {
                // if (e[0].isOut === 2) {
                // return res.json("false");
                // }
                // else {
                return res.json("true");
                // }
            } else {
                return res.json("false");

            }
        })
        .catch(er => console.log(er));



}
exports.getleaderboard = (req, res) => {
    ActionModel
        .aggregate([{ $lookup: { from: "teamnames", localField: "selectTeamNo", foreignField: "No", as: "teamname" } }])
        .then(e => res.json(e))
        .catch(er => console.log(er));
}