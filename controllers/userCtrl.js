const Users = require('../models/userModel')

// const redisClient = require("../models/redis.js");

const DEFAULT_EXPIRATION = 3600


// function  getOrSetCache(key,cb){
//     return new Promise((resolve,reject) => { 
//         redisClient.get(key, async (error,data) => {
//             if (error) return reject(error)
//             if (data!=null) {
//                 console.log("Data Fetched from redis!!!") 
//                 return resolve(JSON.parse(data))
//             }
//             console.log("Data Fetched from DataBase!!!")
//             const freshData = await cb()
//             redisClient.setEx(key,DEFAULT_EXPIRATION,JSON.stringify(freshData))
//             resolve(freshData)
//         })
//     })
// }

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            // const users = await getOrSetCache(`searchUser:${req.query.username}`, async ()=>{
            //     const users = await Users.find({username: {$regex: req.query.username}})
            //     .limit(10).select("fullname username avatar")
            //     return users;
            //  })
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            // const user = await getOrSetCache(`user:${req.params.id}`, async ()=>{
            //     // console.log("ehwbefb");
            //     const user = await Users.findById(req.params.id).select('-password')
            //     .populate("followers following", "-password")
            //     if(!user) return res.status(400).json({msg: "User does not exist."})
                
            //     return user;
            //  })
            // res.json({user})
            const user = await Users.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            console.log(user)
            res.json({user})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, story, website, gender } = req.body
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 10
            // const users = await getOrSetCache(`suggestionUsers:${req.user.id}`, async()=>{
                const users = await Users.aggregate([
                    { $match: { _id: { $nin: newArr } } },
                    { $sample: { size: Number(num) } },
                    { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                    { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
                ]).project("-password")
                // return users
            // })
            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = userCtrl