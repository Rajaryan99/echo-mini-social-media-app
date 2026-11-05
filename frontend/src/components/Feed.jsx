import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'

const BACKEND_URL = 'https://echo-mini-social-media-app.onrender.com'
const getMediaUrl = (value) => {
  if (!value) return ''
  return value.startsWith('http') ? value : `${BACKEND_URL}${value}`
}

export default function Feed() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({ content: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [likeState, setLikeState] = useState({})
  const [likeCounts, setLikeCounts] = useState({})
  const [followState, setFollowState] = useState({})

  const currentUser = JSON.parse(localStorage.getItem('echoUser') || '{}')
  const currentUserId = currentUser?._id
  const isLoggedIn = Boolean(localStorage.getItem('echoToken'))

  const syncPostInteractionState = (items) => {
    const nextLikeState = {}
    const nextLikeCounts = {}
    const nextFollowState = {}

    for (const post of items) {
      const liked = post.likes?.some((user) => user?._id === currentUserId || user === currentUserId)
      nextLikeState[post._id] = Boolean(liked)
      nextLikeCounts[post._id] = post.likes?.length || 0

      if (post.userId?._id && post.userId._id !== currentUserId) {
        nextFollowState[post.userId._id] = post.userId.followers?.some((user) => user?._id === currentUserId || user === currentUserId) || false
      }
    }

    setLikeState(nextLikeState)
    setLikeCounts(nextLikeCounts)
    setFollowState(nextFollowState)
  }

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/posts')
      setPosts(data)
      syncPostInteractionState(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreatePost = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('echoToken')
    if (!token) {
      navigate('/signup')
      return
    }

    if (!newPost.content.trim() && !selectedImage) {
      return
    }

    try {
      setPosting(true)

      const formData = new FormData()
      formData.append('content', newPost.content)

      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const { data } = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setPosts((prev) => [data, ...prev])
      setNewPost({ content: '' })
      setSelectedImage(null)
    } catch (error) {
      console.error('Failed to create post:', error)
      alert(error.response?.data?.message || 'Unable to create post.')
    } finally {
      setPosting(false)
    }
  }

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('echoToken')
    if (!token) return

    const confirmed = window.confirm('Delete this post?')
    if (!confirmed) return

    try {
      setDeletingId(postId)
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPosts((prev) => prev.filter((post) => post._id !== postId))
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert(error.response?.data?.message || 'Unable to delete post.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleLike = async (postId) => {
    const token = localStorage.getItem('echoToken')
    if (!token) {
      navigate('/signup')
      return
    }

    try {
      const { data } = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setLikeState((prev) => ({ ...prev, [postId]: data.liked }))
      setLikeCounts((prev) => ({ ...prev, [postId]: data.likesCount }))
    } catch (error) {
      console.error('Failed to toggle like:', error)
      alert(error.response?.data?.message || 'Unable to update like.')
    }
  }

  const handleToggleFollow = async (userId) => {
    const token = localStorage.getItem('echoToken')
    if (!token) {
      navigate('/signup')
      return
    }

    try {
      const { data } = await axios.post(
        `/api/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setFollowState((prev) => ({ ...prev, [userId]: data.isFollowing }))
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      alert(error.response?.data?.message || 'Unable to update follow.')
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1100px] rounded-[18px] border border-indigo-500/80 bg-[#f2f2f2] shadow-[0_0_0_2px_rgba(67,56,202,0.5)]">
      <Navbar />

      <main className="mx-auto max-w-[700px] px-4 py-8">
        <form id="feed-post-form" onSubmit={handleCreatePost} className="mb-8 rounded-[10px] border border-slate-200 bg-[#f6f6f5] p-3">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Choose local image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/signup')
                  return
                }

                const form = document.querySelector('#feed-post-form')
                if (form) form.requestSubmit()
              }}
              disabled={posting}
              className="rounded-md bg-[#1d73d6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1867c2] disabled:opacity-60"
            >
              {posting ? 'Posting...' : isLoggedIn ? 'Post' : 'Sign up to Post'}
            </button>
          </div>

          {selectedImage && (
            <div className="mt-3 text-xs text-slate-500">
              Selected file: {selectedImage.name}
            </div>
          )}
        </form>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No posts yet.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-xl border border-slate-200 bg-[#f6f6f5] p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                      {post.userId?.profilePicture ? (
                        <img
                          src={getMediaUrl(post.userId.profilePicture)}
                          alt={post.userId?.username || 'User'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{(post.userId?.username || 'U').slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {post.userId?.username || 'User'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.userId?._id && post.userId._id !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(post.userId._id)}
                        className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-medium text-indigo-700 transition hover:bg-indigo-100"
                      >
                        {followState[post.userId._id] ? 'Following' : 'Follow'}
                      </button>
                    )}

                    {(post.userId?._id === currentUser._id || post.userId === currentUser._id) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post._id)}
                        disabled={deletingId === post._id}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingId === post._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>

                <p className="mb-4 text-[15px] leading-6 text-slate-700">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={getMediaUrl(post.imageUrl)}
                    alt="Post visual"
                    className="h-[260px] w-full rounded-lg object-cover"
                  />
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post._id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      likeState[post._id]
                        ? 'bg-red-100 text-red-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {likeState[post._id] ? 'Unlike' : 'Like'} · {likeCounts[post._id] || 0}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
