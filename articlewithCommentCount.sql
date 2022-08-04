\c nc_news_test

SELECT articles.*, COUNT(comments.article_id)::INTEGER AS
       comment_count
        FROM comments
        RIGHT JOIN articles ON comments.article_id = articles.article_id
        JOIN users ON users.username = articles.author 
         GROUP BY articles.article_id
         ORDER BY articles.created_at DESC;
         