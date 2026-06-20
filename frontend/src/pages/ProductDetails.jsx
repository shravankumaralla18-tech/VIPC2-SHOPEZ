import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star, ShoppingCart, Tag, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    if (!product) return;
    const newQty = Math.max(1, Math.min(product.stock, quantity + val));
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setReviewSuccess(true);
      
      // Reload product details to update star rating aggregates
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-dark-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-4 bg-red-500/10 rounded-full border border-red-500/20 text-red-400 mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Error</h2>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
        <Link to="/products" className="btn-primary inline-flex mt-6">
          Back to products
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200">
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </Link>

      {/* Main product card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Product Image Panel */}
        <div className="glassmorphism rounded-3xl overflow-hidden border border-dark-800 relative shadow-2xl">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'}
            alt={product.name}
            className="w-full h-full object-cover aspect-square"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg">
              <Tag size={12} className="inline mr-1" />
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Product Details Panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-400 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-md">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-150 leading-tight">
              {product.name}
            </h1>
            
            {/* Reviews count and rating aggregate */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center text-amber-450">
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-slate-200">
                {product.rating > 0 ? product.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-slate-500">
                ({product.numReviews} customer {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <div className="border-t border-b border-dark-800 py-6 space-y-3">
            {/* Price section */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-100">${discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm font-medium text-slate-500 line-through">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-green-400 font-bold bg-green-950/20 px-2 py-0.5 rounded border border-green-500/10">
                    Save ${(product.price - discountedPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock status details */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-450">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-green-400 bg-green-950/25 border border-green-500/20 px-2.5 py-1 rounded-lg">
                  In Stock ({product.stock} items)
                </span>
              ) : (
                <span className="text-xs font-bold text-red-400 bg-red-950/25 border border-red-500/20 px-2.5 py-1 rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Cart Quantity adjustment & Submit triggers */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-4 border-t border-dark-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-450">Quantity</span>
                <div className="flex items-center bg-dark-900 border border-dark-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 hover:bg-dark-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-200">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-2 hover:bg-dark-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer py-3.5 !rounded-2xl"
              >
                <ShoppingCart size={18} />
                <span>Add to Shopping Cart</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Reviews & Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-dark-800 pt-12">
        
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Customer Feedback</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-dark-800 text-slate-400">
              {product.reviews.length}
            </span>
          </h2>

          {product.reviews.length === 0 ? (
            <div className="glassmorphism rounded-2xl p-6 text-center border border-dark-850">
              <p className="text-sm text-slate-500">There are no reviews for this item yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="bg-dark-900/60 border border-dark-850 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-200">{rev.name}</span>
                    <span className="text-xs text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-450 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className={i < rev.rating ? 'text-amber-400' : 'text-slate-700'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Panel */}
        <div className="lg:col-span-1">
          <div className="glassmorphism p-6 rounded-2xl border border-dark-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-200">Submit a Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Form Alerts */}
                {reviewSuccess && (
                  <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>Review submitted successfully!</span>
                  </div>
                )}
                {reviewError && (
                  <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {/* Rating selection (Stars) */}
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-slate-655 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? 'currentColor' : 'none'}
                          className={star <= rating ? 'text-amber-400' : 'text-slate-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review comments */}
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-2">Comment</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience using this product..."
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none transition-all"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer py-2.5 text-xs font-bold"
                >
                  {reviewLoading ? 'Submitting...' : (
                    <>
                      <span>Submit Review</span>
                      <Send size={12} />
                    </>
                  )}
                </button>

              </form>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">
                Please{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold underline">
                  Sign In
                </Link>{' '}
                to leave a customer review.
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
