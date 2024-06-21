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
    listRegionClubs: async (req, res) => {
      const { region } = req.params;
      const regionParts = region.split('%');
      let mainregion = regionParts[0], subregion;
      II(`Calling API: /api/regions/${region}/clubs ...`);
      if (regionParts.length > 1) {
        subregion = regionParts[1];
      }
      const q = `
        SELECT * from clubs
        WHERE region = '${mainregion}'
        ${ subregion ? (" and subregion='" + subregion + "'") : ''}
      `;
      let data = await select(q);
      res.json({data: data.data})
    }
    ,
  };
};
