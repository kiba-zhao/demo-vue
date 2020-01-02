const { empty: isEmpty } = require('is');

function node_transform(mappings, schema, key, node, parent) {
  let _key = key++;
  schema[_key] = { ...node, parent, children: undefined };
  mappings[node.id] = [...(mappings[node.id] || []), _key];
  if (!isEmpty(node.children)) {
    schema[_key].child = [];
    for (let child of node.children) {
      key = node_transform(mappings, schema, key, child, _key);
    }
  }

  if (parent) {
    schema[parent].child.push(_key);
  }

  return key;
}

const mappings = {};
const schema = {};
const template = require('./template.json');
const fs = require('fs');
const path = require('path');
node_transform(mappings, schema, 1, template);
fs.writeFileSync(`${__dirname}/schema.json`, JSON.stringify(schema), { encoding: 'utf8' });
fs.writeFileSync(`${__dirname}/mappings.json`, JSON.stringify(mappings), { encoding: 'utf8' });
console.log(11111111111111, JSON.stringify(mappings));
