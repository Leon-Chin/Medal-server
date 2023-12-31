import express from 'express'
import { createTutorial, updateTutorial, removeTutorial, getTutorial, getAllTutorials, getRecommendTutorials, addTutorialToFavor, getSpecificTypeTutorials } from '../controllers/tutorial.js'
import { verifyToken } from '../verifyToken.js'
const router = express.Router()

router.post('/', createTutorial)

router.put('/:id', updateTutorial)

router.put('/addtofavor/:id', verifyToken, addTutorialToFavor)

router.delete('/:id', removeTutorial)

router.get('/type', getSpecificTypeTutorials)

// get
router.get('/find/:id', getTutorial)

router.get('/getrecommend', verifyToken, getRecommendTutorials)

router.get('/', getAllTutorials)



export default router