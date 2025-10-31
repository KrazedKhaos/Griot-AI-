import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Base64 decoding function
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Raw PCM to AudioBuffer decoding function
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const AIAudioEngineer: React.FC = () => {
    const [text, setText] = useState('Welcome to UbuntuConnect, where Africa\'s future is built today.');
    const [voice, setVoice] = useState('Zephyr');
    const [isLoading, setIsLoading] = useState(false);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const handleGenerate = async () => {
        if (!text) {
            setError('Please enter some text to generate audio.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAudioBuffer(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: voice },
                        },
                    },
                },
            });
            
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
                const decodedBytes = decode(base64Audio);
                const buffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
                setAudioBuffer(buffer);
            } else {
                throw new Error("No audio data received from the API.");
            }

        } catch (e) {
            console.error("AI Audio Engineer Error:", e);
            setError("Failed to generate audio. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePlay = () => {
        if (audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        }
    }
    
    const voices = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🎙️</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Audio Engineer</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create professional voiceovers for your marketing content, stories, and dramas. Type your script and select a voice.</p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                 <div>
                    <label htmlFor="audio-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Script</label>
                    <textarea
                        id="audio-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full input-style"
                        placeholder='Enter the text for your voiceover...'
                    />
                </div>
                <div>
                    <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Voice</label>
                    <select id="voice-select" value={voice} onChange={(e) => setVoice(e.target.value)} className="mt-1 block w-full input-style">
                        {voices.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Generating Audio...' : 'Generate Voiceover'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {audioBuffer && !isLoading && (
                 <div className="mt-6 text-center">
                    <button
                        onClick={handlePlay}
                        className="px-6 py-2 bg-uc-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow flex items-center mx-auto"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                         </svg>
                        Play Audio
                    </button>
                </div>
            )}

            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

export default AIAudioEngineer;