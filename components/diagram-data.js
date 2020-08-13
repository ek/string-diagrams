const elements = {
  x1: { label: 'x1', type: "datum" },
  x2: { label: 'x2', type: "datum" },
  x3: { label: 'x3', type: "datum" },
  x4: { label: 'x4', type: "datum" },
  x5: { label: 'x5', type: "datum" },
  x6: { label: 'x6', type: "datum" },
  x7: { label: 'x7', type: "datum" },
  x8: { label: 'x8', type: 'datum' },
  x9: { label: 'x9', type: 'datum' },
  x10: { label: 'x10', type: 'datum' },
  x11: { label: 'x11', type: 'datum' },
  x12: { label: 'x12', type: 'datum'}, 

  f1: { label: 'f1', type: "morph" },
  f2: { label: 'f2', type: "morph" },
  f3: { label: 'f3', type: "morph" },
  f4: { label: 'f4', type: "morph" },
  f5: { label: 'f5', type: "morph" },
  f6: { label: 'f6', type: "morph" },
  f7: { label: 'f7', type: "morph" },
  f8: { label: 'f8', type: 'morph' }
  
}
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
  { from: 'x8', to: 'f5' },

  { from: 'f5', to: 'x1' },
  { from: 'f5', to: 'x2' },
  { from: 'x9', to: 'f6' },

  { from: 'f6', to: 'x10' },
  { from: 'x10', to: 'f2' },
  { from: 'x11', to: 'f7' },
  { from: 'f7', to: 'x12'},

  { from: 'x12', to: 'f8'},
  { from: 'f8',  to: 'f4' }
  
  
]

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}

const spaces = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}

const sizes = {
  width: 800,
  height: 300,
}


const froms = links.map(v => v.from)

const tos = links.map(v => v.to)

// links at the beginning of the diagram
const diagramIns = froms.filter(v => !tos.includes(v))

// links at the end of the diagram
const diagramOuts = tos.filter(v => !froms.includes(v))

const followPath = (links, last, pathArr) => {
  const nextSteps = links.filter(v => v.from === last)
  if(nextSteps.length > 1) {
    const nextPaths = nextSteps.map(step => {
      const newPath = [...pathArr] // clone existing path
      newPath.push(step.to) // add current step
      return followPath(links, step.to, newPath) // recursively search
    })
    return nextPaths // report back up the ladder
  } else if(nextSteps.length === 1) {
    // only one step matches
    pathArr.push(nextSteps[0].to) // add current step
    return followPath(links, nextSteps[0].to, pathArr) // recursively search
  }
  // no next steps found, this is the end of the line.
  return pathArr
}

// recursively flatten nested arrays of paths to single array of paths
const flattenPaths = (paths, flats) => {
  paths.filter(p => typeof p[0] === 'string').forEach(p => flats.push(p))
  paths.filter(p => typeof p[0] === 'object').forEach(p => {
    return flattenPaths(p, flats)
  })
  return flats
}

// for each starting point, map each path through the diagram
// wrapped in function to flatten arrays
const paths = flattenPaths(
  diagramIns.map(start => {
    return followPath(links, start, [start])
  })
, [])


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
}

// filter paths to those that require extension, and apply extension
/*paths.filter(v => v.length < maxPathLength).forEach(v => {
  extendPaths(v, maxPathLength)
})
*/

const findEl = (key) => elements[key]

// define columns in diagram
const columns = Array.from(new Array(maxPathLength)).map(v => [])
sizes.columnWidth = sizes.width / columns.length;

// distribute elements across columns
columns.map((c,i) => {
  paths.forEach((p,j) => {
    if(!c.includes(p[i])) {
      c.push(p[i])
    }
  })
  return c
})

console.log('paths: ', paths, 'columns', columns)


// define diagram data for d3
columns.map((segments,i) => {
  // each column has different number of segments
  const segmentHeight = sizes.height / segments.length;
  segments.forEach((k,j) => {
    const el = findEl(k)
    if(typeof el === 'undefined') {
      console.log(k)
    } else {
      el.position = { 
        x: (i * sizes.columnWidth) + (sizes.columnWidth / 2) ,
        y: ((j+1) * segmentHeight) - (segmentHeight / 2)
      }
      if(el.type == 'morph') {
        // define function box graphic
        el.size = {
          height: segmentHeight - spaces.top - spaces.bottom,
          width: sizes.columnWidth - spaces.left - spaces.right
        }
        el.box = {
          top: el.position.y - (el.size.height / 2),
          bottom: el.position.y + (el.size.height / 2),
          left: el.position.x - (el.size.width / 2),
          right: el.position.x + (el.size.width / 2)
        }
        // define inputs for function
        const ins = links.filter(v => v.to === k)
        el.inputSegmentSize = el.size.height / ins.length
        el.inputs = ins.map((input,l) => {
          input.end = {
            x: el.box.left,
            y: el.box.top + (el.inputSegmentSize * (l+1)) - (el.inputSegmentSize / 2),
          }
          return input
        })
        // define outputs for function
        const outs = links.filter(v => v.from === k)
        el.outputSegmentSize = el.size.height / outs.length
        el.outputs = outs.map((output,l) => {
          output.start = {
            x: el.box.right,
            y: el.box.top + (el.outputSegmentSize * (l+1)) - (el.outputSegmentSize / 2)
          }
          return output
        })
      }
    }
  })
})

links.forEach((link,i,a) => {
  if(typeof link.start !== 'object') {
    // assign starting point
    const startEl = findEl(link.from)
    link.start = {
      x: startEl.position.x,
      y: startEl.position.y
    }
  } else if(typeof link.end !== 'object') {
    // assign ending point
    const endEl = findEl(link.to)
    link.end = {
      x: endEl.position.x,
      y: endEl.position.y
    }
  }
})

const DiagramLayout = {
  columns,
  paths,
  elements,
  margins,
  sizes,
  links
}

// console.log(DiagramLayout)

export default DiagramLayout