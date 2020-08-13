import React, { useState, useEffect, useRef } from 'react'

function DiagramInput() {

  return (
    <div>
      <Textarea></Textarea>
      <style jsx>{`
        textarea {
          border: 1px solid grey;
        }
      `}</style>
    </div>
  )
}

export default DiagramInput;