import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || ''),
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load skins data
  let skinsData: any[] = [];
  let agentsData: any[] = [];
  let stickersData: any[] = [];
  try {
    const skinsPath = path.join(__dirname, "skins.json");
    if (fs.existsSync(skinsPath)) {
      skinsData = JSON.parse(fs.readFileSync(skinsPath, "utf-8"));
    }
    const agentsPath = path.join(__dirname, "agents.en.json");
    if (fs.existsSync(agentsPath)) {
      agentsData = JSON.parse(fs.readFileSync(agentsPath, "utf-8"));
    }
    const stickersPath = path.join(__dirname, "stickers.json");
    if (fs.existsSync(stickersPath)) {
      stickersData = JSON.parse(fs.readFileSync(stickersPath, "utf-8"));
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/agents", (req, res) => {
    res.json(agentsData);
  });

  app.get("/api/stickers", (req, res) => {
    res.json(stickersData);
  });

  app.get("/api/weapons", (req, res) => {
    // Extract unique weapons
    const weapons = new Set<string>();
    skinsData.forEach((skin) => {
      weapons.add(skin.weapon_name);
    });
    res.json(Array.from(weapons).sort());
  });

  app.get("/api/skins", (req, res) => {
    res.json(skinsData);
  });

  app.get("/api/skins/:weaponName", (req, res) => {
    const weaponName = req.params.weaponName;
    const weaponSkins = skinsData.filter(
      (skin) => skin.weapon_name === weaponName
    );
    res.json(weaponSkins);
  });

  // Loadout API
  app.get("/api/loadout/:steamId", async (req, res) => {
    try {
      const steamId = req.params.steamId;
      const equipped: Record<string, any> = {};

      // Get skins
      const [skinsRows] = await pool.query(
        'SELECT * FROM wp_player_skins WHERE steamid = ?',
        [steamId]
      );
      
      // Get knives
      const [knifeRows] = await pool.query(
        'SELECT * FROM wp_player_knife WHERE steamid = ?',
        [steamId]
      );

      // Get gloves
      const [gloveRows] = await pool.query(
        'SELECT * FROM wp_player_gloves WHERE steamid = ?',
        [steamId]
      );

      // Get agents
      const [agentRows] = await pool.query(
        'SELECT * FROM wp_player_agents WHERE steamid = ?',
        [steamId]
      );

      // Process skins
      for (const row of (skinsRows as any[])) {
        const skinDef = skinsData.find(s => s.weapon_defindex === row.weapon_defindex && Number(s.paint) === row.weapon_paint_id);
        if (skinDef) {
          const team = row.weapon_team === 2 ? 'T' : 'CT';
          equipped[`${skinDef.weapon_name}_${team}`] = {
            skin: skinDef,
            config: {
              wear: row.weapon_wear,
              seed: row.weapon_seed,
              stattrak: row.weapon_stattrak ? row.weapon_stattrak_count : -1,
              nametag: row.weapon_nametag || "",
              stickers: [],
              charms: []
            },
            team: team
          };
        }
      }

      // Process knives
      for (const row of (knifeRows as any[])) {
        // Find default knife skin (paint 0)
        const knifeDef = skinsData.find(s => s.weapon_name === row.knife && s.paint === 0);
        if (knifeDef) {
          const team = row.weapon_team === 2 ? 'T' : 'CT';
          if (!equipped[`${knifeDef.weapon_name}_${team}`]) {
            equipped[`${knifeDef.weapon_name}_${team}`] = {
              skin: knifeDef,
              config: { wear: 0.00001, seed: 0, stattrak: -1, nametag: "", stickers: [], charms: [] },
              team: team
            };
          }
        }
      }

      // Process gloves
      for (const row of (gloveRows as any[])) {
        const gloveDef = skinsData.find(s => s.weapon_defindex === row.weapon_defindex);
        if (gloveDef) {
          const team = row.weapon_team === 2 ? 'T' : 'CT';
          if (!equipped[`${gloveDef.weapon_name}_${team}`]) {
            equipped[`${gloveDef.weapon_name}_${team}`] = {
              skin: gloveDef,
              config: { wear: 0.00001, seed: 0, stattrak: -1, nametag: "", stickers: [], charms: [] },
              team: team
            };
          }
        }
      }

      // Process agents
      for (const row of (agentRows as any[])) {
        if (row.agent_ct) {
          const agentModel = row.agent_ct;
          const agentDef = agentsData.find(a => 
            (a.model !== "null" && agentModel.includes(a.model))
          );
          
          if (agentDef) {
            equipped[agentModel] = {
              skin: {
                weapon_defindex: 5036,
                weapon_name: agentModel,
                paint: "0",
                image: agentDef.image,
                paint_name: agentDef.agent_name,
                legacy_model: false
              },
              config: { wear: 0, seed: 0, stattrak: -1, nametag: "" },
              team: 'CT'
            };
          }
        }
        if (row.agent_t) {
          const agentModel = row.agent_t;
          const agentDef = agentsData.find(a => 
            (a.model !== "null" && agentModel.includes(a.model))
          );
          
          if (agentDef) {
            equipped[agentModel] = {
              skin: {
                weapon_defindex: 5036,
                weapon_name: agentModel,
                paint: "0",
                image: agentDef.image,
                paint_name: agentDef.agent_name,
                legacy_model: false
              },
              config: { wear: 0, seed: 0, stattrak: -1, nametag: "" },
              team: 'T'
            };
          }
        }
      }

      res.json(equipped);
    } catch (error) {
      console.error("Error fetching loadout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/loadout/:steamId", async (req, res) => {
    try {
      const steamId = req.params.steamId;
      const loadout = req.body;

      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Clear existing loadout for this user
        await connection.query('DELETE FROM wp_player_skins WHERE steamid = ?', [steamId]);
        await connection.query('DELETE FROM wp_player_knife WHERE steamid = ?', [steamId]);
        await connection.query('DELETE FROM wp_player_gloves WHERE steamid = ?', [steamId]);
        await connection.query('DELETE FROM wp_player_agents WHERE steamid = ?', [steamId]);

      // Insert new loadout
      for (const key of Object.keys(loadout)) {
        const item = loadout[key];
        const weaponName = key.replace(/_(T|CT)$/, '');
        const skin = item.skin;
        const config = item.config;
        const targetTeam = item.team; // Optional team from frontend
        
        const isKnife = weaponName.startsWith('weapon_knife') || weaponName === 'weapon_bayonet';
        const isGlove = weaponName.includes('gloves') || weaponName.includes('handwraps');
        const isAgent = weaponName.includes('agent') || weaponName.includes('customplayer') || weaponName.includes('tm_') || weaponName.includes('ctm_') || weaponName.includes('ct_sas') || weaponName.includes('tt_phoenix');
        const isMusic = weaponName.includes('music') || weaponName.includes('musickit');
        
        // Teams to insert for (2 = T, 3 = CT)
        const teams = targetTeam ? [targetTeam === 'T' ? 2 : 3] : [2, 3];
        
        for (const team of teams) {
          if (isKnife) {
              await connection.query(
                'REPLACE INTO wp_player_knife (steamid, weapon_team, knife) VALUES (?, ?, ?)',
                [steamId, team, weaponName]
              );
              // If it has a paint, also add to skins
              if (Number(skin.paint) !== 0) {
                await connection.query(
                  `REPLACE INTO wp_player_skins 
                  (steamid, weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed, weapon_nametag, weapon_stattrak, weapon_stattrak_count) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    steamId, team, skin.weapon_defindex, skin.paint, 
                    config.wear, config.seed, config.nametag || null, 
                    config.stattrak >= 0 ? 1 : 0, Math.max(0, config.stattrak)
                  ]
                );
              }
            } else if (isGlove) {
              await connection.query(
                'REPLACE INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) VALUES (?, ?, ?)',
                [steamId, team, skin.weapon_defindex]
              );
              // Gloves can also have paints in wp_player_skins
              if (Number(skin.paint) !== 0) {
                await connection.query(
                  `REPLACE INTO wp_player_skins 
                  (steamid, weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed, weapon_nametag, weapon_stattrak, weapon_stattrak_count) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    steamId, team, skin.weapon_defindex, skin.paint, 
                    config.wear, config.seed, config.nametag || null, 
                    config.stattrak >= 0 ? 1 : 0, Math.max(0, config.stattrak)
                  ]
                );
              }
            } else if (isAgent) {
              const column = team === 3 ? 'agent_ct' : 'agent_t';
              
              await connection.query(
                `INSERT INTO wp_player_agents (steamid, ${column}) VALUES (?, ?) ON DUPLICATE KEY UPDATE ${column} = ?`,
                [steamId, weaponName, weaponName]
              );
            } else {
              // Regular weapon skin
              await connection.query(
                `REPLACE INTO wp_player_skins 
                (steamid, weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed, weapon_nametag, weapon_stattrak, weapon_stattrak_count) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  steamId, team, skin.weapon_defindex, skin.paint, 
                  config.wear, config.seed, config.nametag || null, 
                  config.stattrak >= 0 ? 1 : 0, Math.max(0, config.stattrak)
                ]
              );
            }
          }
        }

        await connection.commit();
        res.json({ success: true });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error saving loadout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
