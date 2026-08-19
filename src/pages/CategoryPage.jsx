import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ProductsPage } from './ProductsPage';
import { categories } from '../data/categories';

export const CategoryPage = () => {
  const location = useLocation();
  const pathSlug = location.pathname.replace(/^\//, '').replace(/\/$/, '');
  
  const currentCategory = categories.find((c) => c.slug === pathSlug) || {
    name: pathSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: pathSlug
  };

  return (
    <ProductsPage
      defaultCategory={currentCategory.slug}
      pageTitle={currentCategory.name}
    />
  );
};
