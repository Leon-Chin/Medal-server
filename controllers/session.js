import { createError } from "../error.js"
import Session from '../models/Sessions.js'
import User from '../models/Users.js'

export const createSession = async (req, res, next) => {
    try {
        const userID = req.user.id
        const newSession = new Session({ ...req.body, user: userID })
        const session = await newSession.save();
        const user = await User.findByIdAndUpdate(userID, { $push: { sessions: session._id } });
        const updatedSessions = await Session.find({ user: userID }).populate('tutorial')
        if (!user) {
            return next(createError(404, "not found"))
        } else {
            res.status(200).json({ user, updatedSessions })
        }
    } catch (err) {
        next(err)
    }
}
export const finishSessionOutside = async (req, res, next) => {
    try {
        const userID = req.user.id
        const { tutorial, data, date } = req.body
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        let session;
        const newSession = new Session(
            {
                user: userID,
                date: new Date(date),
                completed: true,
                otherTypeTutorial: tutorial,
                ...data
            }
        )
        session = await newSession.save();
        const user = await User.findByIdAndUpdate(userID, { $push: { sessions: session._id } });
        const updatedSessions = await Session.find({ user: userID })
        res.status(200).json({ user, updatedSessions })
    } catch (err) {
        next(err)
    }
}
export const finishSession = async (req, res, next) => {
    try {
        const userID = req.user.id
        const tutorialID = req.params.id
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        // 查询数据库
        const sessionsToday = await Session.find({
            user: userID,
            date: { $gte: startOfToday, $lte: endOfToday },
            tutorial: tutorialID
        }).exec();
        let session;
        console.log("sessionsToday", sessionsToday);
        if (sessionsToday.length > 1) {
            const specificSession = sessionsToday.find(session => session.completed === false);
            console.log("specificSession", specificSession);
            if (!specificSession) {
                const newSession = new Session(
                    {
                        user: userID,
                        date: new Date(),
                        completed: true,
                        tutorial: tutorialID,
                        ...req.body
                    }
                )
                session = await newSession.save();
            } else {
                session = await Session.findByIdAndUpdate(specificSession._id, { $set: { completed: true } })
            }
        } else {
            const newSession = new Session(
                {
                    user: userID,
                    date: new Date(),
                    completed: true,
                    tutorial: tutorialID,
                    ...req.body
                }
            )
            session = await newSession.save();
        }
        const user = await User.findByIdAndUpdate(userID, { $push: { sessions: session._id } });
        const updatedSessions = await Session.find({ user: userID }).populate('tutorial')
        res.status(200).json({ user, updatedSessions })
    } catch (err) {
        next(err)
    }
}

export const deleteSession = async (req, res, next) => {
    try {
        const userID = req.user.id
        const sessionID = req.params.id
        const session = await Session.findByIdAndDelete(sessionID)
        const user = await User.findByIdAndUpdate(userID, { $pull: { sessions: session._id } });
        const updatedSessions = await Session.find({ user: userID }).populate('tutorial')
        if (!user) {
            return next(createError(404, "not found"))
        } else {
            res.status(200).json({ user, updatedSessions })
        }
    } catch (err) {
        next(err)
    }
}

export const getSessions = async (req, res, next) => {
    try {
        const userID = req.user.id
        const userSessions = await Session.find({ user: userID }).populate('tutorial').lean()
        // const user = await User.findById(userID);
        // if (!user) {
        //     return next(createError(404, "not found"))
        // } else {
        //     res.status(200).json(user)
        // }
        res.status(200).json(userSessions)
    } catch (err) {
        next(err)
    }
}






