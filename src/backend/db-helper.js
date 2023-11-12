module.exports = db => {
    return {
        select: (query) => new Promise((accept, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    reject({ error: err.message })
                }
                accept({ data: results })
            })
        })
    }
}