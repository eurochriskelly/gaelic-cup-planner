export function makeRequest(obj) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  };
}

export function makeEndpoint(tournamentId, rest) {
  if (!tournamentId) throw new Error("No :tournamentId!");
  // Construct the base API path
  const basePath = `/api/tournaments/${tournamentId}/fixtures`;
  // Ensure 'rest' starts with a '/' if it's not empty, or handle empty 'rest'
  const endpointPath = rest ? (rest.startsWith('/') ? rest : `/${rest}`) : '';
  const endpoint = `${basePath}${endpointPath}`;
  // console.log(`API request to endpoint ${endpoint}`); // Removed default logging
  return endpoint;
}

// New generic fetch helper
export function fetchApi(tournamentId, path, method = 'GET', body = null) {
  const endpoint = makeEndpoint(tournamentId, path);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  return new Promise((accept, reject) => {
    fetch(endpoint, options)
      .then(response => {
        if (!response.ok) {
          // Throw an error for bad responses (4xx, 5xx)
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
          });
        }
        // Handle cases where the response might be empty
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text(); // Or handle as needed, maybe resolve with null/undefined
        }
      })
      .then(data => {
        accept(data); // Resolve the promise with the data
      })
      .catch(error => {
        console.error(`Error fetching ${endpoint}:`, error);
        reject(error); // Reject the promise on error
      });
  });
}
