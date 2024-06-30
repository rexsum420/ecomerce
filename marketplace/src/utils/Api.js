export default function Api(url, method = 'GET', body = null, authenticate = true) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    let options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authenticate) {
      options.headers['Authorization'] = `Token ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}
