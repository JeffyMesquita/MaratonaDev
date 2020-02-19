// Configurando o servidor
const express = require("express");
const server = express();

// Configurar o servidor para apresentar ar  quivos estáticos

server.use(express.static('public'));

// Habilitar o body o formulário
server.use(express.urlencoded({ extended: true }));

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
   user: 'postgres', 
   password: 'je42177891',
   host: 'localhost',
   port: 5432,
   database: 'doe'
});

// Configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
   express: server,
   noCache: true, //boolean ou booleano aceita 2 valores, verdadeiro ou falso
});


// Configurar a apresentação da página
server.get("/", (req, res) => {

   db.query("SELECT * FROM donors", (err, result) => {
      if (err) return res.send("Erro de banco de dados.");
      
      const donors = result.rows;
      return res.render("index.html", { donors });
   });   
});

server.post("/", (req, res) => {
   //pegar dados do formulário
   const name = req.body.name
   const email = req.body.email
   const blood = req.body.blood

   // Se o nome igual a vazio
   // OU o email iguak a vazio
   // OU o blood igual a vazio
   if (name == "" || email == "" || blood == "") {
      return res.send("Todos os campos são obrigatórios.")
   }

   // Coloco valores dentro do Banco de dados
   const query = `
      INSERT INTO donors ("name", "email","blood") VALUES ($1, $2, $3)`

   const values = [name, email, blood];

      db.query(query, values, (err) => {
         // Fluxo de erro
         if(err) return res.send("erro no banco de dados");

         // Fluxo ideal
         return res.redirect("/");
      });

   
});


// Ligar o servidor e permitir o acesso a porta 3000
server.listen(3000, () => {
   console.log("iniciei o Servidor!!");
});