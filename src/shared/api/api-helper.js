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
      // Add cache-busting headers
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  // Add cache busting parameter for GET requests
  const urlWithCacheBusting = method === 'GET'
    ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}_t=${Date.now()}`
    : endpoint;

  console.log(`Fetching ${method} ${urlWithCacheBusting}`);

  return new Promise((accept, reject) => {
    fetch(urlWithCacheBusting, options)
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
        console.log(`Response from ${method} ${urlWithCacheBusting}:`, data);
        accept(data); // Resolve the promise with the data
      })
      .catch(error => {
        console.error(`Error fetching ${urlWithCacheBusting}:`, error);
        reject(error); // Reject the promise on error
      });
  });
}

// New generic fetch helper for root API endpoints (e.g., /api/tournaments)
export function fetchRootApi(path, method = 'GET', body = null, queryParams = null) {
  let endpoint = `/api${path.startsWith('/') ? path : '/' + path}`; // Ensure path starts with /

  // Append query parameters if they exist
  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Add cache-busting headers
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  // Add cache busting parameter for GET requests
  const urlWithCacheBusting = method === 'GET'
    ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}_t=${Date.now()}`
    : endpoint;

  console.log(`Fetching ${method} ${urlWithCacheBusting}`);

  return new Promise((accept, reject) => {
    fetch(urlWithCacheBusting, options)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
          });
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text(); // Or resolve with null/undefined for non-JSON
        }
      })
      .then(data => {
        accept(data);
      })
      .catch(error => {
        console.error(`Error fetching ${urlWithCacheBusting}:`, error);
        reject(error);
      });
  });
}
