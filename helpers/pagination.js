module.exports = (objectPagination, query, countRecords) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if(query.limit){
        objectPagination.limitItems= parseInt(query.limit)
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems
    objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems);
    console.log(objectPagination.totalPage);
    if(objectPagination.currentPage > objectPagination.totalPage){
        objectPagination.currentPage= 1;
        // url.searchParams.set("page", 1);
    }
    return objectPagination;
}