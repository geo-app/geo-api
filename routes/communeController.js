const express = require("express");
const router = express.Router();
const mCommune = require("../models/commune");
const response = require("../utils/response");

// Create entity
router.post("/commune", (req, res) => {
    // Body
    let name = req.body.name.trim();
    let code = req.body.code.trim();
    let codeDepartment = req.body.codeDepartment.trim();
    let codeRegion = req.body.codeRegion.trim();
    let codesPostaux = req.body.codesPostaux.trim();
    let population = parseInt(req.body.population);

    if (!code || !codeDepartment || !codeRegion || !codesPostaux || population) {
        return res.json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }


    mCommune
    .findOne({
        name: name
    }).then(function (communeFound){
        if(communeFound) {
            return res.status(500).json(response.responseERROR("commune already exist"));
        } else {
            new mCommune({
                name: name,
                code: code,
                codeDepartment: codeDepartment,
                codeRegion: codeRegion,
                codesPostaux: codesPostaux,
                population: population,
            }).save()
            .then(function (newCommune) {
                // console.log(newcommune);
                if(newCommune) {
                    return res.status(201).json( response.responseOK(response.returnType.entity.CREATED, { newCommune: newCommune}));
                } else {
                    return res.status(500).json(response.responseERROR(response.returnType.entity.CANT_CREATE));
                }
            });
        }
    })
});

// Gets all entities
router.get("/communes", (req, res) => {
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

    mCommune
        .find()
        .sort(order ? {[field]: `${direction}`} : {name: 'asc'})
        .limit(!isNaN(limit) ? limit : null)
        .skip(!isNaN(offset) ? offset : null)
        .then(function (communesFound) {
            if (communesFound) {
                return res.status(200).json(
                    response.responseOK("Get all entities succesfully", {
                        communes: communesFound,
                    })
                );
            } else {
                res.status(200).json(response.responseERROR(response.returnType.entity.NOT_FOUND));
            }
        })
        .catch(function (err) {
            res.status(500).json(response.responseERROR(response.returnType.INVALID_FIELDS));
        });
});


// Get entity by Id
router.get("/commune/:id", (req, res) => {
    // Params
    let idCommune = req.params.id.trim();

    // Debug
    if (!idCommune) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mCommune
    .findOne({
        _id: idCommune
    }).then(function (communeFound){
        return res.status(200).json(
            response.responseOK("Get entity succesfully", {
                commune: communeFound,
            })
        );
    })
    .catch(function (err) {
        return res.status(404).json(response.responseERROR(response.returnType.entity.NOT_FOUND));
    });
});


// Search by term
router.get("/search", async (req, res) => {
    // Query
    let term = req.query.term;
    
    await mCommune
        .aggregate([
            {
                $search: {
                    "index": 'default',
                    "autocomplete": {
                        "query": `${term}`,
                        "path": "nom"
                    }
                }
            }
        ])
        .then(function (communesFound) {
            if (communesFound.length > 0) {
                return res.status(200).json(
                    response.responseOK("Get all entities succesfully", {
                        communes: communesFound,
                    })
                );
            } else {
                res.status(200).json(response.responseERROR(response.returnType.entity.NOT_FOUND));
            }
        })
        .catch(function (err) {
            res.status(500).json(response.responseERROR(response.returnType.INVALID_FIELDS));
        });
});


// Search by term
router.get("/communes-by-population", async (req, res) => {
    // Query
    let min = req.query.min;
    let max = req.query.max;
    let direction = req.query.direction;

    if(direction == "desc"){
        direction = -1;
    } else if(direction == "asc") {
        direction = 1;
    } else {
        direction = -1;
    }

    // console.log(min);    
    // console.log(max);    
    // console.log(direction);    
    await mCommune
        .find({ "$and": [ { population: { "$gte" : parseInt(min)} }, { population: { "$lte": parseInt(max) }} ]}).sort({ population: direction})
        .then(function (communesFound) {
            if (communesFound.length > 0) {
                return res.status(200).json(
                    response.responseOK("Get all entities succesfully", {
                        communes: communesFound,
                    })
                );
            } else {
                res.status(200).json(response.responseERROR(response.returnType.entity.NOT_FOUND));
            }
        })
        .catch(function (err) {
            res.status(500).json(response.responseERROR(response.returnType.INVALID_FIELDS));
        });
});


// Update entity by id
router.put("/commune/:id", (req, res) => {
    // Params
    let idCommune = req.params.id;

    // Body
    let name = req.body.name.trim();
    let code = req.body.code.trim();
    let codeDepartment = req.body.codeDepartment.trim();
    let codeRegion = req.body.codeRegion.trim();
    let codesPostaux = req.body.codesPostaux.trim();
    let population = parseInt(req.body.population);

      if (!idCommune && !code || !codeDepartment || !codeRegion || !codesPostaux || population) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }


    mCommune
    .findOne({
        _id : idCommune
    }).then(function (communeFound) {
        if(communeFound) {
            communeFound.updateOne( 
                {name: name},
                {code: code},
                {codeDepartment: codeDepartment},
                {codeRegion: codeRegion},
                {codesPostaux: codesPostaux},
                {population: population}
            ).then(function(communeUpdated) {
                if(communeUpdated) {
                    mCommune
                    .findOne({
                        _id : idCommune
                    }).then(function(communeUpdated) {
                        return res.status(201).json(response.responseOK(response.returnType.entity.UPDATED, { communeUpdated: communeUpdated}))
                    })
                }
            })
            .catch(function (err) {
                return res.status(500).json(response.responseERROR(response.returnType.entity.CANT_UPDATE));
            }); 
        } else {
            return res.status(404).json(response.responseERROR(response.returnType.entity.NOT_FOUND));
        }
    })
    .catch(function (err) {
        return res.status(500).json(response.responseERROR(response.returnType.entity.CANT_UPDATE));
    });
});


// Delete entity by id
router.delete("/commune/:id", (req, res) => {
    // Params
    let idCommune = req.params.id.trim();

    // Debug
    if (!idCommune) {
        return res.status(400).json(response.responseERROR(response.returnType.INVALID_FIELDS));
    }

    mCommune
    .findOne({
        _id : idCommune
    }).then(function (communeFound) {
        if(communeFound) {
            communeFound.delete();
            return res.status(201).json(response.responseOK(response.returnType.entity.DESTROY)) 
        } else {
            return res.status(201).json(response.responseOK(response.returnType.entity.NOT_FOUND)) 
        }
    })
    .catch(function (err) {
        // console.log(err);
        return res.status(500).json(response.responseERROR(response.returnType.entity.CANT_DELETE));
    });
});

module.exports = router;
