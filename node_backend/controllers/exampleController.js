const exampleHandler = (req, res) => {
  res.json({ status: 'Node.js backend is up and running!' });
};

module.exports = { exampleHandler };