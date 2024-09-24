// Data
const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

// Middleware functions
const bodyDataHas = (propertyName) => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
     next({
    status: 400,
    message: `Must include a ${propertyName}`
  });
  }
};

const urlExists = (req, res, next) => {
  const { urlId } = req.params;
  const foundUrl = urls.find(url => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    console.log(res.locals.url);
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`,
  });
}

const hrefPropertyIsValid = (req, res, next) => {
  const { data: { href } = {} } = req.body;
  if (href && href !== "") return next();
  next({
    status: 400,
    message: `An 'href' property is required.`
  })
}


// Router functions
// Variable to hold the next ID
let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

const create = (req, res) => {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: ++lastUrlId,
    href: href,
  }
  urls.push(newUrl);
  res.status(201).json({ data: newUrl })
}

const list = (req, res) => {
  res.json({ data: urls });
};

// Variable to hold the next ID
let lastusesId = uses.reduce((maxId, url) => Math.max(maxId, url.id), 0);

const read = (req, res) => {
  const newUse = {
    id:++lastusesId,
    urlId: Number(res.locals.url.id),
    time: Date.now(),
  }
  uses.push(newUse);
  res.json({ data: res.locals.url });
}

const update = (req, res) => {
  const { data: { href } = {} } = req.body;
  const url = res.locals.url;
  url.href = href;
  res.json({ data: url });
}

module.exports = {
  create: [
    bodyDataHas("href"),
    hrefPropertyIsValid,
    create,
    bodyDataHas("id")
  ],
  list,
  update: [
    bodyDataHas("href"),
    bodyDataHas("id"),
    hrefPropertyIsValid,
    urlExists,
    update
  ],
  read: [
    urlExists,
    read
  ],
  urlExists,
}