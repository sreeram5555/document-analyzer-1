

import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiFileText, FiCalendar, FiUsers, FiShield, 
    FiAlertTriangle, FiKey, FiHash, FiInfo 
} from 'react-icons/fi';

// Helper to get an icon based on the data key from the ML agent
const getIcon = (key) => {
    if (key.includes('date')) return <FiCalendar />;
    if (key.includes('summary')) return <FiFileText />;
    if (key.includes('term') || key.includes('entities')) return <FiUsers />;
    if (key.includes('obligation')) return <FiShield />;
    if (key.includes('risk')) return <FiAlertTriangle />;
    if (key.includes('heading')) return <FiInfo />;
    if (key.includes('category')) return <FiHash />;
    return <FiKey />;
};

// Helper to format the key into a readable title (e.g., "key_terms" -> "Key Terms")
const formatTitle = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const AnalysisDisplay = ({ result }) => {
    // result is the `structured_data` object from the API
    if (!result) {
        return <p className="text-text-secondary">No analysis data available.</p>;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
            className="space-y-4"
        >
            {/* Loop through every key-value pair in the analysis result */}
            {Object.entries(result).map(([key, value]) => {
                // Don't render empty fields
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    return null;
                }

                return (
                    <motion.div key={key} variants={itemVariants} className="bg-background/50 p-4 rounded-lg border border-secondary/50">
                        <h3 className="font-semibold text-primary mb-2 flex items-center">
                            <span className="mr-3">{getIcon(key)}</span>
                            {formatTitle(key)}
                        </h3>
                        <div className="text-text-secondary text-sm leading-relaxed pl-8">
                            {/* Handle different data types from the ML agent */}
                            {Array.isArray(value) ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {value.map((item, i) => (
                                        <li key={i}>
                                            {/* Check if the item is a date object */}
                                            {item.date && item.event 
                                                ? `${item.date}: ${item.event}` 
                                                : item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{value.toString()}</p>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default AnalysisDisplay;