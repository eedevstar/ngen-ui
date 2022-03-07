/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { AuditSurveyReviewForm } from '../vessels/vessel-detail/forms/AuditSurveyReviewForm';
import { Infobar, Navbar } from 'components';

export default {
  title: 'Pages/AddForms/AddAuditSurveyReview',
  component: AuditSurveyReviewForm,
};

export const Audit = () => (
  <div
    css={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Navbar />
    <Infobar
      breadcrumbs={[
        { name: 'Customer', route: '/home' },
        { name: 'Vessels', route: '/vessels' },
      ]}
    />
    <AuditSurveyReviewForm type={'Audit'} />
  </div>
);

export const Survey = () => (
  <div
    css={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Navbar />
    <Infobar
      breadcrumbs={[
        { name: 'Customer', route: '/home' },
        { name: 'Vessels', route: '/vessels' },
      ]}
    />
    <AuditSurveyReviewForm type={'Survey'} />
  </div>
);

export const Review = () => (
  <div
    css={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Navbar />
    <Infobar
      breadcrumbs={[
        { name: 'Customer', route: '/home' },
        { name: 'Vessels', route: '/vessels' },
      ]}
    />
    <AuditSurveyReviewForm type={'Review'} />
  </div>
);
