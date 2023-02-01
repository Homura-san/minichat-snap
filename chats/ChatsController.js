const express = require('express');
const moment = require('moment');
const router = express.Router();
const Chat = require('./Chat')
const loginAuth = require('../middlewares/loginAuth')

router.post('/chat/send', loginAuth , (req, res) => {
    moment.locale('pt-br')
    var content = req.body.content;
    var name = req.session.user.name;
    var date = moment().format('llll');
    var userId = req.session.user.id;

    Chat.create({
        content: content,
        name: name,
        date: date,
        userId: userId
    }).then(() => {
        res.redirect('/')
    })
})

router.post('/chat/delete', loginAuth , (req, res) => {
    var id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            Chat.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/');
            })
        }else{// Não for um número
            console.log('not a number')
            res.redirect('/');
        }
    }else{// NULL
        console.log('is null')
        res.redirect('/');
    }
    
    
})

module.exports = router;