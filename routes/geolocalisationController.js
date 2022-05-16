const express = require("express");
const router = express.Router();
const mFestival = require("../models/festival");
const response = require("../utils/response");

// Create festival
router.post("/post", (req, res) => {
    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = parseInt(req.body.numberPlaces);

    if (!name || !startDate || !endDate || !numberPlaces) {
        return res.json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }


    mFestival
    .findOne({
        name: name
    }).then(function (festivalFound){
        if(festivalFound) {
            return res.status(500).json(response.responseERROR("Festival already exist"));
        } else {
            new mFestival({
                name: name,
                startDate: startDate,
                endDate: endDate,
                numberPlaces: numberPlaces
            }).save()
            .then(function (newFestival) {
                // console.log(newFestival);
                if(newFestival) {
                    return res.status(201).json( response.responseOK(response.returnType.FESTIVAL.CREATED, { newFestival: newFestival}));
                } else {
                    return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_CREATE));
                }
            });
        }
    })
});

// Gets all festivals
router.get("/getAll", (req, res) => {
    // Query
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    let field;
    let direction;
    if(order) {
        field = order.split(":")[0];
        direction = order.split(":")[1];
    }

    mFestival
        .find()
        .sort(order ? {[field]: `${direction}`} : {name: 'asc'})
        .limit(!isNaN(limit) ? limit : null)
        .skip(!isNaN(offset) ? offset : null)
        .then(function (festivals) {
            if (festivals) {
                return res.status(200).json(
                    response.responseOK("Get all entities succesfully", {
                        festivals: festivals,
                    })
                );
            } else {
                res.status(200).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
            }
        })
        .catch(function (err) {
            res.status(500).json(response.responseERROR(response.returnType.INVALID_FIELDS));
        });
});


// Get festival by Id
router.get("/getById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id.trim();

    // Debug
    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mFestival
    .findOne({
        _id: idFestival
    }).then(function (festivalFound){
        return res.status(200).json(
            response.responseOK("Get entity succesfully", {
                festival: festivalFound,
            })
        );
    })
    .catch(function (err) {
        return res.status(404).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
    });
});


// Update festival by id
router.put("/updateById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id;

    // Body
    let name = req.body.name.trim();
    let startDate = req.body.startDate.trim();
    let endDate = req.body.endDate.trim();
    let numberPlaces = parseInt(req.body.numberPlaces);

    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mFestival
    .findOne({
        _id : idFestival
    }).then(function (festivalFound) {
        if(festivalFound) {
            festivalFound.updateOne( 
                {name: name},
                {startDate: startDate},
                {endDate: endDate},
                {numberPlaces: numberPlaces}
            ).then(function(festivalUpdated) {
                if(festivalUpdated) {
                    mFestival
                    .findOne({
                        _id : idFestival
                    }).then(function(festivalUpdated) {
                        return res.status(201).json(response.responseOK(response.returnType.FESTIVAL.UPDATED, { festivalUpdated: festivalUpdated}))
                    })
                }
            })
            .catch(function (err) {
                return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_UPDATE));
            }); 
        } else {
            return res.status(404).json(response.responseERROR(response.returnType.FESTIVAL.NOT_FOUND));
        }
    })
    .catch(function (err) {
        return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_UPDATE));
    });
});


// Delete festival by id
router.delete("/deleteById/:id", (req, res) => {
    // Params
    let idFestival = req.params.id.trim();

    // Debug
    if (!idFestival) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    console.log(idFestival);

    mFestival
    .findOne({
        _id : idFestival
    }).then(function (festivalFound) {
        if(festivalFound) {
            festivalFound.delete();
            return res.status(201).json(response.responseOK(response.returnType.FESTIVAL.DESTROY)) 
        } else {
            return res.status(201).json(response.responseOK(response.returnType.FESTIVAL.NOT_FOUND)) 
        }
    })
    .catch(function (err) {
        // console.log(err);
        return res.status(500).json(response.responseERROR(response.returnType.FESTIVAL.CANT_DELETE));
    });
});

module.exports = router;
