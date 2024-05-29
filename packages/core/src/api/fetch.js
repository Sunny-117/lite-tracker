import { lazyReportCache} from '../report';

const originalFetch = window.fetch;

function overWriteFetch() { 
  window.fetch = function newFetch(url, config) { 
    const startTime = Date.now();

    const reportData = {
      startTime,
      url,
      method: config?.method || 'GET',
      subType: 'fetch',
    }

    return originalFetch(url, config)
      .then(res => { 
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        reportData.status = res.status;
        reportData.success = res.ok;

        lazyReportCache('api', reportData);

        return res;
      })
      .catch(err => { 
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        reportData.status = 0;
        reportData.success = false;

        lazyReportCache('api', reportData);

        return err;
      })
  }
}

export default function fetch() { 
  overWriteFetch();
}