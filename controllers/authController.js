import express from "express"

export const registerUser = (req, res) => {
    return res.status(201).json({
        message:"user is regissted"
    })
}

export const loginUser= (req, res) => {
    return res.status(200).json({
        message:"user is logged in"
    })
}