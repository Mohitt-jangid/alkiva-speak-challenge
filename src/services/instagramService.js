/**
 * Instagram Challenge Service
 * Handles communication with backend API endpoints enforcing database constraints.
 */

export async function fetchInstagramOverview() {
  try {
    const res = await fetch('/api/instagram/overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (data && data.success) {
      return data.overview;
    }
    throw new Error(data.error || 'Failed to fetch overview data.');
  } catch (err) {
    console.error('Error in fetchInstagramOverview:', err);
    throw err;
  }
}

export async function submitInstagramLinkApi(userId, link) {
  try {
    const res = await fetch('/api/instagram/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({ userId, link })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Submission failed on server.'
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data
    };
  } catch (err) {
    console.error('Error in submitInstagramLinkApi:', err);
    return {
      success: false,
      error: err.message || 'Network or server error occurred.'
    };
  }
}

export async function fetchUserInstagramHistory(userId) {
  try {
    const res = await fetch(`/api/instagram/history/${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (data && data.success) {
      return data.submissions || [];
    }
    return [];
  } catch (err) {
    console.error('Error fetching user history:', err);
    return [];
  }
}
