const { DateTime } = require('luxon');

const getMarketActivityConfig = () => {
  return {
    MARKET_ACTIVITY_PEAK_HOURS: {
      startTime: '09:00',
      endTime: '16:00',
      weekdays: true,
      MAX_PERSONS_TO_SIMULATE: 5,
      MIN_PERSONS_TO_SIMULATE: 2,
      MIN_GAP_BETWEEN_PERSONS: 60000, // 1 minute in ms
      MIN_GAP_BETWEEN_DOWNLOAD: 30000, // 30 seconds in ms
      MIN_LINKS_TO_DOWNLOAD: 5
    },
    MARKET_NO_ACTIVITY_HOURS: {
      startTime: '00:00',
      endTime: '08:00',
      allDays: true,
      MAX_PERSONS_TO_SIMULATE: 0,
      MIN_PERSONS_TO_SIMULATE: 0,
      MIN_GAP_BETWEEN_PERSONS: 300000, // 5 minutes in ms
      MIN_GAP_BETWEEN_DOWNLOAD: 180000, // 3 minutes in ms
      MIN_LINKS_TO_DOWNLOAD: 1
    },
    MARKET_OFF_PEAK_HOURS: {
      weekday: {
        periods: [
          { startTime: '08:00', endTime: '09:00' },
          { startTime: '16:00', endTime: '23:55' }
        ]
      },
      weekend: {
        startTime: '08:00',
        endTime: '23:55'
      },
      MAX_PERSONS_TO_SIMULATE: 3,
      MIN_PERSONS_TO_SIMULATE: 1,
      MIN_GAP_BETWEEN_PERSONS: 120000, // 2 minutes in ms
      MIN_GAP_BETWEEN_DOWNLOAD: 60000, // 1 minute in ms
      MIN_LINKS_TO_DOWNLOAD: 3
    }
  };
};

const getMarketPeakHours = () => {
  return getMarketActivityConfig().MARKET_ACTIVITY_PEAK_HOURS;
};

const getCurrentActivityBand = () => {
  const now = DateTime.now().setZone('Asia/Kolkata');
  const config = getMarketActivityConfig();
  const isWeekend = now.weekday > 5;
  const currentTime = now.toFormat('HH:mm');

  // Check if in no activity hours
  if (isInTimeRange(currentTime, config.MARKET_NO_ACTIVITY_HOURS.startTime, config.MARKET_NO_ACTIVITY_HOURS.endTime)) {
    return { band: 'MARKET_NO_ACTIVITY_HOURS', config: config.MARKET_NO_ACTIVITY_HOURS };
  }

  // Check if in peak hours (weekdays only)
  if (!isWeekend && isInTimeRange(currentTime, config.MARKET_ACTIVITY_PEAK_HOURS.startTime, config.MARKET_ACTIVITY_PEAK_HOURS.endTime)) {
    return { band: 'MARKET_ACTIVITY_PEAK_HOURS', config: config.MARKET_ACTIVITY_PEAK_HOURS };
  }

  // Otherwise it's off-peak
  return { band: 'MARKET_OFF_PEAK_HOURS', config: config.MARKET_OFF_PEAK_HOURS };
};

const isInTimeRange = (current, start, end) => {
  return current >= start && current <= end;
};

module.exports = {
  getMarketActivityConfig,
  getMarketPeakHours,
  getCurrentActivityBand
};