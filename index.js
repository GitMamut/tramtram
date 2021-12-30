const log = require('./log.js');
const srv = require('./srv.js')
const icon = require('./icon.js')
const config = require('./config')
const fetch = require('node-fetch');

log.startup();

const server = srv.configure();

server.get(config.PREFIX + '/next', (req, res) => {
  log.req(req);
  if (req.query.key != config.MY_API_KEY) {
    return res.status(401).send();
  }
  const url = 'http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?' + 
    'stop=365' + 
    '&mode=departure' + 
    '&language=pl' + 
    // '&routeId=8059228650286874667' + 
    '&direction=%C5%81agiewniki' + 
    '&timeFrame=40';
  return fetch(url, { method: 'GET', headers: {} })
  .then(response => {
    log.info(`ttss.krakow.pl response status: ${response.status}`);
    if (response.status != 200) {
      throw new Error(`ttss.krakow.pl response ERROR!`);
    }
    return response.json()
  })
  .then(json => {
    const frames = json.actual.map(trip => ({
        text: trip.mixedTime.replace('%UNIT_MIN%', 'min'),
        icon: icon.get(trip.patternText)
    }));
    return {
      frames
    };
  })
  .then(response => {
    log.info(`ttss.krakow.pl response json: ${JSON.stringify(response)}`);
    res
      .set('Content-Type', 'application/json;charset=UTF-8')
      .status(200)
      .send(response);
  })
  .catch(e => log.error(e));
});

srv.start(server, config.PORT);