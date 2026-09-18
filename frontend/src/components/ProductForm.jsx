// Workshop Index design: product editing uses direct, labeled controls and keeps inventory quantities visually separate from descriptive fields.

import { useEffect, useState } from 'react';

const empty = {
  sku: '',
  name: '',
  description: '',
  unitPrice: '',
  quantity: '',
  reorderLevel: '0',
  isActive: true,
};

export default function ProductForm({
  product,
  onSave,
  onCancel,
  busy,
}) {
  const [values, setValues] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    setValues(
      product
        ? {
            sku: product.sku,
            name: product.name,
            description: product.description || '',
            unitPrice: product.unit_price,
            quantity: product.quantity,
            reorderLevel: product.reorder_level,
            isActive: product.is_active,
          }
        : empty
    );

    setError('');
  }, [product]);

  const update = (event) =>
    setValues((old) => ({
      ...old,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    }));

  const submit = (event) => {
    event.preventDefault();

    if (
      !values.sku ||
      !values.name ||
      values.unitPrice === '' ||
      values.quantity === ''
    ) {
      return setError(
        'Code, name, unit price, and quantity are required.'
      );
    }

    onSave({
      ...values,
      unitPrice: Number(values.unitPrice),
      quantity: Number(values.quantity),
      reorderLevel: Number(values.reorderLevel),
    });
  };

  return (
    <form
      className="product-form"
      onSubmit={submit}
    >
      <div className="form-title">
        <span className="index-dot" />
        {product
          ? 'Edit stock record'
          : 'New stock record'}
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="form-grid">
        <label>
          Code
          <input
            name="sku"
            value={values.sku}
            onChange={update}
            placeholder="MUG-COBALT"
          />
        </label>

        <label>
          Product name
          <input
            name="name"
            value={values.name}
            onChange={update}
            placeholder="Cobalt Stoneware Mug"
          />
        </label>

        <label>
          Unit price
          <input
            name="unitPrice"
            value={values.unitPrice}
            onChange={update}
            type="number"
            min="0"
            step="0.01"
          />
        </label>

        <label>
          On hand
          <input
            name="quantity"
            value={values.quantity}
            onChange={update}
            type="number"
            min="0"
            step="1"
          />
        </label>

        <label>
          Reorder level
          <input
            name="reorderLevel"
            value={values.reorderLevel}
            onChange={update}
            type="number"
            min="0"
            step="1"
          />
        </label>

        <label className="check-label">
          <input
            name="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={update}
          />
          Available for sale
        </label>

        <label className="full">
          Description
          <textarea
            name="description"
            value={values.description}
            onChange={update}
            rows="3"
            placeholder="Optional reference for staff"
          />
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="button"
          disabled={busy}
        >
          {busy ? 'Saving…' : 'Save product'}
        </button>
      </div>
    </form>
  );
}