const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session');
const connection = require('./database/database')

const usersController = require('./users/UsersController')
const chatsController = require('./chats/ChatsController')

const loginAuth = require('./middlewares/loginAuth')

const User = require('./users/User')
const Chat = require('./chats/Chat')

//view engine
app.set('view engine', 'ejs')

// Session
app.use(session({
    secret: "lapowjgiuha", cookie: {maxAge: 36000000 }
}))

//Static
app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita"')
    }).catch((err) => {console.log(err)})

// Rotas dos controllers
app.use('/', chatsController);
app.use('/', usersController)

app.get('/', loginAuth , (req, res) => {
    var idSession = req.session.user.id;
    Chat.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(chats => {
        res.render("index", {chats: chats, idSession: idSession})
    })
})

app.listen(8080, () => {
    console.log('Servidor rodando...')
})
