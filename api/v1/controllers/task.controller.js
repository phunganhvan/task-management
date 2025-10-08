const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find= {
        deleted: false,
    }
    if(req.query.status){
        const status= req.query.status;
        find.status=status;
    }
    //Sort
    const sort={};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]= req.query.sortValue;
    }
    //end sort

    const tasks = await Task.find(find).sort(sort);
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