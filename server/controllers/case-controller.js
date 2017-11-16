var Case = require('../models/case');
var CASE_LIMIT = 100;
var mongoose = require('mongoose');

module.exports = function (app) {

  app.get('/cases', function (req, res) {
    Case
      .find({})
      .limit(CASE_LIMIT)
      .exec(function (err, users) {
        if (err) {
          return res.json(500, err);
        }
        res.send(users);
      });
  });

  // Creates a Case
  app.post('/case', function (req, res) {
    // Check if case with that DR # does not already exist
    Case.count({drNumber: req.body.drNumber}, function (err, result) {
      if (err) {
        return res.status(400).json(err);
      }
      if (result > 0) {
        return res.status(404).json({text: 'DR Number already exists', value: req.body.drNumber});
      } else {
        var victimIDInput = req.body.victim;
        var userIDInput = req.body.lastModifiedBy;

        // Checks if victimID is valid
        if (victimIDInput.match(/^[0-9a-fA-F]{24}$/)) {
          // If valid, converts it into the ObjectID type from string
          var victimID = mongoose.Types.ObjectId(victimIDInput);
          // and reassigns it as the value of 'victim'
          req.body.victim = victimID;
        } else {
          return res.status(404).json({text: 'Victim ID is invalid', value: victimIDInput});
        }

        // Checks if UserID is valid COPIED CODE
        if (userIDInput.match(/^[0-9a-fA-F]{24}$/)) {
          // If valid, converts it into the ObjectID type from string
          var userID = mongoose.Types.ObjectId(userIDInput);
          // and reassigns it as the value of 'victim'
          req.body.lastModifiedBy = userID;
        } else {
          return res.status(404).json({text: 'User ID is invalid', value: userIDInput});
        }

        // Checks if suspectsIDs in array are valid SORTA COPIED CODE-- cleanup
        var suspectInput = req.body.suspects;
        var suspectIDs = [];
        for (var i in suspectInput) {
          if (suspectInput[i].match(/^[0-9a-fA-F]{24}$/)) {
            // If valid, converts it into the ObjectID type from string
            suspectIDs.push(mongoose.Types.ObjectId(suspectInput[i]));
          } else {
            return res.status(404).json({text: 'Suspect ID is invalid', value: suspectInput[i]});
          }
        }
        req.body.suspects = suspectIDs;

        Case.create(req.body, function (err, coupon) {
          if (err) {
            return res.status(400).json(err);
          }
          res.status(201).send(coupon);
        });
      }
    });
  });

  // Searches by drNum.
  app.get('/case/:id', function (req, res) {
    var id = req.params.id;
    Case.findOne({drNumber: id})
      .populate('victim')
      .populate('lastModifiedBy', 'name')
      .populate('suspects')
      .exec(function (err, result) {
        if (err) {
          return res.status(400).send(err);
        }
        if (!result) {
          return res.status(404).json({text: 'DR Num does not exist', value: id});
        }
        res.json(result);
      });
  });

  app.put('/case/:id', function (req, res) {
    var id = req.params.id;
    Case.update({_id: id}, req.body, function (err, numUpdated) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json({text: 'Number updated', value: numUpdated});
    });
  });

  app.delete('/case/:id', function (req, res) {
    var id = req.params.id;
    Case.remove({_id: id}, function (err) {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json({'Deleted Case': id});
    });
  });
};
