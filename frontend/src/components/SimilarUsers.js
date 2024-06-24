// SimilarUsers.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem } from '@mui/material';

const SimilarUsers = () => {
  const [similarUsers, setSimilarUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSimilarUsers();
  }, []);

  const fetchSimilarUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/similar-users'); // Adjust URL as per your backend setup
      if (!response.ok) {
        throw new Error('Failed to fetch similar users');
      }
      const data = await response.json();
      setSimilarUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return (
      <Card className="custom-card">
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Similar Users
          </Typography>
          <Typography variant="body1" color="error">
            Failed to fetch similar users: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="custom-card">
      <CardContent>
        <Typography variant="h2" gutterBottom>
          Similar Users
        </Typography>
        <List>
          {similarUsers.length > 0 ? (
            similarUsers.map((user, index) => (
              <ListItem key={index} className="custom-list-item">
                {user}
              </ListItem>
            ))
          ) : (
            <ListItem className="custom-list-item" >
              No similar users found
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default SimilarUsers;
