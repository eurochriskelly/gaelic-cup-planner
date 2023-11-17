module.exports = db => {
    return {
        select: (query) => new Promise((accept, reject) => {
            console.log(`Executing query: ${query}`)
            db.query(query, (err, results) => {
                if (err) {
                    reject({ error: err.message })
                }
                accept({ data: results })
            })
        })
    }
}