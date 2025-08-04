import React from 'react';
import { Helmet } from 'react-helmet';
import SubscriptionPlans from '../../Components/SubscriptionPlans/SubscriptionPlans';

const Subscription = () => {
  return (
    <>
      <Helmet>
        <title>Subscription Plans - AgriVision</title>
        <meta name="description" content="Choose the perfect subscription plan for your agricultural operations with AgriVision's flexible pricing options." />
      </Helmet>
      
      <SubscriptionPlans />
    </>
  );
};

export default Subscription; 