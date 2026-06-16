import React, { useState } from 'react';
import { RefreshCw, Copy, Check, ShieldAlert, FileCode } from 'lucide-react';

export default function Base64Tool() {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const processText = () => {
    setErrorText(null);
    if (!inputText) {
      setOutputText('');
      return;
    }

    try {
      if (direction === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
      }
    } catch (err) {
      console.error(err);
      setErrorText('Malformed sequence: Base64 decode string is not padded correctly.');
      setOutputText('');
    }
  };

  const copyResult = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorText(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setOutputText(reader.result as string);
        setDirection('encode');
        setInputText(`[Sourced base64 from file loader: ${file.name}]`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Base64 Tool</h3>
        <span className="text-xs text-text-desc font-mono">FILE DATA BINARY ENCODER</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        <div className="flex bg-main-bg/50 p-1.5 rounded border border-white/5 gap-2">
          <button
            onClick={() => {
              setDirection('encode');
              setInputText('');
              setOutputText('');
              setErrorText(null);
            }}
            className={`flex-1 py-1.5 rounded cursor-pointer transition-all text-xs font-bold uppercase ${
              direction === 'encode' ? 'bg-accent-cyan text-black font-extrabold' : 'text-white'
            }`}
          >
            Encode Plain &rarr; Base64
          </button>
          <button
            onClick={() => {
              setDirection('decode');
              setInputText('');
              setOutputText('');
              setErrorText(null);
            }}
            className={`flex-1 py-1.5 rounded cursor-pointer transition-all text-xs font-bold uppercase ${
              direction === 'decode' ? 'bg-accent-cyan text-black font-extrabold' : 'text-white'
            }`}
          >
            Decode Base64 &rarr; Plain
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input block */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-text-desc block font-bold">
                {direction === 'encode' ? 'Plain UTF-8 Text Source' : 'Base64 Encoded Target'}
              </label>
              
              {direction === 'encode' && (
                <div className="flex items-center space-x-1 cursor-pointer">
                  <span className="text-[10px] text-accent-cyan select-none relative font-mono font-bold">
                     Encode Local File Instead:
                  </span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="b64File"
                  />
                  <label
                    htmlFor="b64File"
                    className="px-1.5 py-0.5 bg-accent-cyan/15 hover:bg-accent-cyan/40 text-accent-cyan rounded text-[9px] font-bold cursor-pointer"
                  >
                    Load File
                  </label>
                </div>
              )}
            </div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={direction === 'encode' ? 'Paste clean unencoded content...' : 'Paste sanitized base64 block...'}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1.5 text-white outline-none focus:border-accent-cyan text-xs font-mono"
            />
          </div>

          {/* Output block */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-text-desc block font-bold">Computed Outputs</label>
              {outputText && (
                <button
                  onClick={copyResult}
                  className="px-1.5 py-0.5 bg-[#42f8f5]/20 text-accent-cyan rounded text-[9px] font-mono font-bold flex items-center space-x-0.5 cursor-pointer"
                >
                  {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              readOnly
              rows={4}
              value={outputText}
              placeholder="Output will display here after execution..."
              className="w-full bg-main-bg/60 border border-white/10 rounded px-2.5 py-1.5 text-text-desc outline-none focus:border-accent-cyan text-xs font-mono break-all"
            />
          </div>
        </div>

        {errorText && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 p-2 rounded text-xs justify-center border border-red-500/15">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        <button
          onClick={processText}
          className="w-full bg-accent-cyan hover:bg-accent-alt text-black font-extrabold py-2 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RUN BASE64 ALGORITHM</span>
        </button>

      </div>
    </div>
  );
}
