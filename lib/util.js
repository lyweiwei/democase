import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';


const statAsync = Promise.promisify(fs.stat);

function lookUpInternal(name, pathCur) {
  const pathFile = path.join(pathCur, name);
  return statAsync(pathFile)
    .then(() => pathFile)
    .catch(() => pathCur !== '/' && lookUpInternal(name, path.dirname(pathCur)));
}

export function lookUp(name, pathRoot = '.') {
  return lookUpInternal(name, path.resolve(pathRoot));
}
