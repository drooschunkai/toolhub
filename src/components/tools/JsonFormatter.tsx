import React, { useState } from 'react';
import { RefreshCw, Copy, Check, FileCode, CheckCircle, ShieldAlert } from 'lucide-react';

export default function JsonFormatter() {
  const [inputVal, setInputVal] = useState<string>('{"tool":"toolhub","version":1.0,"features":["convertors","calculators"],"specs":{"speed":"blazing","offline":true}}');
  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState<{ status: 'success' | 'free' | 'error'; text: string } | null>(null);

  const formatJson = (spaces: number = 2) => {
    setValidationMsg(null);
    if (!inputVal.trim()) {
      setOutputVal('');
      return;
    }

    try {
      const parsed = JSON.parse(inputVal);
      setOutputVal(JSON.stringify(parsed, null, spaces));
      setValidationMsg({ status: 'success', text: 'Valid JSON format parsed successfully.' });
    } catch (err: any) {
      console.error(err);
      setOutputVal('');
      setValidationMsg({ status: 'error', text: `Syntax invalid: ${err.message}` });
    }
  };

  const minifyJson = () => {
    setValidationMsg(null);
    if (!inputVal.trim()) {
      setOutputVal('');
      return;
    }

    try {
      const parsed = JSON.parse(inputVal);
      setOutputVal(JSON.stringify(parsed));
      setValidationMsg({ status: 'success', text: 'JSON successfully minified into compressed line.' });
    } catch (err: any) {
      console.error(err);
      setOutputVal('');
      setValidationMsg({ status: 'error', text: `Syntax invalid: ${err.message}` });
    }
  };

  const copyResult = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">JSON Formatter & Tester</h3>
        <span className="text-xs text-text-desc font-mono">PRETTIFY • MINIFY</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input text block */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc block font-bold mb-1">Enter Raw JSON Payload</label>
            <textarea
              rows={8}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste raw unformatted json code payload..."
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1.5 text-white outline-none focus:border-accent-cyan text-xs font-mono"
            />
          </div>

          {/* Formatted output block */}
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-text-desc block font-bold">Processed output code</label>
              {outputVal && (
                <button
                  onClick={copyResult}
                  className="px-1.5 py-0.5 bg-[#42f8f5]/20 text-accent-cyan rounded text-[9.5px] font-mono font-bold flex items-center space-x-0.5 cursor-pointer"
                >
                  {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              readOnly
              rows={8}
              value={outputVal}
              placeholder="Outputs will display after formatter parsed..."
              className="w-full bg-main-bg/50 border border-white/5 rounded px-2.5 py-1.5 text-text-desc font-mono text-xs whitespace-pre select-all"
            />
          </div>
        </div>

        {/* Validation notifications */}
        {validationMsg && (
          <div
            className={`flex items-center space-x-2 p-2 rounded text-xs justify-center border ${
              validationMsg.status === 'success'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15'
                : 'text-red-400 bg-red-500/10 border-red-500/15'
            }`}
          >
            {validationMsg.status === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{validationMsg.text}</span>
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => formatJson(2)}
            className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-extrabold py-2 px-3 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1 cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Format Beautify</span>
          </button>
          
          <button
            onClick={minifyJson}
            className="flex-1 bg-nav-bg hover:bg-accent-cyan border border-accent-cyan text-white hover:text-black font-bold py-2 px-3 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Minify Code</span>
          </button>
        </div>

      </div>
    </div>
  );
}
