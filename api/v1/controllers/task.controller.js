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
// chi tiết sản phẩm
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
        res.status(400).json("Không tìm thấy");
    }
}
//chỉnh sửa 1 công việc
//  [PATCH] api/v1/tasks/change-status/:id

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
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
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        });
    }

}

// [PATCH] /api/v1/tasks/change-multi 
// chỉnh sửa nhiều công việc
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;
        switch (key) {
            case "status":
                await Task.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        status: value,
                    }
                )
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })

                break;
            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                },
                    {
                        deleted: true
                    })
                res.json(
                    {
                        code: 200,
                        message: "Xóa thành công"
                    }
                )
                break;
            default:
                res.status(400).json({
                    code: 400,
                    message: "Không tồn tại"
                })
                break;
        }
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

// [POST]  /api/v1/tasks/create
// tạo mới công việc

module.exports.create = async (req, res) => {
    try {
        const userId= req.user.id;

        req.body.createdBy= userId;
        // validate nữa
        const record = new Task(req.body);
        const data = await record.save();
        res.json(
            {
                code: 200,
                message: "Tạo thành công",
                data: data
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                code: 400,
                message: "Lỗi!!!"
            }
        )
    }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne(
            {
                _id: id
            }, req.body
        )
        res.json(
            {
                code: 200,
                message: "Cập nhật thành công!"
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                code: 400,
                message: "Lỗi!!!"
            }
        )
    }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        )
        res.json({
            code: 200,
            message: "Xóa thành công"
        })
    } catch (error) {
        res.status(400).json(
            {
                code: 400,
                message: "Lỗi!!!"
            }
        )
    }
}