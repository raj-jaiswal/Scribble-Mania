import React from 'react';
import Swal from 'sweetalert2';
import icon from './assets/ActiveUserBtn.svg'

const ActiveUsersButton = ({ activeUsers }) => {
  const showActiveUsers = () => {
    const totalUsers = activeUsers.length;
    const userList = activeUsers.map(user =>
      `<div class="text-left p-3 border-b border-gray-200">
        <strong class="text-lg">${user.displayName}</strong><br/>
        <small class="text-gray-600">${user.email}</small>
      </div>`
    ).join('');

    Swal.fire({
      title: 'Active Users',
      html: `
        <div class="text-left">
          <div class="mb-4 p-2 bg-gray-100 rounded-lg">
            <strong class="text-lg">Total Users: ${totalUsers}</strong>
          </div>
          <div class="user-list-container" style="max-height: 280px; overflow-y: auto;">
            ${userList}
          </div>
        </div>`,
      showConfirmButton: false,
      showCloseButton: true,
      closeButtonHtml: '&times;',
      customClass: {
        popup: 'swal-wide',
        closeButton: 'swal2-close-button'
      }
    });
  };

  return (
    <button
      onClick={showActiveUsers}
      className="m-3 px-6 py-3 rounded-lg bg-white font-bold transition text-black hover:-translate-y-1 hover:scale-105"
    >
      <img
        src={icon}
        alt="View Active Users"
        className="w-7"
      />
    </button>
  );
};

export default ActiveUsersButton; 