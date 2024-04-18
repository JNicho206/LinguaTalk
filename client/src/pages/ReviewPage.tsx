import React, { useState } from 'react';

const ReviewPage: React.FC = () => {
  // State to manage the current term and its familiarity level
  const [term, setTerm] = useState('');
  const [familiarity, setFamiliarity] = useState('');

  // Function to handle term input change
  const handleTermChange = (event: any) => {
    setTerm(event.target.value);
  };

  // Function to handle familiarity select change
  const handleFamiliarityChange = (event: any) => {
    setFamiliarity(event.target.value);
  };

  // Function to handle term review submission
  const handleSubmit = (event: any) => {
    event.preventDefault();
    // You can perform any action here, such as sending the review data to the server
    console.log(`Review submitted: Term - ${term}, Familiarity - ${familiarity}`);
    // Clear the form after submission
    setTerm('');
    setFamiliarity('');
  };

  return (
    <div>
      <h2>Term Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="term">Term:</label>
          <input
            type="text"
            id="term"
            value={term}
            onChange={handleTermChange}
            placeholder="Enter Term"
            required
          />
        </div>
        <div>
          <label htmlFor="familiarity">Familiarity:</label>
          <select
            id="familiarity"
            value={familiarity}
            onChange={handleFamiliarityChange}
            required
          >
            <option value="">Select Familiarity Level</option>
            <option value="1">First Encounter</option>
            <option value="2">Vaguely Familiar</option>
            <option value="3">Familiar</option>
            <option value="4">Confident</option>
            <option value="5">Concrete</option>
          </select>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewPage;