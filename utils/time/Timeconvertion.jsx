const Timeconvertion = (timestamp) => {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

  // Format the date and time
  const formattedDate = date.toLocaleString(); // This will give you a locale-specific date and time

  return formattedDate; // Output: "7/2/2024, 9:58:25 AM" (example output, actual output may vary based on locale settings)
};

export default Timeconvertion;
