import React from 'react';
import { X, ArrowLeft } from 'lucide-react';

import ImageConverter from './tools/ImageConverter';
import ImageCompressor from './tools/ImageCompressor';
import ImageCropper from './tools/ImageCropper';
import VideoController from './tools/VideoController';
import AudioManipulator from './tools/AudioManipulator';
import AudioTrimmer from './tools/AudioTrimmer';
import AgeCalculator from './tools/AgeCalculator';
import EmiCalculator from './tools/EmiCalculator';
import SipCalculator from './tools/SipCalculator';
import QrGenerator from './tools/QrGenerator';
import PasswordGenerator from './tools/PasswordGenerator';
import WordCounter from './tools/WordCounter';
import Base64Tool from './tools/Base64Tool';
import ColorPicker from './tools/ColorPicker';
import TextToSpeech from './tools/TextToSpeech';
import SpeechToText from './tools/SpeechToText';
import JsonFormatter from './tools/JsonFormatter';
import UnitConverter from './tools/UnitConverter';
import BmiCalculator from './tools/BmiCalculator';
import StopwatchTimer from './tools/StopwatchTimer';

interface ToolModalProps {
  toolId: string | null;
  onClose: () => void;
}

export default function ToolModal({ toolId, onClose }: ToolModalProps) {
  if (!toolId) return null;

  // Dynamically map active tool
  const renderActiveTool = () => {
    switch (toolId) {
      case 'imgConv': return <ImageConverter />;
      case 'imgComp': return <ImageCompressor />;
      case 'imgCrop': return <ImageCropper />;
      case 'videoCtrl': return <VideoController />;
      case 'audioManip': return <AudioManipulator />;
      case 'audioTrim': return <AudioTrimmer />;
      case 'ageCalc': return <AgeCalculator />;
      case 'emiCalc': return <EmiCalculator />;
      case 'sipCalc': return <SipCalculator />;
      case 'bmiCalc': return <BmiCalculator />;
      case 'qrGen': return <QrGenerator />;
      case 'colorPick': return <ColorPicker />;
      case 'tts': return <TextToSpeech />;
      case 'stt': return <SpeechToText />;
      case 'swTimer': return <StopwatchTimer />;
      case 'passGen': return <PasswordGenerator />;
      case 'wordCount': return <WordCounter />;
      case 'base64': return <Base64Tool />;
      case 'jsonFormat': return <JsonFormatter />;
      case 'unitConv': return <UnitConverter />;
      default:
        return (
          <div className="text-center py-10 font-mono text-xs text-text-desc">
            Requested tool logic context not found.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn">
      {/* Blurred Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Actual Modal container */}
      <div className="relative bg-nav-bg border border-accent-cyan/40 glow-cyan rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 max-w-inner z-10 flex flex-col justify-start">
        {/* Navigation header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-accent-cyan/15">
          <button
            onClick={onClose}
            className="text-text-desc hover:text-accent-cyan text-xs font-bold uppercase flex items-center space-x-1 font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={onClose}
            className="text-text-desc hover:text-accent-cyan p-1.5 hover:bg-main-bg/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Tool context frame */}
        <div className="flex-1 overflow-x-hidden">
          {renderActiveTool()}
        </div>
      </div>
    </div>
  );
}
