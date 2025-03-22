function FixtureFinished({fixture}) {
  let classes = []
  if (!isFocus) classes.push('match-area')
  const gridStyle = { 
    backgroundColor: scoreUpToDate ? "#bcc6bc" : "",
    display: 'grid',
  }
  if (isFocus) {
    gridStyle.gridTemplateRows = 'auto auto'
  } else {
    gridStyle.gridTemplateColumns = 'auto auto'
  }
}
