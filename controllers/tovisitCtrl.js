const Tovisits = require('../models/tovisitModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


const tovisitCtrl = {
    createTovisit: async (req, res) => {
        try {

            const { placeName } = req.body
            const newTovisit = new Tovisits({
                placeName, user: req.user._id
            })
            await newTovisit.save()

            res.json({
                msg: 'Create Tovisit!',
                newTovisit: {
                    ...newTovisit._doc,
                    user: req.user,
                }
            })

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    getTovisit: async (req, res) => {
        try {
            
            const features = new APIfeatures(Tovisits.find({
                user: req.params.id
            }), req.query).paginating()

            const tovisits = await features.query.sort('-createdAt')

            res.json({
                msg: "Success!",
                result: tovisits.length,
                tovisits
            })

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    updateTovisit: async (req, res) => {
        try {
            
            const { placeName } = req.body

            const tovisit = await Tovisits.findOneAndUpdate({_id: req.params.id}, {placeName})

            res.json({
                msg: "Updated Tovisit!",
                newTovisit: {
                    ...tovisit._doc,
                    placeName
                }
            })

        } catch (error) {
            return res.status(500).json({msg: error.message})
        } 
    },

    deleteTovisit: async (req, res) => {
        try {
            
            const tovisit = await Tovisits.findOneAndDelete({_id: req.params.id, user: req.user._id})

            res.json({
                msg: "Deleted Tovisit!",
                newTovisit: {
                    ...tovisit,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = tovisitCtrl