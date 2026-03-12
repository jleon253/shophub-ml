import React, { useEffect } from 'react';
import './ProfilePage.css';
import { useApp } from '../../context/AppContext/AppContext';
import Header from '../../components/Header/Header';
import { User, Order, OrderItem } from '../../types';
import { useFetch } from '../../hooks/useFetch';

const ProfilePage = () => {
  const { user } = useApp();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  const { data: userData, loading: loadingUser } = useFetch<User>(user ? `/api/users/${user.id}` : '');
  const { data: ordersData, loading: loadingOrders } = useFetch<Order[]>(user ? `/api/users/${user.id}/orders` : '');

  const orders = ordersData || [];
  const loading = loadingUser || loadingOrders;

  if (loading || !userData) {
    return (
      <div>
        <Header />
        <main className="container">
          <div className="loading" aria-live="polite" aria-busy="true">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="my-4">My Profile</h1>

        <section className="profile-card" aria-labelledby="personal-info-heading">
          <h2 id="personal-info-heading" className="mb-3">Personal Information</h2>
          <p className="mb-2"><strong>Name:</strong> {userData.name}</p>
          <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
          <p className="mb-2"><strong>Phone:</strong> {userData.phone}</p>
          {userData.address && (
            <p className="mb-2">
              <strong>Address:</strong> {userData.address.street}, {userData.address.city}, {userData.address.state} {userData.address.zip}
            </p>
          )}
        </section>

        <section aria-labelledby="order-history-heading">
          <h2 id="order-history-heading" className="mb-3">Order History</h2>
          {orders.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {orders.map((order: Order) => (
                <article
                  key={order.id}
                  className="order-card"
                  aria-label={`Order #${order.id}`}
                >
                  <div className="d-flex justify-between mb-3">
                    <div>
                      <strong>Order #{order.id}</strong>
                      <div className="text-sm text-muted">
                        <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString()}</time>
                      </div>
                    </div>
                    <div>
                      <span className={`status-badge ${order.status === 'delivered' ? 'status-delivered' : 'status-pending'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Items:</strong>
                    <ul className="ml-3">
                      {order.items.map((item: OrderItem, index: number) => (
                        <li key={index} className="text-sm">
                          {item.title} (x{item.quantity}) — ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="total-price">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="profile-card text-center">
              No orders yet
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;

