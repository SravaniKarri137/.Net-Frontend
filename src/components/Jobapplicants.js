import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Button, Form, Col, Row, Badge, Card } from 'react-bootstrap';

const JobApplicants = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [mode, setMode] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`https://localhost:7235/api/JobApplication/by-job/${id}`);
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants", error);
      }
    };

    fetchApplicants();
  }, [id]);

  const handleStatusInitiate = (newStatus, applicantId) => {
    setSelectedApplicantId(applicantId);
    setPendingStatus(newStatus);
    setNotes('');
    setRating(0);
    setInterviewDate('');
    setInterviewer('');
    setMode('');
  };

  const handleStatusChange = async () => {
    if (!selectedApplicantId || !pendingStatus) return;

    const dto = {
      Status: pendingStatus,
      Notes: notes,
      Rating: rating,
      ScheduleInterview: pendingStatus === 'Selected',
      InterviewDate: pendingStatus === 'Selected' ? new Date(interviewDate) : new Date(),
      Interviewer: pendingStatus === 'Selected' ? interviewer : '',
      Mode: pendingStatus === 'Selected' ? mode : ''
    };

    try {
      const response = await axios.post(
        `https://localhost:7235/api/JobApplication/update-status-and-shortlist/${selectedApplicantId}`,
        dto
      );

      console.log("Status updated:", response.data);

      setApplicants(applicants.map(applicant =>
        applicant.id === selectedApplicantId ? { ...applicant, status: pendingStatus } : applicant
      ));

      setSelectedApplicantId(null);
      setPendingStatus('');
      setNotes('');
      setRating(0);
      setInterviewDate('');
      setInterviewer('');
      setMode('');
    } catch (error) {
      console.error("Error updating status", error.response);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected': return <Badge bg="success">Selected</Badge>;
      case 'On Hold': return <Badge bg="warning" text="dark">On Hold</Badge>;
      case 'Rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">Pending</Badge>;
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">👥 Applicants for Job ID: {id}</h2>

      {applicants.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Applied At</th>
              <th>Job Title</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{applicant.candidateName}</td>
                <td>{applicant.email}</td>
                <td>{new Date(applicant.appliedAt).toLocaleString()}</td>
                <td>{applicant.jobTitle}</td>
                <td>
                  <a href={applicant.resumeUrl} download target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td>{getStatusBadge(applicant.status)}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusInitiate('Selected', applicant.id)}
                    disabled={applicant.status === 'Selected'}
                    className="mb-1"
                  >
                    Select
                  </Button>
                  {applicant.status !== 'Selected' && (
                    <>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleStatusInitiate('On Hold', applicant.id)}
                        disabled={applicant.status === 'On Hold'}
                        className="mb-1"
                      >
                        On Hold
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatusInitiate('Rejected', applicant.id)}
                        disabled={applicant.status === 'Rejected'}
                        className="mb-1"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No applicants found for this job.</p>
      )}

      {selectedApplicantId && pendingStatus !== 'Rejected' && (
        <div className="mt-4">
          <h5>Provide Notes and Rating for Applicant #{selectedApplicantId} — <em>{pendingStatus}</em></h5>
          <Card className="p-4 mt-3 shadow-sm">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter notes..."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formRating">
                    <Form.Label>Rating (1-5)</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={5}
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      placeholder="Enter rating..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              {pendingStatus === 'Selected' && (
                <>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="formInterviewDate">
                        <Form.Label>Interview Date & Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formInterviewer">
                        <Form.Label>Interviewer Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={interviewer}
                          onChange={(e) => setInterviewer(e.target.value)}
                          placeholder="Enter interviewer name..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="formMode">
                        <Form.Label>Interview Mode</Form.Label>
                        <Form.Select
                          value={mode}
                          onChange={(e) => setMode(e.target.value)}
                        >
                          <option value="">Select mode</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              <Button
                variant="primary"
                className="mt-3"
                onClick={handleStatusChange}
                disabled={!notes || rating < 1 || rating > 5 || (pendingStatus === 'Selected' && (!interviewDate || !interviewer || !mode))}
              >
                Confirm {pendingStatus}
              </Button>{' '}
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => {
                  setSelectedApplicantId(null);
                  setPendingStatus('');
                  setNotes('');
                  setRating(0);
                  setInterviewDate('');
                  setInterviewer('');
                  setMode('');
                }}
              >
                Cancel
              </Button>
            </Form>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default JobApplicants;
