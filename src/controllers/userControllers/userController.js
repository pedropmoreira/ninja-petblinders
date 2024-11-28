const User = require('../../models/userModels/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
};

/*exports.createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
};*/

// retorna user unico se tiver token 
exports.getUserbyId = async (req, res) => {
    let id = req.params.id;

    // Verifica se a string é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const user = await User.findById(id, '-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }

        // Retorna o usuário encontrado
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor.' });
    }
};


exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
};

exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
};

// função de registro
exports.createUser = async (req, res) => {
    try {
        const { nome, email, senha, confirmPassword, vendedor, image_url } = req.body;
        // trys padroes
        if (!nome) {
            return res.status(422).json({ msg: 'O nome é obrigatório!' });
        }
        if (!email) {
            return res.status(422).json({ msg: 'O e-mail é obrigatório!' });
        }
        if (!senha) {
            return res.status(422).json({ msg: 'A senha é obrigatória!' });
        }
        if (senha !== confirmPassword) {
            return res.status(422).json({ msg: 'As senhas não conferem!' });
        }
        if (typeof vendedor !== 'undefined' && typeof vendedor !== 'boolean') {
            return res.status(422).json({ msg: 'O campo vendedor deve ser um booleano!' });
        }
        // conferindo se ja existe tal email
        const existingUser = await User.findOne({ email:email });
        if (existingUser) {
            return res.status(409).json({ msg: 'Já existe um usuário com este e-mail!' });
        }
        // conferindo se ja existe tal nome
        const existingNome = await User.findOne({ nome: nome });
        if (existingNome) {
            return res.status(409).json({ msg: 'Já existe um usuário com este nome!' });
        }
        //create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(senha,salt)

        const user = new User({
            nome,
            email,
            senha: passwordHash, 
            vendedor: vendedor || false, 
            carrinho:[],
            image_url: image_url || null, 
        });

        await user.save();

        return res.status(201).json({ msg: 'Usuário criado com sucesso!', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Ocorreu um erro no servidor.' });
    }
};

//rota login
exports.login = async (req, res) => {
    const {email,senha} = req.body;
    if (!email) {
        return res.status(422).json({ msg: 'O e-mail é obrigatório!' });
    }
    if (!senha) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    }
    // logica do login agora ne 
    const user = await User.findOne({ email:email });
    if (!user) {
        return res.status(404).json({ msg: 'Usuário nao encontrado!' });
        }
    //testa a senha com o user 
    const checkPassword = await bcrypt.compare(senha, user.senha);
 
    if (!checkPassword) { 
        return res.status(422).json({ msg: 'Senha invalida'});
    }
    

    try{
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id,

        },
        secret,)
        res.status(200).json({msg:"Logado com sucesso",token})

    }catch(err){
        console.log(err)

        res.status(500).json({msg:"Aconteceu um erro no servidor tente mais tarde "})
    }
};