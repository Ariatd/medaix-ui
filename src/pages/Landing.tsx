'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useInView, useCountUp, prefersReducedMotion } from '../hooks/useScrollAnimation';

const Landing: React.FC = () => {
  const reduceMotion = prefersReducedMotion();

  // Section refs
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [stepsRef, stepsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: 0,
      },
    },
  };

  // Count up values for stats
  const accuracyCount = useCountUp(87, statsInView && !reduceMotion, 2);
  const speedCount = useCountUp(450, statsInView && !reduceMotion, 2);
  const usersCount = useCountUp(12, statsInView && !reduceMotion, 2);

  const easeConfig = reduceMotion ? { duration: 0 } : { duration: 0.8 };
  const staggerDelay = reduceMotion ? 0 : 0.1;

  return (
    <Layout>
      <div className="w-full overflow-hidden">
        {/* Landing Page Header - Custom layout for unauthenticated users */}
        <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-600 to-blue-700 relative">
          {/* Left - Text */}
          <span className="text-xl font-bold text-white">MedAIx</span>
          
          {/* Right - Buttons */}
          <div className="flex gap-3">
            <Link 
              to="/login" 
              className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition text-sm font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition text-sm font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* SECTION 1: Hero */}
        <motion.section
          ref={heroRef}
          initial="initial"
          animate={heroInView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 px-4 py-20"
        >
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Hero Title */}
            <motion.h1
              variants={fadeInUp}
              transition={{ ...easeConfig, delay: 0 }}
              className="mb-4 text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Medical Image{' '}
              <motion.span
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400"
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Analysis
              </motion.span>
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              variants={fadeInUp}
              transition={{ ...easeConfig, delay: staggerDelay }}
              className="mb-8 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Powered by advanced AI algorithms that provide accurate, instant medical image analysis with confidence metrics you can trust.
            </motion.p>

            {/* Hero Button */}
            <motion.div
              variants={fadeInScale}
              transition={{ ...easeConfig, delay: staggerDelay * 2 }}
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                to="/upload"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Get Started
              </Link>
            </motion.div>

            {/* Hero Feature Cards */}
            <motion.div
              variants={staggerContainer}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            >
              {[
                { label: '< 1s', description: 'Analysis Time' },
                { label: '99.2%', description: 'Accuracy Rate' },
                { label: 'HIPAA', description: 'Compliant' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  transition={{ ...easeConfig, delay: staggerDelay * (3 + idx) }}
                  className="px-4 py-3 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 2: Features */}
        <motion.section
          ref={featuresRef}
          className="py-20 px-4 bg-white dark:bg-gray-800"
        >
          <div className="mx-auto max-w-6xl">
            {/* Section Title */}
            <motion.div
              initial="initial"
              animate={featuresInView ? 'animate' : 'initial'}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose MedAIx?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Industry-leading features designed for medical professionals
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial="initial"
              animate={featuresInView ? 'animate' : 'initial'}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: 'lightning',
                  title: 'Lightning Fast',
                  description: 'Get AI-powered analysis results in under 1 second',
                  direction: 'left',
                },
                {
                  icon: 'chart',
                  title: 'Highly Accurate',
                  description: 'State-of-the-art models with 99.2% accuracy rate',
                  direction: 'bottom',
                },
                {
                  icon: 'lock',
                  title: 'Enterprise Secure',
                  description: 'HIPAA compliant with end-to-end encryption',
                  direction: 'right',
                },
              ].map((feature, idx) => {
                const directions = {
                  left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
                  bottom: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
                  right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
                };

                return (
                  <motion.div
                    key={idx}
                    variants={directions[feature.direction as keyof typeof directions]}
                    transition={{ ...easeConfig, delay: staggerDelay * idx }}
                    whileHover={reduceMotion ? {} : { y: -8 }}
                    className="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        animate={featuresInView && !reduceMotion ? { rotate: 360 } : {}}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30 text-primary-600 dark:text-primary-400"
                      >
                        {feature.icon === 'lightning' && (
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M11.3 1.046A1 1 0 0110 2v5H6a1 1 0 00-.82 1.573l2.534 3.767a1 1 0 001.82 0l2.534-3.767A1 1 0 009 7H5V2a1 1 0 00-2 0v5H1a1 1 0 00-.82 1.573l6 9A1 1 0 0710 17v-3h4a1 1 0 00.82-1.573l-2.534-3.767a1 1 0 00-1.82 0L8 13h4v5a1 1 0 102 0v-5h4a1 1 0 00.82-1.573l-6-9A1 1 0 0011.3 1.046z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {feature.icon === 'chart' && (
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        )}
                        {feature.icon === 'lock' && (
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </motion.div>

                      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 3: How It Works */}
        <motion.section
          ref={stepsRef}
          className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <div className="mx-auto max-w-4xl">
            {/* Section Title */}
            <motion.div
              initial="initial"
              animate={stepsInView ? 'animate' : 'initial'}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Three Simple Steps
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get professional medical image analysis in minutes
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial="initial"
              animate={stepsInView ? 'animate' : 'initial'}
              variants={staggerContainer}
              className="space-y-8"
            >
              {[
                {
                  number: 1,
                  title: 'Upload Your Image',
                  description: 'Drag and drop or select medical images (DICOM, JPG, PNG, TIFF)',
                },
                {
                  number: 2,
                  title: 'AI Analysis',
                  description: 'Our advanced models process your image in real-time',
                },
                {
                  number: 3,
                  title: 'View Results',
                  description: 'Get detailed analysis with confidence scores and heatmaps',
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  transition={{ ...easeConfig, delay: staggerDelay * idx }}
                  whileHover={reduceMotion ? {} : { x: 8 }}
                  className="relative"
                >
                  <div className="flex gap-6">
                    {/* Step Number Circle */}
                    <motion.div
                      className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white font-bold text-xl shadow-lg"
                      animate={stepsInView && !reduceMotion ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ delay: staggerDelay * idx * 2, duration: 0.6 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {idx < 2 && (
                    <motion.div
                      className="absolute left-8 top-20 w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-200 dark:from-primary-500 dark:to-primary-700"
                      initial={{ scaleY: 0 }}
                      animate={
                        stepsInView && !reduceMotion ? { scaleY: 1 } : { scaleY: 0 }
                      }
                      transition={{
                        duration: 0.6,
                        delay: staggerDelay * (idx + 1),
                        ease: 'easeOut',
                      }}
                      style={{ originY: 0 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 4: Statistics */}
        <motion.section
          ref={statsRef}
          className="py-20 px-4 bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-primary-900/20"
        >
          <div className="mx-auto max-w-6xl">
            {/* Section Title */}
            <motion.div
              initial="initial"
              animate={statsInView ? 'animate' : 'initial'}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Medical Professionals
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join thousands of healthcare institutions worldwide
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial="initial"
              animate={statsInView ? 'animate' : 'initial'}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { value: accuracyCount, suffix: '%', label: 'Accuracy Rate', color: 'primary' },
                {
                  value: speedCount,
                  suffix: 'ms',
                  label: 'Average Speed',
                  color: 'success',
                },
                {
                  value: usersCount,
                  suffix: 'K+',
                  label: 'Active Users',
                  color: 'warning',
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInScale}
                  transition={{ ...easeConfig, delay: staggerDelay * idx }}
                  whileHover={reduceMotion ? {} : { y: -8 }}
                  className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  {/* Animated background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      stat.color === 'primary'
                        ? 'from-primary-50 dark:from-primary-900/20 to-transparent'
                        : stat.color === 'success'
                        ? 'from-green-50 dark:from-green-900/20 to-transparent'
                        : 'from-orange-50 dark:from-orange-900/20 to-transparent'
                    }`}
                  />

                  <div className="relative z-10 text-center">
                    {/* Pulse animation for value */}
                    <motion.div
                      animate={statsInView && !reduceMotion ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, delay: staggerDelay * idx }}
                    >
                      <div className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 mb-2">
                        {stat.value}
                        <span className="text-3xl sm:text-4xl">{stat.suffix}</span>
                      </div>
                    </motion.div>

                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </p>

                    {/* Progress bar under stat */}
                    <motion.div className="mt-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${
                          stat.color === 'primary'
                            ? 'from-primary-400 to-primary-600'
                            : stat.color === 'success'
                            ? 'from-green-400 to-green-600'
                            : 'from-orange-400 to-orange-600'
                        }`}
                        initial={{ width: '0%' }}
                        animate={statsInView ? { width: `${(stat.value / 100) * 100}%` } : {}}
                        transition={{ duration: 2, delay: staggerDelay * idx, ease: 'easeOut' }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          variants={fadeInUp}
          className="py-20 px-4 bg-white dark:bg-gray-800"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Upload your medical images now and experience professional AI analysis
            </p>
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                to="/upload"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Upload Image
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Landing;

