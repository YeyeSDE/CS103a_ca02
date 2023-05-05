require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const Code = require('../models/Code');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

isLoggedIn = (req,res,next) => {
    if (res.locals.loggedIn) {
      next()
    } else {
      res.redirect('/login')
    }
  }
  
const getIndex = async (req, res) => {
    const codes = await Code.find();
    res.render('code', { codes });
};

const startDebug = async (req, res) => {
    const codesBeforeDebug = req.body.code;
    const answer =  await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Debug for the input codes, just show me the corrected code.",
        max_tokens:2048,
        n:1,
        temperature:0.8,
    });
  
    const codesAfterDebug = answer.data.choices[0].text;
    const code = new Code({ codesBeforeDebug, codesAfterDebug });
    await code.save();
    res.redirect('/debug');
};

const getDebug = async (req, res) => {
    const codes = await Code.find();
    res.render('debug', {codes});
};

const deleteCode = async (req, res) => {
    const codeId = req.params.id;
    await Code.findByIdAndDelete(codeId);
    res.redirect('/codes');
};

router.get('/codes', isLoggedIn, getIndex);
router.post('/debug', isLoggedIn, startDebug);
router.get('/debug', isLoggedIn, getDebug);
router.delete('/debug/:id', isLoggedIn, deleteCode);

// export ths route, so it can be used elsewhere
module.exports = router;