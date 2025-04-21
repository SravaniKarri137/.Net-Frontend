import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

// Inline styles in JS for a professional admin look
const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const styles = {
    dashboardContainer: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f4f7fc',
    },
    sidebar: {
      backgroundColor: '#2c3e50',
      color: '#fff',
      width: '240px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh',
    },
    sidebarTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    sidebarLink: {
      color: '#fff',
      textDecoration: 'none',
      padding: '10px 0',
      fontSize: '18px',
      display: 'block',
      transition: 'background-color 0.3s',
    },
    sidebarLinkHover: {
      backgroundColor: '#34495e',
    },
    content: {
      flex: 1,
      padding: '40px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s',
      marginBottom: '20px',
    },
    cardHover: {
      transform: 'translateY(-10px)',
    },
    title: {
      fontSize: '28px',
      color: '#2c3e50',
      fontWeight: 'bold',
      marginBottom: '30px',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    button: {
      padding: '12px 20px',
      fontSize: '18px',
      fontWeight: '500',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    buttonPrimary: {
      backgroundColor: '#3498db',
      color: '#fff',
    },
    buttonSuccess: {
      backgroundColor: '#27ae60',
      color: '#fff',
    },
    buttonHover: {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      transform: 'scale(1.05)',
    },
    buttonActive: {
      transform: 'scale(0.98)',
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.sidebar}>
        <motion.h2 style={styles.sidebarTitle}>Recruiter Dashboard</motion.h2>
        <div>
          <motion.a
            href="#"
            style={styles.sidebarLink}
            whileHover={{ backgroundColor: '#34495e' }}
            whileTap={{ backgroundColor: '#2c3e50' }}
          >
            Dashboard
          </motion.a>
          <motion.a
            href="#"
            style={styles.sidebarLink}
            whileHover={{ backgroundColor: '#34495e' }}
            whileTap={{ backgroundColor: '#2c3e50' }}
          >
            Settings
          </motion.a>
          <motion.a
            href="#"
            style={styles.sidebarLink}
            whileHover={{ backgroundColor: '#34495e' }}
            whileTap={{ backgroundColor: '#2c3e50' }}
          >
            Logout
          </motion.a>
        </div>
      </div>

      <div style={styles.content}>
        <motion.h2 style={styles.title}>Recruiter Dashboard</motion.h2>

        <Row>
          <Col xs={12} md={6} lg={4}>
            <motion.div
              style={{ ...styles.card, ...styles.cardHover }}
              whileHover={{ scale: 1.05 }}
            >
              <Card.Body>
                <motion.h5
                  style={{ fontWeight: 'bold', fontSize: '20px', color: '#2c3e50' }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Add Job Posting
                </motion.h5>
                <Button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  onClick={() => navigate('/add-posting')}
                >
                  Add Posting
                </Button>
              </Card.Body>
            </motion.div>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <motion.div
              style={{ ...styles.card, ...styles.cardHover }}
              whileHover={{ scale: 1.05 }}
            >
              <Card.Body>
                <motion.h5
                  style={{ fontWeight: 'bold', fontSize: '20px', color: '#2c3e50' }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  View Applications
                </motion.h5>
                <Button
                  style={{ ...styles.button, ...styles.buttonSuccess }}
                  onClick={() => navigate('/view-applications')}
                >
                  View Applications
                </Button>
              </Card.Body>
            </motion.div>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <motion.div
              style={{ ...styles.card, ...styles.cardHover }}
              whileHover={{ scale: 1.05 }}
            >
              <Card.Body>
                <motion.h5
                  style={{ fontWeight: 'bold', fontSize: '20px', color: '#2c3e50' }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  View Interviews
                </motion.h5>
                <Button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  onClick={() => navigate('/all')}
                >
                  View Interviews
                </Button>
              </Card.Body>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
