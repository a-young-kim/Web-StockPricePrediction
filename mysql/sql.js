module.exports = {
    saveArticle: `insert into article set ?`,
    saveClass: `update article set class = ? where date = ? and company = ?`,
    getTopThree: `select date, company, class from article order by date desc limit 3`,
    getAllTable: `select date, company, class from article order by date desc limit 30`,
    getCompanyTable: `select date, company, class from article where company = ? order by date desc limit 30`,
};