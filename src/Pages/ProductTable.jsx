import React from 'react';
import '../style/d_style.css';

const products = [
  { id: 1, name: 'Plate', price: 100, description: 'Ceramic plate' },
  { id: 2, name: 'Cup', price: 50, description: 'Glass cup' },
];

const ProductTable = () => {
  return (
    <div className="d_MP-container max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="d_MP-title text-2xl font-bold mb-6 text-center">Product List</h2>
      <table className="d_MP-table w-full border-collapse">
        <thead>
          <tr>
            <th className="d_MP-th px-4 py-2 border-b">#</th>
            <th className="d_MP-th px-4 py-2 border-b">Name</th>
            <th className="d_MP-th px-4 py-2 border-b">Price</th>
            <th className="d_MP-th px-4 py-2 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={product.id} className="hover:bg-[#e6eef5]">
              <td className="d_MP-td px-4 py-2 border-b">{idx + 1}</td>
              <td className="d_MP-td px-4 py-2 border-b">{product.name}</td>
              <td className="d_MP-td px-4 py-2 border-b">₹{product.price}</td>
              <td className="d_MP-td px-4 py-2 border-b">{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 