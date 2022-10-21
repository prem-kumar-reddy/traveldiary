import axios from 'axios'
const Redis = require('redis')
const redisClient = Redis.createClient()

const DEFAULT_EXPIRATION = 3600

export const getDataAPI = async (url, token) => {
    // const data = await getOrSetCache(`${url}`, async ()=>{
    //     const res = await axios.get(`/api/${url}`, {
    //         headers: { Authorization: token}
    //     })
    //     console.log("ehwbefb")
    //     return res;
    //  })
    // return data;
    const res = axios.get(`/api/${url}`, {
        headers: { Authorization: token}
    })
    console.log(JSON.stringify(url))
    return res;
}

export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`/api/${url}`, post, {
        headers: { Authorization: token}
    })
    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`/api/${url}`, {
        headers: { Authorization: token}
    })
    return res;
}

function  getOrSetCache(key,cb){
    return new Promise((resolve,reject)=>{
        redisClient.get(key,async (error,data)=>{
            if (error) return reject(error)
            if (data!=null) return resolve(JSON.parse(data))
            const freshData = await cb()
            redisClient.setEx(key, DEFAULT_EXPIRATION,JSON.stringify(freshData))
            resolve(freshData)
        })
    })
}