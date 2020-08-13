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
  f1: { label: 'f1', in: ['x1'], out: ['x3', 'x4'] },
  f2: { label: 'f2', in: ['x2'], out: ['x5'] },
  f3: { label: 'f3', in: ['x3'], out: ['x6'] },
  f4: { label: 'f4', in: ['x4', 'x5'], out: ['x7'] },
};

const objectKeys = Object.keys(objects);
const functionKeys = Object.keys(functions);
const links = functionKeys.map(f => {
  // from ins to functions
  const ins = functions[f].in.map(i => { return { from: i, to: f } });
  // from outs to functions
  const outs = functions[f].out.map(o => { return { from: f, to: o } });
  return ins.concat(outs);
});


const flatLinks = [].concat(...links)
const froms = flatLinks.map(v => v.from)
const tos = flatLinks.map(v => v.to)


console.log(flatLinks)

// froms that are not tos for any other link
const diagramIns = froms.filter(v => !tos.includes(v))
// tos that are not froms for any other link
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

const paths = diagramIns.map(start => {
  return path = followPath(flatLinks, start, [start])
})

// recursively flatten nested arrays of paths to single array of paths
const flattenPaths = (paths, flats) => {
  paths.filter(p => typeof p[0] === 'string').forEach(p => flats.push(p));
  paths.filter(p => typeof p[0] === 'object').forEach(p => {
    return flattenPaths(p, flats)
  });
  return flats;
}

const flats = flattenPaths(paths, [])

