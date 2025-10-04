import React from 'react';

const DocumentViewer = ({ file }) => {
  return (
    <div className="flex-grow bg-background rounded-lg p-6 overflow-y-auto border border-secondary">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-primary">{file.name}</h3>
        <p className="text-sm text-text-secondary">Simulated Document Preview</p>
      </div>
      <div className="space-y-4 text-text-secondary text-sm">
        <h4 className="font-semibold text-text-primary text-base">Section 1: Introduction</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
        <p>Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor.</p>
        
        <h4 className="font-semibold text-text-primary text-base pt-4">Section 2: Terms and Conditions</h4>
        <p>Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>
        <p>Maecenas commodo, magna quis egestas eleifend, turpis lorem tincidunt justo, a pulvinar neque justo vitae turpis. Aliquam dolor, egestas eget, iaculis vel, cursus vim, elit. Nulla vitae mauris. Nam egestas, pede vitae dapibus consectetuer, magna lacus iaculis elit, vitae gravida odio turpis vitae est.</p>
        <div className="w-full h-20 bg-secondary/50 rounded flex items-center justify-center my-4">
            [Simulated Chart or Image]
        </div>
        <p>Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</p>
      </div>
    </div>
  );
};

export default DocumentViewer;