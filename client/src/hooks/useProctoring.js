import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export const useProctoring = (isRecording) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const streamRef = useRef(null);

  const [violations, setViolations] = useState({
    noFaceDetected: false,
    multiplePeople: false,
    phoneDetected: false,
  });

  const [violationCounts, setViolationCounts] = useState({
    noFace: 0,
    multiplePeople: 0,
    phone: 0,
  });

  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Initialize camera and model
  useEffect(() => {
    let mounted = true;

    const initializeProctoring = async () => {
      try {
        // Load TensorFlow model
        console.log('Loading COCO-SSD model...');
        const model = await cocoSsd.load();
        if (mounted) {
          modelRef.current = model;
          setIsModelLoaded(true);
          console.log('Model loaded successfully');
        }

        // Get camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user' 
          },
        });

        if (mounted && videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error initializing proctoring:', error);
      }
    };

    initializeProctoring();

    return () => {
      mounted = false;
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Clear detection interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Run detection when recording starts
  useEffect(() => {
    if (!isRecording || !modelRef.current || !videoRef.current || !isModelLoaded) {
      return;
    }

    console.log('Starting proctoring detection...');

    const detectObjects = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        return;
      }

      try {
        const predictions = await modelRef.current.detect(videoRef.current);
        
        // Count people and detect phones
        let personCount = 0;
        let phoneDetected = false;

        predictions.forEach(prediction => {
          if (prediction.class === 'person') {
            personCount++;
          }
          if (prediction.class === 'cell phone' || prediction.class === 'phone') {
            phoneDetected = true;
          }
        });

        // Check violations
        const noFace = personCount === 0;
        const multiplePeople = personCount > 1;

        // Update violations
        setViolations({
          noFaceDetected: noFace,
          multiplePeople: multiplePeople,
          phoneDetected: phoneDetected,
        });

        // Increment violation counts
        if (noFace || multiplePeople || phoneDetected) {
          setViolationCounts(prev => ({
            noFace: noFace ? prev.noFace + 1 : prev.noFace,
            multiplePeople: multiplePeople ? prev.multiplePeople + 1 : prev.multiplePeople,
            phone: phoneDetected ? prev.phone + 1 : prev.phone,
          }));
        }

        // Draw detection boxes on canvas (optional - for debugging)
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            
            // Draw box
            ctx.strokeStyle = prediction.class === 'person' ? '#10B981' : '#EF4444';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
            
            // Draw label
            ctx.fillStyle = prediction.class === 'person' ? '#10B981' : '#EF4444';
            ctx.font = '16px Arial';
            ctx.fillText(
              `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
              x,
              y > 20 ? y - 5 : y + 20
            );
          });
        }
      } catch (error) {
        console.error('Error during detection:', error);
      }
    };

    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(detectObjects, 2000);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isRecording, isModelLoaded]);

  const resetViolations = () => {
    setViolations({
      noFaceDetected: false,
      multiplePeople: false,
      phoneDetected: false,
    });
  };

  return {
    videoRef,
    canvasRef,
    violations,
    violationCounts,
    isModelLoaded,
    resetViolations,
  };
};