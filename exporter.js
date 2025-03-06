const axios = require('axios');
const fs = require('fs');

//CHANGE BELOW
const baseUrl = 'https://YOURDOMAIN/rest/2.0/assets';
const username = 'YOURUSERNAME';
const password = 'YOURPASSWORD';

async function fetchAllAssets(typeId, username, password) {

  const limit = 1000;
  let offset = 0;
  let totalAssets = [];
  let total = 0;

  do {
    const response = await axios.get(baseUrl, {
      params: {
        offset,
        limit,
        countLimit: -1,
        nameMatchMode: 'ANYWHERE',
        typeIds: typeId
      },
      auth: {
        username: username,
        password: password
      }
    });

    const data = response.data;
    total = data.total;
    totalAssets = totalAssets.concat(data.results);
    offset += limit;

    console.log(`Fetched ${totalAssets.length}/${total} assets...`);
  } while (totalAssets.length < total);

  return totalAssets;
}

async function saveAssetsToFile(filename, assets) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(assets, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Type ID below is for Data Sets - you can replace it with something else if you want!
const typeId = '00000000-0000-0000-0001-000400000001';


fetchAllAssets(typeId, username, password)
  .then(assets => {
    return saveAssetsToFile('allAssets.json', assets);
  })
  .then(() => {
    console.log('Assets successfully saved to allAssets.json');
  })
  .catch(err => console.error('Error:', err));
