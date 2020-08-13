import WireDiagram from '../components/wire-diagram'
import DataTable from '../components/data-table'
import DiagramInput from '../components/diagram-input'
import React, { useState } from 'react';
import * as d3Array from 'd3-array';

import DiagramLayout from '../components/diagram-data'

function Index() {

  const [diagramData, setDiagramData] = useState(DiagramLayout)

  return (
    <div>
      <DataTable data={diagramData} />
      <WireDiagram data={diagramData} />
    </div>
  )
}

export default Index;
