// Data
const uses = require("../data/uses-data");

// Middleware functions
const useExists = (req, res, next) => {
  const { useId } = req.params;
  const foundUse = uses.find(use => use.id === Number(useId));
  if (foundUse) {
    res.locals.url = foundUse;
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}`
  });
};


// Router functions
const list = (req, res) => {
  const { urlId } = req.params;
 res.json({ data: uses.filter(urlId ? use => use.urlId === Number(urlId) : () => true) });
}

const read = (req, res) => {
  const { urlId, useId } = req.params;  
  res.json({ data: uses.find(urlId ? use => use.urlId === Number(urlId) && use.id === Number(useId) : () => true) });
}

const destroy = (req, res) => {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  const deletedUse = uses.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  read: [
    useExists,
    read
  ],
  delete: [
    useExists,
    destroy
  ],
  list,
}