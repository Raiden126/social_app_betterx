// Format time ago helper function
export const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60)
      return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24)
      return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12)
      return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  
    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
  };