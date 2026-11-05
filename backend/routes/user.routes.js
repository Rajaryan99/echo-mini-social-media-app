import User from '../models/user.model.js'
import express from 'express'
const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

const getUser = async (req, res, next) => {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

// Get a single user by username
router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get a single user by ID
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// Create a new user
router.post('/regitser', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    bio: req.body.bio,
    profilePicture: req.body.profilePicture,
  })

  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const bcrypt = await import('bcrypt')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})  



// Update a user
router.patch('/update/:id', getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.password != null) {
    res.user.password = req.body.password
  }
  if (req.body.bio != null) {
    res.user.bio = req.body.bio
  }
  if (req.body.profilePicture != null) {
    res.user.profilePicture = req.body.profilePicture
  }

  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  } 
})

router.delete('/delete/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



export default router   