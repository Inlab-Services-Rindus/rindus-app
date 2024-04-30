  export const getBackgroundColor = (month: string) => {
    switch (month) {
      case 'Jan':
        return '#2C4D6E';
      case 'Feb':
        return '#74CBFB';
      case 'Mar':
        return '#7578EA';
      case 'Apr':
        return '#4DD699';
      case 'May':
        return '#FF8C61';
      case 'Jun':
        return '#74CBFB';
      case 'Jul':
        return '#F0AE5D';
      case 'Aug':
        return '#FF8C61';
      case 'Sep':
        return '#4DD699';
      case 'Oct':
        return '#7578EA';
      case 'Nov':
        return '#00C18C';
      case 'Dec':
        return '#E8505B';
      default:
        return 'transparent'; 
    }
  };