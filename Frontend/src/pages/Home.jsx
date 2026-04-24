import React from 'react';
import { Container, Title, Text, Button, Paper, Grid, Center } from '@mantine/core';
import HeroSection from '../components/features/landing/HeroSection';
import TestimonialMarquee from '../components/features/landing/TestimonialMarquee';
import {
  FaUsers, FaCalendarAlt, FaShareAlt, FaBook, FaEye, FaAward, FaUserCircle
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.03] pointer-events-none" />
      
      <main className="relative z-10">
        <HeroSection />

        {/* Features Section */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
          
          <Container size="xl">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
              >
                Everything You Need to <span className="text-gradient">Excel</span>
              </motion.h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                A comprehensive ecosystem designed to empower students through collaboration, resources, and community engagement.
              </p>
            </div>

            <Grid gutter={30}>
              {features.map((feature, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-full p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <feature.icon size={30} className="text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-white">
          <Container size="lg">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 mb-4">How it Works</h2>
              <p className="text-slate-500">Three simple steps to unlock your potential.</p>
            </div>
            
            <div className="relative">
              {/* Connector Line (Desktop) */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 hidden md:block -translate-y-1/2" />
              
              <Grid gutter={40}>
                {[
                  { step: '01', title: 'Create Profile', desc: 'Sign up and tell us about your interests and skills.' },
                  { step: '02', title: 'Join Communities', desc: 'Find clubs and projects that match your passion.' },
                  { step: '03', title: 'Start Building', desc: 'Collaborate, share resources, and grow together.' }
                ].map((item, idx) => (
                  <Grid.Col key={idx} span={{ base: 12, md: 4 }}>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30 ring-8 ring-white">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </Grid.Col>
                ))}
              </Grid>
            </div>
          </Container>
        </section>

        {/* Platform Highlights */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />
          <Container size="lg">
            <Grid gutter="xl" align="center">
              {[
                { value: '1.5K+', label: 'Active Projects', icon: FaEye },
                { value: '250+', label: 'Verified Clubs', icon: FaUsers },
                { value: '10K+', label: 'Community Members', icon: FaUserCircle },
                { value: '500+', label: 'Events Hosted', icon: FaCalendarAlt },
              ].map((item, idx) => (
                <Grid.Col key={idx} span={{ base: 6, md: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-black text-white mb-2">{item.value}</div>
                    <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">{item.label}</div>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative">
          <Container size="xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[3rem] bg-blue-600 p-12 md:p-20 text-center"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/20 blur-3xl rounded-full -ml-48 -mb-48" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to transform your college life?</h2>
                <p className="text-blue-100 text-xl mb-10">Join thousands of students who are already building the future on Collegium.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="white" color="blue" size="xl" radius="2xl" className="px-10 font-bold hover:scale-105 transition-transform shadow-xl">
                    Join Now — It's Free
                  </Button>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Simple Footer / About Minimal */}
        <footer className="py-12 border-t border-slate-100">
          <Container size="lg" className="text-center">
            <div className="text-2xl font-black text-blue-600 mb-6">COLLEGIUM</div>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Empowering innovation and learning through a collaborative ecosystem for students and clubs.
            </p>
            <div className="text-slate-400 text-sm">© 2024 Collegium. All rights reserved.</div>
          </Container>
        </footer>
      </main>
    </div>
  );
};

export default Home;
