const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var totalreqs = 0;

server.use((req, res, next) => {
  totalreqs++;
  console.log(`Total de requisições realizadas até o momento: ${totalreqs}`);
  next();
});

function checkProjectId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(x => x.id === id);
  const projectIndex = projects.findIndex(x => x.id === id);

  if (!id)
    return res.json({ error: 'ID não localizado!' })

  if (!project || project === undefined)
    return res.json({ error: 'Projeto não localizado' })

  req.project = project;
  req.index = projectIndex;

  return next();
}

function checkParamsProject(req, res, next) {
  const { id, title } = req.body;

  if (!id)
    return res.json({ error: 'ID do projeto não foi localizado!' });

  if (!title)
    return res.json({ error: 'Título do projeto não foi localizado!' });

  return next();
}

function checkIdParamsProject(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;

  if (!id)
    return res.json({ error: 'ID do projeto não foi localizado!' });

  if (!title)
    return res.json({ error: 'O campo "title" está faltando!' });

  return next();
}

function checkIdProjectExsits(req, res, next) {
  const { id } = req.body;
  const project = projects.find(p => p.id === id);

  if (project)
    return res.json({ error: 'ID já existe!', project });

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectId, (req, res) => {
  return res.json(req.project);
});

server.post('/projects', checkParamsProject, checkIdProjectExsits, (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

server.put('/projects/:id', checkIdParamsProject, checkProjectId, (req, res) => {
  projects[req.index].title = req.body.title;
  return res.json(projects[req.index]);
});

server.delete('/projects/:id', checkProjectId, (req, res) => {
  projects.splice(req.index, 1);
  return res.json({ message: "Projeto deletado!" });
});

server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { title } = req.body;

  if (!title)
    return res.json({ error: 'Campo "title" é obrigatório!' });

  if (!projects[req.index]["tasks"])
    projects[req.index]["tasks"] = [];

  projects[req.index].tasks.push(req.body);
  return res.json(projects[req.index]);

});

server.listen(3000);