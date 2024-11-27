const User = require('../../models/userModels/userModel');

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
};

/*exports.createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send(user);
};*/

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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: 'Já existe um usuário com este e-mail!' });
        }
        // conferindo se ja existe tal nome
        const existingNome = await User.findOne({ nome });
        if (existingNome) {
            return res.status(409).json({ msg: 'Já existe um usuário com este nome!' });
        }
        
        const user = new User({
            nome,
            email,
            senha, 
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
