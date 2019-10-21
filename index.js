const express = require(`express`)

const server = express()

server.use(express.json())

const projects = []

//middlewares
//Crie um middleware que será utilizado em todas rotas que recebem o ID do
//projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe.
//Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;

function verifyIfExists(req, res, next) {

  const { id } = req.params
  project = projects.find(project => project.id === id)

  if (!project) {
    return res.status(400).json({ error: `Error 400. Are you sure if this project really exists?` })
  }

  req.project = project
  return next()
}
//Crie um middleware global chamado em todas requisições que imprime
//(console.log) uma contagem de quantas requisições foram feitas na aplicação até então;

let count = 0
server.use((req, res, next) => {

  count++

  console.log(`Número de Requisições: ${count}`)

  return next()

})


//fim-middlewares


//cadastrar projeto
server.post(`/projects/`, (req, res) => {

  const { id, title, tasks } = req.body

  projects.push({ "id": id, "title": title, tasks: [`${tasks}`] })

  return res.json({ message: `O projeto *${title}* foi cadastrado com sucesso!` })

})

//listar todas os projetos
server.get(`/projects/`, (req, res) => {

  return res.json({ projects })

})

//listar um projeto
server.get(`/projects/:id`, verifyIfExists, (req, res) => {

  return res.json({ project: req.project })

})


//alterar título do projeto
server.put(`/projects/:id`, verifyIfExists, (req, res) => {

  const { title } = req.body

  req.project.title = title

  return res.json({ new_name: `${req.project.title}` })

})

//deletar projeto
server.delete(`/projects/:id`, verifyIfExists, (req, res) => {

  const position = projects.indexOf(req.project)

  projects.splice(position, 1)
  return res.json({ info: "Deletado com sucesso", projects })
})

server.listen(3000)