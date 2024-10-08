/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const DEFAULT_OWNER_VALUE = 'All';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return { ...product, category, owner: user };
});

function getVisibleProducts(
  currentProds,
  { filterOwner, filterProductName, filterCategoryName },
) {
  let visibleProducts = [...currentProds];
  const normalizedFilterProductName = filterProductName
    .toLocaleLowerCase()
    .trim();

  if (filterOwner !== DEFAULT_OWNER_VALUE) {
    visibleProducts = visibleProducts.filter(
      ({ owner }) => owner.name === filterOwner,
    );
  }

  if (normalizedFilterProductName) {
    visibleProducts = visibleProducts.filter(product => {
      const normalizedProductName = product.name.toLocaleLowerCase().trim();

      return normalizedProductName.includes(normalizedFilterProductName);
    });
  }

  if (filterCategoryName.length) {
    visibleProducts = visibleProducts.filter(({ category }) => {
      return filterCategoryName.includes(category.title);
    });
  }

  return visibleProducts;
}

export const App = () => {
  const [filterOwner, setFilterOwner] = useState(DEFAULT_OWNER_VALUE);
  const [filterProductName, setFilterProductName] = useState('');
  const [filterCategoryName] = useState([]);

  const visibleProducts = getVisibleProducts(products, {
    filterOwner,
    filterProductName,
    filterCategoryName,
  });

  // unfinished task 5

  // const handleAddCategory = categoryName => {
  //   setFilterCategoryName
  // }

  // const handleRemoveCategory = categoryName => {

  // }

  // const handleFilterCategoryName = categoryName => {

  // }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': filterOwner === DEFAULT_OWNER_VALUE,
                })}
                onClick={() => setFilterOwner(DEFAULT_OWNER_VALUE)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href="#/"
                  className={cn({
                    'is-active': filterOwner === user.name,
                  })}
                  onClick={() => setFilterOwner(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterProductName}
                  onChange={event =>
                    setFilterProductName(event.target.value.trimStart())
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterProductName ? (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setFilterProductName('')}
                    />
                  </span>
                ) : (
                  ''
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.owner.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
