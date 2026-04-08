"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Send } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Fluix() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
            fetchMessages();

            const channel = supabase
            .channel('fluix-chat')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    setMessages((current) => [...current, payload.new]);
                })
            .subscribe();

            return () => { supabase.removeChannel(channel); };
    }, []);

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        await supabase.from('messages').insert([{ text: input }]);
        setInput('');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center p-4">
        <header className="w-full max-w-2xl py-6 flex justify-between items-center border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tighter text-blue-500">FLUIX</h1>
        <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">v 0.1.0</span>
        </header>

        <div className="flex-1 w-full max-w-2xl overflow-y-auto my-4 space-y-3 pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl w-fit max-w-[80%] animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm">{msg.text}</p>
            </div>
        ))}
        </div>

        <form onSubmit={send} className="w-full max-w-2xl flex gap-2 pb-6">
        <input
        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Напишите сообщение..."
        />
        <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all active:scale-95">
        <Send size={20} />
        </button>
        </form>

        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
            `}</style>
            </div>
    );
}
