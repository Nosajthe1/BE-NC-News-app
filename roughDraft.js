exports.getAllArticles = async (
    sort_by = "created_at",
    order = "DESC",
    topic,
    queryArr
) => {
    const validSortBy = [
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
    ];
    const queryValues = [];
    const validQueries = ["sort_by", "order", "topic"];
    let invalidEntry = false;

    await queryArr.forEach((query) => {
        if (!validQueries.includes(query)) {
            invalidEntry = true;
        }
    });


    
}
