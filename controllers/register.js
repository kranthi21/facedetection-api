
const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if(!email || !password || !name){
        return res.status(400).json('input field are empty');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .returning('email')
        .into('login')
        .then(loginEmail => {
            return trx('users')
                .returning('*') // will return an array with that entry only 
                .insert({
                        name: name,
                        email : loginEmail[0].email,
                        joined: new Date()
                })
                .then(data => {
                    res.json(data[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register", err));

}

module.exports = {
    handleRegister: handleRegister
};