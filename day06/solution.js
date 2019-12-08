const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const orbitMap = input.reduce((obj, orbit) => {
  const orbits = obj;
  const [src, orb] = orbit.split(')');
  if (orbits[src]) orbits[src].push(orb);
  else orbits[src] = [orb];
  return orbits;
}, {});

const Node = {
  init: function init(name) {
    this.name = name;
    this.children = [];
    return this;
  },
};

const GraphTree = {
  init: function init(rootName) {
    const rootNode = Object.create(Node);
    this.root = rootNode.init(rootName);
    return this.root;
  },

  build: function build(node) {
    if (!orbitMap[node.name]) return;
    orbitMap[node.name].forEach((orbit) => {
      const newChild = Object.create(Node);
      node.children.push(newChild.init(orbit));
    });
    node.children.forEach(child => this.build(child));
  },

  walk: function walk(node, level = 0) {
    if (!this.total) this.total = 0;
    this.total += node.children.length; // direct orbits
    this.total += level - 1; // indirect orbits
    node.children.forEach(child => this.walk(child, level + 1));
  },

  search: function search(lookFor) {
    let pathToTarget = '';
    const visited = {};
    const queue = [];
    queue.push(this.root);
    visited[this.root.name] = this.root.name;

    while (queue.length > 0) {
      const current = queue.shift();
      // eslint-disable-next-line no-loop-func
      current.children.forEach((child) => {
        if (child.name === lookFor) pathToTarget = visited[current.name];
        queue.push(child);
        visited[child.name] = `${visited[current.name]},${child.name}`;
      });
    }
    return pathToTarget;
  },
};

(function solution() {
  const tree = Object.create(GraphTree);
  const root = tree.init('COM');
  tree.build(root);
  tree.walk(root);
  console.log(tree.total + 1); // including the core, part 1

  const you = tree.search('YOU').split(',');
  const san = tree.search('SAN').split(',');

  // eslint-disable-next-line no-extend-native
  Array.prototype.diff = function diff(a) {
    return this.filter(i => !(a.indexOf(i) > -1));
  };

  console.log(you.diff(san).length + san.diff(you).length); // part 2
}());
