function PoliticalCompass(props) {
    const diagramWidth = 1000;
    const handleClick = props.handleClick;
    return (<div class="compass">
      
      <svg width={diagramWidth} height={diagramWidth} xmlns="http://www.w3.org/2000/svg" onClick={handleClick} viewBox='0 0 1000 1000'>
        {/* <!-- Background quadrants --> */}
        <rect x={0} y={0} width={diagramWidth} height={diagramWidth}
          fill="white"/>
        <rect x={0} y={0} width={diagramWidth/2} height={diagramWidth/2}
         fill="#fcc"/>
        <rect x={0} y={diagramWidth/2} width={diagramWidth/2} height={diagramWidth/2}
          fill="#9f9" opacity="0.2"/>
        <rect x={diagramWidth/2} y={0} width={diagramWidth/2} height={diagramWidth/2}
          fill="#bbf" opacity="0.2"/>
        <rect x={diagramWidth/2} y={diagramWidth/2} width={diagramWidth/2} height={diagramWidth/2}
          fill="#ff7" opacity="0.2"/>
        {/* <!-- Draw the horizontal and vertical lines --> */}
        <line x1="0" y1={diagramWidth/2} x2={diagramWidth} y2={diagramWidth/2} stroke="black" />
        <line x1={diagramWidth/2} y1="0" x2={diagramWidth/2} y2={diagramWidth} stroke="black" />

        {/* <!-- Label the quadrants -->
        <!-- Authoritarian Left --> */}
        <text class="quadrant_label" x={diagramWidth/4} y={diagramWidth/4} font-size="12" fill="black">Authoritarian Left</text>
        {/* <!-- Authoritarian Right --> */}
        <text class="quadrant_label" x={diagramWidth*3/4} y={diagramWidth/4} font-size="12" fill="black">Authoritarian Right</text>
        {/* <!-- Libertarian Left --> */}
        <text class="quadrant_label" x={diagramWidth/4} y={diagramWidth*3/4} font-size="12" fill="black">Libertarian Left</text>
        {/* <!-- Libertarian Right --> */}
        <text class="quadrant_label" x={diagramWidth*3/4} y={diagramWidth*3/4} font-size="12" fill="black">Libertarian Right</text>

        {/* <!-- Label the axes -->
        <!-- Horizontal Axis --> */}
        <text class="compass_axis_label" y={diagramWidth/2} x={diagramWidth-50} font-size="10" fill="black">Right</text>
        <text class="compass_axis_label" y={diagramWidth/2} x="50" font-size="10" fill="black">Left</text>
        {/* <!-- Vertical Axis --> */}
        <text class="compass_axis_label"  y="30" x={diagramWidth/2} font-size="10" fill="black">Authoritarian</text>
        <text class="compass_axis_label"  y={diagramWidth-30} x={diagramWidth/2} font-size="10" fill="black">Libertarian</text>
        
      </svg>
      </div>);
}

export default PoliticalCompass;