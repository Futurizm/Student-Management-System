const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const groupService = {
  getGroups: async () => {
    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
  },

  createGroup: async (groupData) => {
    const response = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
  }
};