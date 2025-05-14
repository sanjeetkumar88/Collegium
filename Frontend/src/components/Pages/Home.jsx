import React from 'react';
import { Container, Title, Text, Button, Paper, Grid, Center } from '@mantine/core';
import HeroSection from '../Frontepage/HeroSection';
import TestimonialMarquee from '../Frontepage/TestimonialMarquee';
import {
  FaUsers, FaCalendarAlt, FaShareAlt, FaBook, FaEye, FaAward,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  { title: 'Club Management', icon: FaUsers, description: 'Manage clubs effectively with role-based access and control.' },
  { title: 'Event Management', icon: FaCalendarAlt, description: 'Create and manage events with RSVP, invites, and QR tickets.' },
  { title: 'Collaboration', icon: FaShareAlt, description: 'Collaborate with others on projects and showcase your work.' },
  { title: 'Notes and Resources', icon: FaBook, description: 'Share and access notes and resources for projects and events.' },
  { title: 'Project Showcasing', icon: FaEye, description: 'Display your projects and find inspiration from others.' },
  { title: 'Recognition', icon: FaAward, description: 'Earn recognition for outstanding projects and contributions.' }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative overflow-hidden">
      {/* Decorative SVGs */}
      {/* <img src="/assets/star-doodle.svg" alt="decorative" className="absolute top-10 right-10 w-16 opacity-20 z-0" />
      <img src="/assets/blob-purple.svg" alt="decorative" className="absolute bottom-0 left-0 w-48 opacity-30 z-0" /> */}

      {/* Background Blurs */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.07] bg-cover bg-center pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60vw] h-[60vw] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-2xl z-0" />

      <main className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.div>

        {/* Features */}
        <Container size="xl" py={80}>
          <Title align="center" order={2} mb={40} c="indigo.7">
            Explore Our Features
          </Title>
          <Grid gutter={30}>
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper shadow="md" radius="lg" p="xl" withBorder className="hover:shadow-xl transition-shadow">
                    <Center mb="md">
                      <feature.icon size={40} color="#4f46e5" />
                    </Center>
                    <Title order={4} align="center" c="gray.8" mb="sm">
                      {feature.title}
                    </Title>
                    <Text align="center" c="gray.6">
                      {feature.description}
                    </Text>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>

        {/* Wave Separator */}
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 1440 320" className="block">
            <path fill="#c4b5fd" fillOpacity="1" d="M0,192L80,165.3C160,139,320,85,480,90.7C640,96,800,160,960,160C1120,160,1280,96,1360,64L1440,32V320H0Z" />
          </svg>
        </div>

        {/* Platform Highlights */}
        <Container size="lg" py={80} ta="center">
          <Title order={2} c="indigo.7" mb={32}>Platform Highlights</Title>
          <Grid gutter="xl">
            {[
              { value: '1.5K+', label: 'Projects' },
              { value: '250+', label: 'Clubs' },
              { value: '10K+', label: 'Users' },
              { value: '500+', label: 'Events' },
            ].map((item, idx) => (
              <Grid.Col key={idx} span={{ base: 6, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Text fz="xl" fw={700} c="purple.6">{item.value}</Text>
                  <Text c="gray.6">{item.label}</Text>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>

        {/* Call to Action */}
        <Container size="xl" py={80}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper radius="lg" p="xl" bg="indigo.7" c="white" shadow="lg" withBorder>
              <Title order={2} align="center" mb="sm">Join the Community Today!</Title>
              <Text align="center" size="lg" mb="lg">
                Get started by creating your profile and exploring clubs, events, and resources.
              </Text>
              <Center>
                <Button variant="white" color="indigo" size="md" radius="xl">
                  Get Started
                </Button>
              </Center>
            </Paper>
          </motion.div>
        </Container>

        {/* About Section */}
        <Container size="lg" py={80} bg="white">
          <Title order={2} align="center" c="indigo.7" mb="sm">About Us</Title>
          <Text align="center" size="md" maw={600} mx="auto" c="gray.7">
            We’re a team of passionate developers and students building a collaborative ecosystem for clubs, events, and project showcasing.
            Our goal is to empower innovation and learning in communities.
          </Text>
        </Container>

        {/* Testimonials */}
        <TestimonialMarquee />
      </main>
    </div>
  );
};

export default Home;
