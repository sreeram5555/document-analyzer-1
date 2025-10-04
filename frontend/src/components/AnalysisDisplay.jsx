import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCalendar, FiUsers, FiShield, FiAlertTriangle } from 'react-icons/fi';

const AnalysisDisplay = ({ result }) => {
  
  const sections = [
    { title: "Document Summary", content: result.summary, icon: <FiFileText /> },
    { title: "Key Dates & Timelines", content: result.keyDates, icon: <FiCalendar /> },
    { title: "Entities Involved", content: result.entities, icon: <FiUsers /> },
    { title: "Primary Obligations", content: result.obligations, icon: <FiShield /> },
    { title: "Potential Risks & Clauses", content: result.risks, icon: <FiAlertTriangle /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // This makes each child animate one after another
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-h-[500px] overflow-y-auto pr-2" // Added scroll for long content
    >
      {sections.map((section, index) => (
        <motion.div key={index} variants={itemVariants} className="bg-background/50 p-4 rounded-lg border border-secondary/50">
          <h3 className="font-semibold text-primary mb-2 flex items-center">
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {section.content}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnalysisDisplay;