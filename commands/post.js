const dbAdapter = require("../helpers/dbAdapter");
const formatMessage = require("../helpers/formatMessage");
const mysql = require("mysql");

function post(args) {
  let query, message;

  return dbAdapter
    .getConnection()
    .then(() => {
      if (!args[0]) {
        //query for random post
        query = `
                SELECT users.username, posts.post_text, posts.post_subject 
                FROM posts INNER JOIN users 
                ON poster_id = user_id
                ORDER BY RAND()
                LIMIT 1;
              `;
      } else if (args[0] === "main") {
        query = `
                SELECT users.username, posts.post_text, posts.post_subject 
                FROM posts INNER JOIN users 
                ON poster_id = user_id
                WHERE posts.post_subject LIKE "%Chat EEEEEEEEEEEE"
                ORDER BY RAND()
                LIMIT 1;
              `;
      } else {
        let autor = mysql.escape(`%${args[0]}%`);

        query = `
                SELECT users.username, posts.post_text, posts.post_subject 
                FROM posts INNER JOIN users 
                ON poster_id = user_id
                WHERE users.username LIKE ${autor}
                ORDER BY RAND()
                LIMIT 1;
              `;
      }

      return dbAdapter.getData(query);
    })
    .then((result) => {
      message = formatMessage(result[0]);

      return dbAdapter.endConnection();
    })
    .then(() => message)
    .catch((err) => {
      console.log(err);
      return "deu algum pau no sistema eu acho";
    });
}

module.exports = post;