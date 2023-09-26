module.exports = {
    saveArticle: `insert into article set ?`,
    saveClass: `update article set class = ? where date = ? and company = ?`
};