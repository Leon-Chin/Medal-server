import { createError } from "../error.js"
import User from '../models/Users.js'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import Report from '../models/Report.js'
import Tutorial from "../models/Tutorial.js"
import mongoose from "mongoose"
// update user
export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updateUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "Can only update your account"))
    }
}
export const updateWeightTarget = async (req, res, next) => {
    try {
        const userID = req.user.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: { weightTarget: req.body.weightTarget }
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}

export const updateStepTarget = async (req, res, next) => {
    try {
        const userID = req.user.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: { stepTarget: req.body.stepTarget }
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}
export const updateDistanceTarget = async (req, res, next) => {
    try {
        const userID = req.user.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: { distanceTarget: req.body.distanceTarget }
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}
export const updateCalorieTarget = async (req, res, next) => {
    try {
        const userID = req.user.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: { calorieTarget: req.body.calorieTarget }
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}
export const updateDurationTarget = async (req, res, next) => {
    try {
        const userID = req.user.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: { durationTarget: req.body.durationTarget }
        }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        next(err)
    }
}

export const participateTutorial = async (req, res, next) => {
    try {
        const userID = req.user.id
        const tutorialID = req.params.id
        const updateUser = await User.findByIdAndUpdate(userID, {
            $addToSet: { practicedTutorials: tutorialID }
        }, { new: true })
        const updatedTutorial = await Tutorial.findByIdAndUpdate(tutorialID, {
            $addToSet: { users: userID }
        })
        res.status(200).json({ user: updateUser, updatedTutorial })
    } catch (err) {
        next(err)
    }
}

// delete user
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "Can only delete your account"))
    }
}

// get a user
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('blogs').populate('records').populate('measurements').populate('sessions')
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}
// add the contact
export const addContact = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const method = req.body.method
        let contact
        switch (method) {
            case 'email':
                contact = await User.findOne({ email: { $eq: req.body.value } })
                break;
            case 'userId':
                contact = await User.findById(req.body.value)
                break;
            case 'name':
                contact = await User.findOne({ name: { $eq: req.body.value } })
                break;
            default:
                break;
        }
        if (contact) {
            const contacts = user.contactsUsers
            const alreadyExists = contacts.includes(contact)
            if (alreadyExists || contact.name === user.name) {
                next(createError(403, "Cannot add existed user or yourself"))
            } else {
                await User.findByIdAndUpdate(req.user.id, {
                    $addToSet: { contactsUsers: contact._id }
                })
                const newUser = await User.findById(req.user.id)
                res.status(200).json(newUser)
            }
        } else {
            next(createError(403, "This user does not exist"))
        }
    } catch (err) {
        next(err)
    }
}
export const addContactByID = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const contactID = req.params.contactID
        const contact = await User.findById(contactID)
        if (contact) {
            const contacts = user.contactsUsers
            const alreadyExists = contacts.includes(contact)
            if (alreadyExists || contact.name === user.name) {
                next(createError(403, "Cannot add existed user or yourself"))
            } else {
                const updatedUser = await User.findByIdAndUpdate(req.user.id, {
                    $addToSet: { contactsUsers: contact._id }
                }, { new: true })
                res.status(200).json(updatedUser)
            }
        } else {
            next(createError(403, "This user does not exist"))
        }
    } catch (err) {
        next(err)
    }
}
// remove the contact
export const removeContact = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $pull: { contactsUsers: req.params.id }
        }, { new: true })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}
// like the blog
export const likeBlog = async (req, res, next) => {
    const UserID = req.user.id
    const BlogID = req.params.blogID
    try {
        const user = await User.findByIdAndUpdate(UserID, { $addToSet: { likeBlogs: BlogID } }, { new: true })
        const blog = await Blog.findByIdAndUpdate(BlogID, { $addToSet: { likesUsers: UserID }, $pull: { dislikeUsers: UserID } })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

//cancerlikeBlog
export const cancerlikeBlog = async (req, res, next) => {
    const UserID = req.user.id
    const BlogID = req.params.blogID
    try {
        const user = await User.findByIdAndUpdate(UserID, { $pull: { likeBlogs: BlogID } }, { new: true })
        await Blog.findByIdAndUpdate(BlogID, { $pull: { likesUsers: UserID } })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const favoriteBlog = async (req, res, next) => {
    const UserID = req.user.id
    const BlogID = req.params.blogID
    try {
        const user = await User.findByIdAndUpdate(UserID, { $addToSet: { favoriteBlogs: BlogID } }, { new: true })
        await Blog.findByIdAndUpdate(BlogID, { $addToSet: { favoriteUsers: UserID }, $pull: { dislikeUsers: UserID } })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const cancerfavoriteBlog = async (req, res, next) => {
    const UserID = req.user.id
    const BlogID = req.params.blogID
    try {
        const user = await User.findByIdAndUpdate(UserID, { $pull: { favoriteBlogs: BlogID } }, { new: true })
        await Blog.findByIdAndUpdate(BlogID, { $pull: { favoriteUsers: UserID } })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

// dislike the blog
export const dislikeBlog = async (req, res, next) => {
    const UserID = req.user.id
    const BlogID = req.params.blogID
    try {
        const user = await User.findByIdAndUpdate(UserID, { $pull: { likeBlogs: BlogID } })
        await Blog.findByIdAndUpdate(BlogID, { $addToSet: { dislikeUsers: UserID }, $pull: { likesUsers: UserID } }, { new: true })
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const likeComment = async (req, res, next) => {
    const UserID = req.user.id
    const CommentID = req.params.commentID
    try {
        const comment = await Comment.findByIdAndUpdate(CommentID, { $addToSet: { likedUsers: UserID } }, { new: true })
        res.status(200).json(comment)
    } catch (err) {
        next(err)
    }
}

//cancerlikeComment
export const cancerlikeComment = async (req, res, next) => {
    const UserID = req.user.id
    const CommentID = req.params.commentID
    try {
        const comment = await Comment.findByIdAndUpdate(CommentID, { $pull: { likedUsers: UserID } }, { new: true })
        res.status(200).json(comment)
    } catch (err) {
        next(err)
    }
}


export const createReport = async (req, res, next) => {
    try {
        const userID = req.user.id
        const newReport = new Report({ userID, ...req.body })
        const savedReport = await newReport.save()
        res.status(200).json(savedReport)
    } catch (err) {
        next(err)
    }
}

export const updatePrefer = async (req, res, next) => {
    try {
        const userID = req.user.id
        const { evaluationAnswer } = req.body
        const updatedUser = await User.findByIdAndUpdate(userID, { personalPrefer: evaluationAnswer })

        const queryConditions = [];

        // 当evaluationAnswer.goal存在时，添加type条件
        if (evaluationAnswer?.goal) {
            queryConditions.push({ type: { $eq: evaluationAnswer.goal } });
        }

        // 当evaluationAnswer.level存在时，添加level条件
        if (evaluationAnswer?.level) {
            queryConditions.push({ level: evaluationAnswer.level });
        }

        // 当evaluationAnswer.duration存在且其lowRangeValue和higherRangeValue存在时，添加duration条件
        if (evaluationAnswer?.duration && Object.keys(evaluationAnswer?.duration).length !== 0 && typeof evaluationAnswer.duration.lowRangeValue !== 'undefined' && typeof evaluationAnswer.duration.higherRangeValue !== 'undefined') {
            queryConditions.push({ duration: { $gte: evaluationAnswer.duration.lowRangeValue, $lte: evaluationAnswer.duration.higherRangeValue } });
        }

        // 当evaluationAnswer.calorie存在且其lowRangeValue和higherRangeValue存在时，添加calorie条件
        if (evaluationAnswer?.calorie && Object.keys(evaluationAnswer?.calorie).length !== 0 && typeof evaluationAnswer.calorie.lowRangeValue !== 'undefined' && typeof evaluationAnswer.calorie.higherRangeValue !== 'undefined') {
            const calorieRangeCondition = {
                $or: [
                    { lowerEstimateColorie: { $gte: evaluationAnswer.calorie.lowRangeValue, $lte: evaluationAnswer.calorie.higherRangeValue } },
                    { higherEstimateColorie: { $gte: evaluationAnswer.calorie.lowRangeValue, $lte: evaluationAnswer.calorie.higherRangeValue } },
                ]
            };
            queryConditions.push(calorieRangeCondition);
        }

        // 使用$and操作符，只有当queryConditions非空时才添加到查询中
        const query = queryConditions.length > 0 ? { $and: queryConditions } : {};
        const fitTututorials = await Tutorial.find(query)
        res.status(200).json(updatedUser)
    } catch (err) {
        console.log("err", err);
        next(err)
    }
}

export const fuzzySearchUser = async (req, res, next) => {
    try {
        const userID = req.user.id
        let searchText = req.query.searchText
        const searchRegex = new RegExp(searchText, "i")
        let queryConditions = [
            { name: { $regex: searchRegex } },
            { email: { $regex: searchRegex } },
        ];

        // Check if searchText is a valid ObjectId
        if (searchText.match(/^[0-9a-fA-F]{24}$/)) {
            queryConditions.push({ _id: new mongoose.Types.ObjectId(searchText) });
        }
        const updatedUser = await User.find({
            $and: [
                { $or: queryConditions, },
                { _id: { $ne: userID } }
            ]

        })
        res.status(200).json(updatedUser)
    } catch (err) {
        next(err)
    }
}

