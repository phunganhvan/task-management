const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    }
    // lọc theo trang thái
    if (req.query.status) {
        const status = req.query.status;
        find.status = status;
    }
    //Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //end sort


    // phân trang
    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 3,
    };

    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );
    // End Pagination
    // tìm kiếm
    // let keyword;
    const objSearch = searchHelper(req.query); // object search trả về
    // console.log(objSearch);
    if (req.query.keyword) {
        find.title = objSearch.regex;
        // keyword = objSearch.keyword
    }
    //end tìm kiếm

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            deleted: false,
            _id: id
        });
        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy");
    }
}

//  [PATCH] api/v1/tasks/change-status/:id

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status= req.body.status;
        await Task.updateOne(
            {
                _id: id,
            },
            {
                status: status
            }
        )
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
         res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
    
}