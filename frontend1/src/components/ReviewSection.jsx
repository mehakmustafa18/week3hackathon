import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ReviewSection.css';

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    console.log('🔍 ReviewSection: Fetching for productId:', productId);
    try {
      const res = await reviewAPI.getForProduct(productId);
      console.log('✅ ReviewSection: Received reviews:', res.data);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ ReviewSection: API Error:', {
        status: err.response?.status,
        url: err.config?.url,
        message: err.message
      });
      toast.error('Unable to connect to the review service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    if (!comment.trim()) return toast.error('Comment cannot be empty');

    try {
      await reviewAPI.create({
        productId,
        userId: user._id,
        userName: user.name,
        rating,
        comment
      });
      toast.success('Review submitted!');
      setComment('');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const handleReply = async (reviewId) => {
    if (!user) return toast.error('Please login to reply');
    const text = replyText[reviewId];
    if (!text?.trim()) return toast.error('Reply cannot be empty');

    try {
      await reviewAPI.addReply(reviewId, {
        userId: user._id,
        userName: user.name,
        comment: text
      });
      toast.success('Reply added!');
      setReplyText({ ...replyText, [reviewId]: '' });
      setShowReplyForm({ ...showReplyForm, [reviewId]: false });
      fetchReviews();
    } catch (err) {
      toast.error('Failed to add reply');
    }
  };

  const handleLike = async (reviewId) => {
    if (!user) return toast.error('Please login to like a review');
    try {
      await reviewAPI.toggleLike(reviewId, user._id);
      fetchReviews();
    } catch (err) {
      toast.error('Error liking review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="review-section">
      <h3>Customer Reviews</h3>

      {/* Review Form */}
      {user ? (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((num) => (
              <span 
                key={num} 
                className={`star ${rating >= num ? 'filled' : ''}`}
                onClick={() => setRating(num)}
              >★</span>
            ))}
          </div>
          <textarea 
            placeholder="Write your review..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="btn-primary">Submit Review</button>
        </form>
      ) : (
        <p className="login-prompt">Please login to write a review.</p>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="review-item">
              <div className="review-header">
                <strong>{rev.userName}</strong>
                <span className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
              </div>
              <p className="review-comment">{rev.comment}</p>
              
              <div className="review-actions">
                <button onClick={() => handleLike(rev._id)} className={rev.likes?.includes(user?._id) ? 'liked' : ''}>
                  ❤️ {rev.likes?.length || 0}
                </button>
                <button onClick={() => setShowReplyForm({ ...showReplyForm, [rev._id]: !showReplyForm[rev._id] })}>
                  Reply
                </button>
              </div>

              {/* Replies */}
              {rev.replies?.length > 0 && (
                <div className="replies-list">
                  {rev.replies.map((rep) => (
                    <div key={rep._id} className="reply-item">
                      <strong>{rep.userName}:</strong> {rep.comment}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {showReplyForm[rev._id] && (
                <div className="reply-form">
                  <input 
                    type="text" 
                    placeholder="Write a reply..."
                    value={replyText[rev._id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [rev._id]: e.target.value })}
                  />
                  <button onClick={() => handleReply(rev._id)}>Send</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
