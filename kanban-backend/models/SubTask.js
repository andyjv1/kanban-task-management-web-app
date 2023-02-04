const mongoose = require('mongoose')

const subtasksSchema = new mongoose.Schema({

        title: {
            type: String,
            required: true
        },
        isCompleted:
        {
            type: Boolean,
            default: false
    },
    //         task:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Task'
    // }],
})

module.exports = mongoose.model('Subtasks', subtasksSchema)