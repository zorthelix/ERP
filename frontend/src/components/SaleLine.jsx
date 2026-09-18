// Workshop Index design: sale lines are explicit register rows with clear quantity controls and line-level revenue visibility.

import { Minus, Plus, Trash2 } from 'lucide-react';

export default function SaleLine({
  item,
  onChangeQuantity,
  onRemove,
}) {
  return (
    <div className="sale-line">
      <div className="sale-product">
        <b>{item.name}</b>

        <small>
          {item.sku} · {item.quantityAvailable} on hand
        </small>
      </div>

      <div className="quantity-stepper">
        <button
          onClick={() =>
            onChangeQuantity(
              item.productId,
              item.quantity - 1
            )
          }
          aria-label="Reduce quantity"
        >
          <Minus size={14} />
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            onChangeQuantity(
              item.productId,
              item.quantity + 1
            )
          }
          disabled={
            item.quantity >= item.quantityAvailable
          }
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <strong>
        रु{(item.unitPrice * item.quantity).toFixed(2)}
      </strong>

      <button
        className="line-remove"
        onClick={() => onRemove(item.productId)}
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}