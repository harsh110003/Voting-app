const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Candidate = require('../models/candidate')
const {jwtAuth} = require('./../jwt')

const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID)
        if(user.role === 'admin'){
            return true
        }
    }
    catch(err){
        return false
    }
}


//post route to add a candidate
router.post('/' ,jwtAuth, async(req,res) => {
    try{
        if(!(await checkAdminRole(req.user.id))){
            console.log('not admin')
            return res.status(403).json({message: 'user does not have admin role'})}
        else{
            console.log('admin')
        }
        const data = req.body  //Assuring a request body contains the candidate data.
        const newCandidate = new Candidate(data)
        const response = await newCandidate.save()
        console.log('data saved')
        
        res.status(200).json({response : response})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})





router.put('/:candidateID',jwtAuth,  async(req,res) => {
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
        const candidateId = req.params.candidateID
        const updatedCandidateData = req.body
        const response = await Person.findByIdAndUpdate(candidateId, updatedCandidateData,{
            new : true,
            runValidators : true
        })
        if(!response){
            res.status(404).json({error : 'Candidate not found'})
        }
        console.log('candidate data updated')
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})


router.delete('/:candidateID',jwtAuth, async(req,res) => {
    try{
     if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
    const candidateId = req.params.candidateID // Extract the candidate ID from the request parameters
    const response = await Candidate.findByIdAndDelete(candidateId)

    if(!response){
        res.status(404).json({error : 'Candidate not found'})
    }
    console.log('Candidate deleted')
    res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

// let's start voting
router.post('/vote/:candidateID', jwtAuth, async (req,res) => {
    //no admin can vote
    //user can only vote once

    candidateID = req.params.candidateID
    userId = req.user.id

    try{
        //find the candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID)
        if(!candidate){
            return res.status(404).json({message : 'Candidate not found'})
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message : 'user not found'})
        }
        if(user.isVoted){
            res.status(400).json({message : 'You have already voted'})
        }
        if(user.role === 'admin'){
            res.status(403).json({ message : 'admin is not allowed'})
        }

        // update the candidate document to record the vote
        candidate.votes.push({user : userId})
        candidate.voteCount++
        await candidate.save()

        // update the user document
        user.isVoted = true
        await user.save()

        res.status(200).json({message : "Vote recorded successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : "Internal Server Error"})
    }
})

//vote count
router.get('/vote/count', async (req,res) => {
    try{
        //Find all candidates and sort them by voteCount in decreasing order
        const candidate = await Candidate.find().sort({voteCount : 'desc'})

        //Map the candidates to only return their name and voteCount
        const voteCount = candidate.map((data) => {
            return {
                party : data.party,
                count : data.voteCount
            }
        })
        return res.status(200).json(voteCount)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

router.get('/', async(req,res) => {
    try{
        const response = await Candidate.find()
        res.status(200).json(response)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error'})
    }
})
module.exports = router