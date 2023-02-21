const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const loginAuth = require('../middlewares/loginAuth')


class UpdateUser{
    static async userUpdate(userfield, userid){
        User.update({...userfield}, {
            where: {id: userid}
        })
    }
}

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

router.post('/user/update/:type', loginAuth, (req, res) => {
    var type = req.params.type;
    var id = req.body.id;

    var name = req.body.name;
    var newemail = req.body.email;

    var confPass = req.body.confPass
    var newPass = req.body.newPass;
    var passControl = req.body.passControl;
    
    // var password = req.body.password;

    if(type == 'updateName'){
        try {
            UpdateUser.userUpdate({name: name}, id);
            res.redirect('/');
        } catch (error) {
            res.redirect(`/user/edit/${id}`);
        }
    };

    if(type == 'updateEmail'){
        User.findOne({where: {email: newemail}}).then(email => {
            
            
            if (email == undefined){
                User.findOne({where: {id: id}}).then(user => {
                    var correct = bcrypt.compareSync(confPass, user.password)
        
                    if(correct){
                        try {
                            UpdateUser.userUpdate({email: newemail}, id)
                            res.redirect('/')
                        } catch (error) {
                            res.redirect(`/user/edit/${id}`)
                        };
                    }else{
                        res.redirect(`/user/edit/${id}`)
                    };
                });
            }else{res.redirect(`/user/edit/${id}`)};
        });
        
        
    };

    if(type == 'updatePass'){
        

        if(newPass == passControl){
            User.findOne({where: {id: id}}).then(user => {
                var correct = bcrypt.compareSync(confPass, user.password)
                
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newPass, salt);

                if(correct){
                    try {
                        UpdateUser.userUpdate({password: hash}, id)
                        res.redirect('/')
                    } catch (error) {
                        res.redirect(`/user/edit/${id}`)
                    }
                }else{
                    res.redirect(`/user/edit/${id}`)
                }
            })
        }else{res.redirect(`/user/edit/${id}`)};
    };
    
    
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