import { AppLayout } from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ask.pradanayahya.me - AI Q&A Platform</title>
        <meta name="description" content="Platform tanya jawab berbasis AI dengan berbagai ruang pengetahuan. Tanyakan seputar kampus, dokumentasi, dan lainnya." />
        <meta name="keywords" content="AI, Q&A, chatbot, RAG, knowledge base, tanya jawab" />
        <link rel="canonical" href="https://ask.pradanayahya.me" />
      </Helmet>
      <AppLayout />
    </>
  );
};

export default Index;
