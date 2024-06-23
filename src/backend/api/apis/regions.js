const e = require("express");
const { II, DD, EE } = require("../../lib/logging");

const REG_DELIM = '%';

module.exports = (db, select) => {
  return {
    listRegions: async (_, res) => {
      II(`Calling API: /api/regions ...`);
      const q = `
        SELECT DISTINCT
          CASE
            WHEN subregion IS NOT NULL AND subregion <> '' 
            THEN CONCAT(region, '${REG_DELIM}', subregion) 
            ELSE region 
          END AS formatted_region
        FROM clubs;
      `;
      let data = await select(q);
      res.json({ data: data.data.map(x => x.formatted_region) });
    }
    ,
    listRegionInfo: async (req, res) => {
      II(`Calling API: /api/regions/${req.params.region}/clubs ...`);
      const { region, subregion } = splitRegion(req.params.region);
      const { sex, sport, level } = req.query
      let sexConstraint = '';
      let sportConstraint = '';
      let levelConstraint = '';
      if (sex) {
        switch (sex) {
          case 'male': 
            sexConstraint = ` and category in ('gaa', 'hurling')`
          break
          case 'female':
            sexConstraint = ` and category in ('lgfa', 'camogie')`
          break
          default: break
        }
      }
      if (sport) {
        switch (sport) {
          case 'hurling': 
            sportConstraint = ` and category in ('hurling', 'camogie', 'youthhurling')`
          break
          case 'football':
            sportConstraint = ` and category in ('gaa', 'lgfa', 'youthfootball')`
          break
          case 'handball':
            sportConstraint = ` and category in ('handball') `
          break
          case 'rounders':
            sportConstraint = ` and category in ('rounders') `
          break
          default: break
        }
      }
      if (level) {
        switch (level) {
          case 'youth': 
            levelConstraint = ` and category in ('youthhurling', 'youthfootball')`
          break
          case 'adult':
            levelConstraint = ` and category in ('gaa', 'lgfa', 'hurling', 'camogie', 'handball', 'rounders') `
          break
          default: break
        }
      }
      const q = `
        SELECT * from v_club_teams
        WHERE region = '${region}'
        ${ subregion ? (" and subregion='" + subregion + "'") : ''}
        ${sexConstraint}
        ${sportConstraint}
        ${levelConstraint}
      `;
      let data = await select(q);
      res.json({
        header: {
          count: data.data.length,
          region,
          subregion,
        },
        data: data.data
      })
    }
    ,
  };
};

function splitRegion(rIn) {
  const regionParts = rIn.split('%');
  let region = regionParts[0]
  let subregion = null;
  if (regionParts.length > 1) {
    subregion = regionParts[1];
  }
  return {
    region, 
    subregion,
  }
}
