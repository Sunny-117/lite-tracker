import axios from 'axios';
export async function getErrors(page = 1) {
  const res = await axios.get('http://localhost:3001/api/get/errorLog', {
    params: {
      page
    }
  });
  return res.data
}

export async function getPerformances(page = 1) { 
  const res = await axios.get('http://localhost:3001/api/get/performanceLog', {
    params: {
      page
    }
  });
  return res.data
}

export async function getActions(page = 1) { 
  const res = await axios.get('http://localhost:3001/api/get/actionLog', {
    params: {
      page
    }
  });
  return res.data
}

export async function getBehaviors(page = 1) { 
  const res = await axios.get('http://localhost:3001/api/get/behaviorLog', {
    params: {
      page
    }
  });
  return res.data
}

export async function getApis(page = 1) { 
  const res = await axios.get('http://localhost:3001/api/get/apiLog', {
    params: {
      page
    }
  });
  return res.data
}