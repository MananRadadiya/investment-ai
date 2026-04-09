import { useState, useCallback, useRef, useEffect } from 'react';

const routes = {
  'dashboard': '/dashboard',
  'portfolio': '/portfolio',
  'market': '/market',
  'transactions': '/transactions',
  'agents': '/agents',
  'simulator': '/simulator',
  'analytics': '/analytics',
  'ai chat': '/ai-chat',
  'news': '/news',
  'learn': '/learn',
  'calendar': '/calendar',
  'profile': '/profile',
  'alerts': '/alerts',
  'goals': '/goals',
  'settings': '/settings',
  'paper trading': '/paper-trading',
  'backtester': '/backtester',
  'heatmap': '/heatmap',
  'sentiment': '/sentiment',
  'patterns': '/pattern-recognition',
  'risk simulator': '/risk-simulator',
  'optimizer': '/portfolio-optimizer',
  'glossary': '/glossary',
  'tutorials': '/tutorials',
  'dividends': '/dividends',
  'dca': '/dca-calculator',
  'tax': '/tax-harvesting',
  'earnings': '/earnings-calendar',
  'correlation': '/correlation-matrix',
  'candlestick': '/candlestick-chart',
  'x-ray': '/portfolio-xray',
  'replay': '/market-replay',
  'strategy': '/strategy-builder',
  'export': '/export-import',
  'performance': '/performance-score',
  'collaboration': '/collaboration',
  'tech stocks': '/market',
  'crypto': '/market',
  'help': '/help',
};

export function useVoiceCommands(navigate) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;
    }
  }, []);

  const processCommand = useCallback((text) => {
    const lower = text.toLowerCase().trim();

    // Remove common prefixes
    const cleaned = lower
      .replace(/^(hey agent|ok agent|agent|show me|go to|open|navigate to|take me to)\s*/i, '')
      .trim();

    // Find matching route
    for (const [key, path] of Object.entries(routes)) {
      if (cleaned.includes(key)) {
        navigate(path);
        setLastCommand(`Navigating to ${key}`);
        return true;
      }
    }

    setLastCommand(`Command not recognized: "${text}"`);
    return false;
  }, [navigate]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          processCommand(text);
        } else {
          interimTranscript += text;
        }
      }
      setTranscript(interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTranscript('');
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch {}
  }, [processCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    lastCommand,
    supported,
    startListening,
    stopListening,
  };
}
