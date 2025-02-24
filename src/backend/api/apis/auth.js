// api/apis/auth.js
const { II } = require("../../lib/logging");

module.exports = (db, select) => {
  return {
    login: async (req, res) => {
      const { email, password } = req.body;
      II(`Calling API: /api/auth/login`);
      try {
        const authQuery = `SELECT * FROM sec_users WHERE Email = ? AND Pass = ? AND IsActive = 1`;
        const users = await select(authQuery.replace("?", `'${email}'`).replace("?", `'${password}'`)); // Note: Hash password in production
        if (!users.data.length) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = users.data[0];
        const updateQuery = `UPDATE sec_users SET LastAuthenticated = CURDATE() WHERE id = ?`;
        await select(updateQuery.replace("?", user.id));
        res.json({ id: user.id, email: user.Email });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
