export function getDivisions(n) {
  // Calculate the value for the segments after the first 4%
  const segmentValue = 96 / n;
  // Initialize the string with the first value
  let result = "4%";
  // Append the calculated segment values to the result string
  for (let i = 0; i < n; i++) {
    result += ` ${segmentValue}%`;
  }
  return result;
}
