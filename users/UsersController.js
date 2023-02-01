const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const loginAuth = require('../middlewares/loginAuth')

router.get('/cadastro', (req, res) => {
    res.render('admin/cadastro')
});

router.post('/cadastro/create', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user  == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                name: name,
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/login');
            }).catch((err) => {
                res.redirect('/cadastro');
            })
        }else{
            res.redirect('/cadastro');
        }
    });
});

router.get('/user/edit/:id', loginAuth, (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect('/');
    };

    User.findByPk(id).then(user => {
        if(user != undefined){
            res.render('admin/edit', {user: user});
        }else{
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    })
})

router.post('/user/update', loginAuth, (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    // var password = req.body.password;

    User.update({name: name, email: email}, {
        where: {id: id}
    }).then(() => {
        res.redirect('/')
    }).catch(err => {res.redirect('/users/edit')})
});

router.get('/login', (req, res) => {
    res.render('admin/login')
});

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if (user != undefined){ // Se existe um usuário com esse email
            // Validar a senha
            var correct = bcrypt.compareSync(password, user.password)

            if (correct){
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect('/');
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login');
        }
    });

});

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
});


module.exports = router;