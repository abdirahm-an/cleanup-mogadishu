'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'

interface FlagButtonProps {
  postId: string
  className?: string
}

const flagReasons = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'misleading', label: 'Misleading Information' },
  { value: 'other', label: 'Other' }
]

export function FlagButton({ postId, className }: FlagButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/posts/${postId}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedReason,
          comment: comment.trim() || undefined,
        }),
      })

      if (response.ok) {
        setHasSubmitted(true)
        setIsModalOpen(false)
        setSelectedReason('')
        setComment('')
        // Show success message or update UI
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit flag')
      }
    } catch (error) {
      alert('An error occurred while submitting the flag')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasSubmitted) {
    return (
      <span className={`text-sm text-gray-500 ${className}`}>
        Content flagged
      </span>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors ${className}`}
        aria-label="Flag content"
      >
        <Flag size={16} />
        <span>Flag</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Flag Content</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for flagging *
                </label>
                <div className="space-y-2">
                  {flagReasons.map((reason) => (
                    <label key={reason.value} className="flex items-center">
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mr-2"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional details (optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Please provide more context if needed..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason || isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}