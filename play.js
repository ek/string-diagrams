const objects = {
  x1: { label: 'x1' },
  x2: { label: 'x2' },
  x3: { label: 'x3' },
  x4: { label: 'x4' },
  x5: { label: 'x5' },
  x6: { label: 'x6' },
  x7: { label: 'x7' }
};
const functions = {
  f1: { label: 'f1' },
  f2: { label: 'f2' },
  f3: { label: 'f3' },
  f4: { label: 'f4' },
};
const links = [
  { from: 'x1', to: 'f1' },
  { from: 'f1', to: 'x3' },
  { from: 'f1', to: 'x4' },
  { from: 'x2', to: 'f2' },
  { from: 'f2', to: 'x5' },
  { from: 'x3', to: 'f3' },
  { from: 'f3', to: 'x6' },
  { from: 'x4', to: 'f4' },
  { from: 'x5', to: 'f4' },
  { from: 'f4', to: 'x7' },
  { from: 'x8', to: 'x9' }
]

const froms = links.map(v => v.from)
const tos = links.map(v => v.to)

// links at the beginning of the diagram
const diagramIns = froms.filter(v => !tos.includes(v))
// links at the end of the diagram
const diagramOuts = tos.filter(v => !froms.includes(v))

const followPath = (links, last, path) => {
  const nextSteps = links.filter(v => v.from === last)
  if(nextSteps.length > 1) {
    const nextPaths = nextSteps.map(step => {
      const newPath = [...path] // clone existing path
      newPath.push(step.to); // add current step
      return followPath(links, step.to, newPath); // recursively search
    });
    return nextPaths; // report back up the ladder
  } else if(nextSteps.length === 1) {
    // only one step matches
    path.push(nextSteps[0].to); // add current step
    return followPath(links, nextSteps[0].to, path) // recursively search
  }
  // no next steps found, this is the end of the line.
  return path; 
}

// recursively flatten nested arrays of paths to single array of paths
const flattenPaths = (paths, flats) => {
  paths.filter(p => typeof p[0] === 'string').forEach(p => flats.push(p));
  paths.filter(p => typeof p[0] === 'object').forEach(p => {
    return flattenPaths(p, flats)
  });
  return flats;
}

// for each starting point, map each path through the diagram
// wrapped in function to flatten arrays
const paths = flattenPaths(
  diagramIns.map(start => {
    return path = followPath(links, start, [start])
  })
, []);

const pathLengths = paths.map(p => p.length)
const maxPathLength = pathLengths.reduce((p,c) => { return p > c ? p : c })
const minPathLength = pathLengths.reduce((p,c) => { return p < c ? p : c })

// if path is shorter, insert extensions
const extendPaths = (path, length) => {
  while(path.length < length) {
    // insert spaces
    path.splice(1, 0, path[0])
  }
  return path
};


paths.filter(v => v.length < maxPathLength).forEach(v => {
  extendPaths(v, maxPathLength)
})

const columns = Array.from(new Array(maxPathLength)).map(v => []);

columns.map((c,i) => {
  paths.forEach((p,j) => {
    if(!c.includes(p[i])) {
      c.push(p[i])
    }
  });
  return c;
})


const diagramLayout = {
  columns: columns,
  paths: paths,
}

console.log(diagramLayout)

// export default diagramLayout

