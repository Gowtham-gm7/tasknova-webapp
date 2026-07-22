import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="py-12 text-slate-400 text-xs text-left">Computing Analytics Metrics...</div>;

  return (
    <div>
      <AnalyticsCharts analytics={analytics} />
    </div>
  );
};
