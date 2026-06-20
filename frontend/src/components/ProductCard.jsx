import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Star, ShoppingCart, Tag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { _id, name, price, discount, rating, imageUrl, category, stock } = product;

  // Calculate discounted price
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stop click propagating to the card Link
    addToCart(product, 1);
  };

  return (
    <div className="group relative rounded-lg bg-white border border-slate-200 hover:border-cyan-500 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between glow-card shadow-sm">
      
      {/* Product Image and Badges */}
      <Link to={`/products/${_id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-white/95 text-[10px] uppercase font-bold text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
          {category}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-cyan-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Tag size={10} />
            {discount}% OFF
          </span>
        )}

        {/* Stock warning */}
        {stock === 0 ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-50 text-red-700 border border-red-200 font-bold text-xs uppercase px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          </div>
        ) : stock <= 5 ? (
          <span className="absolute bottom-3 left-3 bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] px-2 py-0.5 rounded-md">
            Only {stock} left
          </span>
        ) : null}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        
        <div>
          {/* Stars Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star size={14} fill="currentColor" />
            </div>
            <span className="text-xs font-semibold text-slate-500">{rating > 0 ? rating.toFixed(1) : 'No reviews'}</span>
          </div>

          {/* Title */}
          <Link to={`/products/${_id}`}>
            <h3 className="text-sm font-bold text-slate-950 group-hover:text-cyan-700 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-950">${discountedPrice.toFixed(2)}</span>
                <span className="text-xs font-medium text-slate-500 line-through">${price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-950">${price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`p-2.5 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer ${
              stock === 0
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-cyan-50 hover:bg-cyan-700 text-cyan-700 hover:text-white border-cyan-100 hover:border-cyan-700'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
